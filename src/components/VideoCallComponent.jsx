import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneCall, Camera, Users } from 'lucide-react';

export const VideoCallComponent = ({ onCallEnd, onBack, patientInfo }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      endCall();
    };
  }, []);

  const startCall = async () => {
    try {
      setIsConnecting(true);
      
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      streamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Simulate call connection (in real app, this would be WebRTC connection)
      setTimeout(() => {
        setIsCallActive(true);
        setIsConnecting(false);
        startTimer();
        
        toast({
          title: t.callConnected || "Call Connected",
          description: t.callConnectedDesc || "You are now connected to the doctor",
        });
      }, 2000);
      
    } catch (error) {
      console.error('Error starting call:', error);
      setIsConnecting(false);
      toast({
        title: t.error || "Error",
        description: t.callFailedDesc || "Failed to start video call",
        variant: "destructive",
      });
    }
  };

  const endCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsCallActive(false);
    setCallDuration(0);
    
    toast({
      title: t.callEnded || "Call Ended",
      description: t.callEndedDesc || "Video call has been ended",
    });
    
    onCallEnd();
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !isMicOn;
      });
      setIsMicOn(!isMicOn);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isVideoOn;
      });
      setIsVideoOn(!isVideoOn);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6 bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <PhoneCall className="h-5 w-5" />
              {t.emergencyVideoCall || "Emergency Video Call"}
            </CardTitle>
            <CardDescription className="text-red-600">
              {t.emergencyCallDesc || "High-risk case detected. Connecting to doctor for immediate consultation."}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Patient Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {t.patientInformation || "Patient Information"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">{t.name || "Name"}:</span> {patientInfo?.name}
              </div>
              <div>
                <span className="font-medium">{t.age || "Age"}:</span> {patientInfo?.age}
              </div>
              <div>
                <span className="font-medium">{t.phone || "Phone"}:</span> {patientInfo?.phone}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Call Interface */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Local Video */}
              <div className="relative">
                <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {!isVideoOn && (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                      <Camera className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
                    {t.you || "You"} ({user?.name})
                  </div>
                  {isCallActive && (
                    <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-sm">
                      {formatTime(callDuration)}
                    </div>
                  )}
                </div>
              </div>

              {/* Remote Video */}
              <div className="relative">
                <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative">
                  {isCallActive ? (
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-white text-center">
                      <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="opacity-75">
                        {isConnecting 
                          ? (t.connecting || "Connecting to doctor...") 
                          : (t.doctorWaiting || "Doctor will join shortly")
                        }
                      </p>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
                    {t.doctor || "Doctor"}
                  </div>
                </div>
              </div>
            </div>

            {/* Call Controls */}
            <div className="flex justify-center items-center gap-4">
              {!isCallActive && !isConnecting && (
                <Button
                  onClick={startCall}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                  size="lg"
                >
                  <PhoneCall className="h-5 w-5 mr-2" />
                  {t.startCall || "Start Emergency Call"}
                </Button>
              )}

              {isConnecting && (
                <Button disabled className="bg-blue-600 px-8 py-3" size="lg">
                  <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  {t.connecting || "Connecting..."}
                </Button>
              )}

              {isCallActive && (
                <>
                  <Button
                    onClick={toggleMic}
                    variant={isMicOn ? "outline" : "destructive"}
                    size="lg"
                    className="p-3"
                  >
                    {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </Button>

                  <Button
                    onClick={toggleVideo}
                    variant={isVideoOn ? "outline" : "destructive"}
                    size="lg"
                    className="p-3"
                  >
                    {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </Button>

                  <Button
                    onClick={endCall}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
                    size="lg"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    {t.endCall || "End Call"}
                  </Button>
                </>
              )}
            </div>

            {/* Call Status */}
            {isCallActive && (
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  {t.callInProgress || "Emergency consultation in progress"} - {formatTime(callDuration)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Emergency Instructions */}
        <Card className="mt-6 bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800">
              {t.emergencyInstructions || "Emergency Instructions"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-yellow-700 text-sm">
              <li>• {t.stayCalm || "Stay calm and follow doctor's instructions"}</li>
              <li>• {t.clearAudio || "Ensure clear audio and video connection"}</li>
              <li>• {t.prepareInfo || "Have patient information and vital signs ready"}</li>
              <li>• {t.followUp || "Follow up with prescribed medications immediately"}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};