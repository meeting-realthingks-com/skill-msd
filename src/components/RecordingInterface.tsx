
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Upload,
  Waves,
  Clock,
  Users,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const RecordingInterface = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [participants, setParticipants] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout>();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Mock real-time transcription
  const mockTranscriptChunks = [
    "Hello everyone, welcome to today's meeting.",
    " We'll be discussing the quarterly review and upcoming projects.",
    " First, let's go through the agenda items.",
    " Sarah, would you like to start with the marketing update?",
    " Thank you. Our campaign performed well this quarter with a 15% increase in engagement.",
    " The social media metrics show strong growth across all platforms.",
    " Moving on to the development team updates...",
  ];

  useEffect(() => {
    if (isRecording && !isPaused) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
        
        // Simulate real-time transcription
        if (Math.random() > 0.7) {
          const randomChunk = mockTranscriptChunks[Math.floor(Math.random() * mockTranscriptChunks.length)];
          setTranscript(prev => prev + randomChunk);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording, isPaused]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      setIsTranscribing(true);
      
      toast({
        title: "Recording Started",
        description: "Meeting recording and transcription is now active.",
      });
    } catch (error) {
      toast({
        title: "Recording Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    setIsRecording(false);
    setIsPaused(false);
    setIsTranscribing(false);
    
    toast({
      title: "Recording Stopped",
      description: "Meeting has been saved and is being processed.",
    });
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    toast({
      title: isPaused ? "Recording Resumed" : "Recording Paused",
      description: isPaused ? "Transcription is active again." : "Transcription is paused.",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Meeting Setup */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">Meeting Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="meeting-title">Meeting Title</Label>
              <Input
                id="meeting-title"
                placeholder="Enter meeting title..."
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                className="bg-white/80"
              />
            </div>
            <div>
              <Label htmlFor="participants">Participants</Label>
              <Input
                id="participants"
                placeholder="Enter participant names..."
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                className="bg-white/80"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recording Controls */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-900">Recording Controls</CardTitle>
            {isRecording && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <Badge variant="destructive" className="bg-red-100 text-red-800">
                  LIVE
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recording Status */}
          <div className="text-center space-y-4">
            <div className="text-3xl font-mono font-bold text-gray-900">
              {formatTime(recordingTime)}
            </div>
            
            {isTranscribing && (
              <div className="flex items-center justify-center space-x-2 text-blue-600">
                <Waves className="w-5 h-5 animate-pulse" />
                <span className="text-sm font-medium">Transcribing in real-time...</span>
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center space-x-4">
            {!isRecording ? (
              <Button 
                onClick={startRecording}
                size="lg"
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8"
              >
                <Mic className="w-5 h-5 mr-2" />
                Start Recording
              </Button>
            ) : (
              <>
                <Button 
                  onClick={togglePause}
                  variant="outline"
                  size="lg"
                  className="px-6"
                >
                  {isPaused ? <Play className="w-5 h-5 mr-2" /> : <Pause className="w-5 h-5 mr-2" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                
                <Button 
                  onClick={stopRecording}
                  variant="destructive"
                  size="lg"
                  className="px-6"
                >
                  <Square className="w-5 h-5 mr-2" />
                  Stop Recording
                </Button>
              </>
            )}
          </div>

          {/* Upload Alternative */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>

          <div className="text-center">
            <Button variant="outline" className="bg-white/80">
              <Upload className="w-4 h-4 mr-2" />
              Upload Audio File
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live Transcript */}
      {(isRecording || transcript) && (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Live Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
              {transcript ? (
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {transcript}
                  {isTranscribing && <span className="animate-pulse">|</span>}
                </p>
              ) : (
                <p className="text-gray-500 italic">Transcript will appear here as you speak...</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
