import React, { useState, useRef, useEffect } from 'react';
import { useVideoRecorder } from '../hooks/useVideoRecorder';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { LanguageToggle } from './LanguageToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Video, Play, Square, Upload, ArrowLeft, Camera, Mic } from 'lucide-react';

interface VideoRecordingComponentProps {
  onComplete: (videoUrl: string) => void;
  onBack: () => void;
}

export const VideoRecordingComponent: React.FC<VideoRecordingComponentProps> = ({ onComplete, onBack }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { isRecording, isUploading, videoBlob, previewStream, startRecording, stopRecording, uploadVideo, resetRecording } = useVideoRecorder();
  const [recordingTime, setRecordingTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Set up live preview when stream is available
  useEffect(() => {
    if (previewRef.current && previewStream) {
      previewRef.current.srcObject = previewStream;
    }
  }, [previewStream]);

  const handleStartRecording = async () => {
    try {
      await startRecording();
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: t.recordingStarted,
        description: t.recordingStartedDesc,
      });
    } catch (error) {
      toast({
        title: t.recordingFailed,
        description: t.recordingFailedDesc,
        variant: "destructive",
      });
    }
  };

  const handleStopRecording = () => {
    stopRecording();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    toast({
      title: t.recordingStopped,
      description: t.recordingStoppedDesc,
    });
  };

  const handleUpload = async () => {
    if (!user) {
      toast({
        title: t.error,
        description: "Please login to upload video",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const videoUrl = await uploadVideo(`case_${Date.now()}`);
      if (videoUrl) {
        onComplete(videoUrl);
      }
    } catch (error) {
      console.error('Video upload error:', error);
      toast({
        title: t.uploadFailed,
        description: t.uploadFailedDesc,
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Language Toggle */}
      <LanguageToggle />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-blue-600" />
            {t.videoConsultation}
          </CardTitle>
          <CardDescription>
            {t.videoConsultationDesc}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Recording Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800">{t.recordingInstructions}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-blue-700">
            <li className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              {t.positionCamera}
            </li>
            <li className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              {t.speakClearly}
            </li>
            <li className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              {t.keepVideo}
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Video Recording Interface */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            {/* Video Preview */}
            <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative">
              {videoBlob ? (
                <video
                  ref={videoRef}
                  controls
                  className="w-full h-full rounded-lg"
                  src={URL.createObjectURL(videoBlob)}
                />
              ) : previewStream ? (
                <video
                  ref={previewRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full rounded-lg"
                />
              ) : (
                <div className="text-white text-center">
                  <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="opacity-75">{t.cameraPreview}</p>
                </div>
              )}
              
              {/* Recording indicator */}
              {isRecording && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">REC {formatTime(recordingTime)}</span>
                </div>
              )}
            </div>

            {/* Recording Controls */}
            <div className="flex justify-center gap-4">
              {!isRecording && !videoBlob && (
                <Button
                  onClick={handleStartRecording}
                  className="bg-red-600 hover:bg-red-700 text-white px-6"
                  size="lg"
                >
                  <Play className="h-5 w-5 mr-2" />
                  {t.startRecording}
                </Button>
              )}

              {isRecording && (
                <Button
                  onClick={handleStopRecording}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6"
                  size="lg"
                >
                  <Square className="h-5 w-5 mr-2" />
                  {t.stopRecording}
                </Button>
              )}

              {videoBlob && !isUploading && (
                <div className="flex gap-3">
                  <Button
                    onClick={resetRecording}
                    variant="outline"
                  >
                    {t.recordAgain}
                  </Button>
                  <Button
                    onClick={handleUpload}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    {t.sendToDoctor}
                  </Button>
                </div>
              )}

              {isUploading && (
                <Button disabled className="bg-blue-600">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  {t.uploadingVideo}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t.backToSymptoms}
        </Button>
      </div>
    </div>
  );
};