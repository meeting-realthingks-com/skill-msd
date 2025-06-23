
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Calendar, 
  Clock, 
  Users, 
  Bot,
  Link,
  Settings,
  CheckCircle2,
  AlertCircle,
  Video
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Meeting {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  participants: string[];
  platform: 'teams' | 'zoom' | 'meet';
  joinUrl: string;
  status: 'upcoming' | 'in-progress' | 'completed';
  autoJoinEnabled: boolean;
}

export const CalendarIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [autoJoinEnabled, setAutoJoinEnabled] = useState(true);
  const { toast } = useToast();

  // Mock upcoming meetings data
  useEffect(() => {
    const mockMeetings: Meeting[] = [
      {
        id: "1",
        title: "Product Strategy Review",
        startTime: "2024-01-22T14:00:00Z",
        endTime: "2024-01-22T15:00:00Z",
        participants: ["john@company.com", "sarah@company.com"],
        platform: "teams",
        joinUrl: "https://teams.microsoft.com/...",
        status: "upcoming",
        autoJoinEnabled: true
      },
      {
        id: "2",
        title: "Client Onboarding Call",
        startTime: "2024-01-22T16:30:00Z",
        endTime: "2024-01-22T17:00:00Z",
        participants: ["client@external.com", "alice@company.com"],
        platform: "teams",
        joinUrl: "https://teams.microsoft.com/...",
        status: "upcoming",
        autoJoinEnabled: false
      }
    ];
    setUpcomingMeetings(mockMeetings);
  }, []);

  const connectToOffice365 = () => {
    // Simulate OAuth connection
    setTimeout(() => {
      setIsConnected(true);
      toast({
        title: "Calendar Connected",
        description: "Successfully connected to Office 365 calendar",
      });
    }, 1500);
  };

  const toggleAutoJoin = (meetingId: string) => {
    setUpcomingMeetings(prev => 
      prev.map(meeting => 
        meeting.id === meetingId 
          ? { ...meeting, autoJoinEnabled: !meeting.autoJoinEnabled }
          : meeting
      )
    );
  };

  const joinMeeting = (meeting: Meeting) => {
    window.open(meeting.joinUrl, '_blank');
    toast({
      title: "Joining Meeting",
      description: `RT.Meet bot is joining ${meeting.title}`,
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-xl font-semibold text-gray-900">
                Calendar Integration
              </CardTitle>
            </div>
            {isConnected ? (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-orange-100 text-orange-800">
                <AlertCircle className="w-3 h-3 mr-1" />
                Not Connected
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Connect your Office 365 calendar to automatically detect and join meetings
              </p>
              <Button onClick={connectToOffice365} className="bg-blue-600 hover:bg-blue-700">
                <Link className="w-4 h-4 mr-2" />
                Connect Office 365
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Auto-Join Bot</Label>
                  <p className="text-sm text-gray-500">
                    RT.Meet bot will automatically join scheduled meetings
                  </p>
                </div>
                <Switch 
                  checked={autoJoinEnabled}
                  onCheckedChange={setAutoJoinEnabled}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Meetings */}
      {isConnected && (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Upcoming Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div 
                  key={meeting.id}
                  className="border border-gray-200 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{meeting.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {meeting.participants.length} participants
                        </div>
                        <div className="flex items-center">
                          <Video className="w-4 h-4 mr-1" />
                          MS Teams
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant="outline"
                      className={meeting.status === 'upcoming' ? 'border-blue-200 text-blue-800' : ''}
                    >
                      {meeting.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">
                        Auto-join: {meeting.autoJoinEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                      <Switch 
                        checked={meeting.autoJoinEnabled}
                        onCheckedChange={() => toggleAutoJoin(meeting.id)}
                        size="sm"
                      />
                    </div>
                    
                    <Button 
                      onClick={() => joinMeeting(meeting)}
                      size="sm"
                      variant="outline"
                    >
                      Join Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
