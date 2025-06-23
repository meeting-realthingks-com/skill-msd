
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  Play,
  Download,
  Share
} from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: string;
  participants: string[];
  status: string;
  summary: string;
  actionItems: number;
  keywords: string[];
}

interface MeetingCardProps {
  meeting: Meeting;
}

export const MeetingCard = ({ meeting }: MeetingCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
              {meeting.title}
            </CardTitle>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {meeting.date}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {meeting.duration}
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {meeting.participants.length} participants
              </div>
            </div>
          </div>
          <Badge 
            variant={meeting.status === 'completed' ? 'default' : 'secondary'}
            className="bg-green-100 text-green-800 border-green-200"
          >
            {meeting.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Participants */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Participants:</span>
          <div className="flex -space-x-2">
            {meeting.participants.slice(0, 3).map((participant, index) => (
              <Avatar key={index} className="w-6 h-6 border-2 border-white">
                <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {participant.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            ))}
            {meeting.participants.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                <span className="text-xs text-gray-600">+{meeting.participants.length - 3}</span>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div>
          <p className="text-sm text-gray-600 line-clamp-2">{meeting.summary}</p>
        </div>

        {/* Keywords */}
        <div className="flex flex-wrap gap-2">
          {meeting.keywords.map((keyword, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {keyword}
            </Badge>
          ))}
        </div>

        {/* Action Items & Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-600">
            <FileText className="w-4 h-4 mr-1" />
            {meeting.actionItems} action items
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Play className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
