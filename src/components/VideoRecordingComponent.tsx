import React, { useState, useRef } from 'react';
import { useVideoRecorder } from '../hooks/useVideoRecorder';
import { useLanguage } from '../contexts/LanguageContext';
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
  const { isRecording, isUploading, videoBlob, startRecording, stopRecording, uploadVideo, resetRecording } = useVideoRecorder();
  const [recordingTime, setRecordingTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleStartRecording = async () => {
    try {
      await startRecording();
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: "Recording Started",
        description: "Please describe your symptoms to the camera",
      });
    } catch (error) {
      toast({
        title: "Recording Failed",
        description: "Please check camera permissions and try again",
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
      title: "Recording Stopped",
      description: "You can now preview or upload your video",
    });
  };

  const handleUpload = async () => {
    try {
      const videoUrl = await uploadVideo(`case_${Date.now()}`);
      if (videoUrl) {
        onComplete(videoUrl);
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Please try recording again",
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-blue-600" />
            Video Consultation Required
          </CardTitle>
          <CardDescription>
            Your condition requires a video consultation with a doctor. Please record a 2-3 minute video describing your symptoms in detail.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Recording Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800">Recording Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-blue-700">
            <li className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Position yourself clearly in front of the camera
            </li>
            <li className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Speak clearly about your symptoms and concerns
            </li>
            <li className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Keep the video between 2-3 minutes
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
              ) : (
                <div className="text-white text-center">
                  <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="opacity-75">Camera preview will appear here</p>
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
                  Start Recording
                </Button>
              )}

              {isRecording && (
                <Button
                  onClick={handleStopRecording}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6"
                  size="lg"
                >
                  <Square className="h-5 w-5 mr-2" />
                  Stop Recording
                </Button>
              )}

              {videoBlob && !isUploading && (
                <div className="flex gap-3">
                  <Button
                    onClick={resetRecording}
                    variant="outline"
                  >
                    Record Again
                  </Button>
                  <Button
                    onClick={handleUpload}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Send to Doctor
                  </Button>
                </div>
              )}

              {isUploading && (
                <Button disabled className="bg-blue-600">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Uploading Video...
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
          Back to Symptoms
        </Button>
      </div>
    </div>
  );
};