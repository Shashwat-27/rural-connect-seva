import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVideoRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true
      });

      streamRef.current = stream;
      setPreviewStream(stream);
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setVideoBlob(blob);
        setPreviewStream(null);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      throw new Error('Failed to start recording. Please check camera permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadVideo = async (caseId: string): Promise<string | null> => {
    if (!videoBlob) return null;

    try {
      setIsUploading(true);
      
      // Check authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated');
      }
      
      const fileName = `case_${caseId}_${Date.now()}.webm`;
      
      // Upload to Supabase Storage with authenticated user
      const { data, error } = await supabase.storage
        .from('medical-videos')
        .upload(fileName, videoBlob, {
          contentType: 'video/webm',
          upsert: false
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('medical-videos')
        .getPublicUrl(fileName);
      
      setIsUploading(false);
      console.log('Video uploaded successfully:', publicUrl);
      return publicUrl;
    } catch (error) {
      setIsUploading(false);
      console.error('Video upload failed:', error);
      throw error;
    }
  };

  const resetRecording = () => {
    setVideoBlob(null);
    setPreviewStream(null);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  return {
    isRecording,
    isUploading,
    videoBlob,
    previewStream,
    startRecording,
    stopRecording,
    uploadVideo,
    resetRecording
  };
};