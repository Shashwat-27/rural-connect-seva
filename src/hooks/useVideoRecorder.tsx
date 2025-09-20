import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVideoRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true
      });

      streamRef.current = stream;
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
      const fileName = `case_${caseId}_${Date.now()}.webm`;
      
      // In a real app, you would create a storage bucket and upload here
      // For demo purposes, we'll simulate upload and return a dummy URL
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate upload delay
      
      const videoUrl = `https://storage.example.com/videos/${fileName}`;
      
      setIsUploading(false);
      return videoUrl;
    } catch (error) {
      setIsUploading(false);
      console.error('Video upload failed:', error);
      throw error;
    }
  };

  const resetRecording = () => {
    setVideoBlob(null);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  return {
    isRecording,
    isUploading,
    videoBlob,
    startRecording,
    stopRecording,
    uploadVideo,
    resetRecording
  };
};