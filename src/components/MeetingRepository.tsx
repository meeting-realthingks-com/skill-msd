
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  Play,
  Download,
  Share,
  Tag,
  Clock,
  FileText
} from "lucide-react";

interface MeetingRecord {
  id: string;
  title: string;
  date: string;
  duration: string;
  participants: string[];
  tags: string[];
  summary: string;
  actionItems: number;
  audioUrl: string;
  transcriptUrl: string;
  topics: string[];
  decisions: string[];
}

export const MeetingRepository = () => {
  const [meetings, setMeetings] = useState<MeetingRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [filteredMeetings, setFilteredMeetings] = useState<MeetingRecord[]>([]);

  // Mock meeting data
  useEffect(() => {
    const mockMeetings: MeetingRecord[] = [
      {
        id: "1",
        title: "Product Strategy Meeting",
        date: "2024-01-20",
        duration: "45 min",
        participants: ["John D.", "Sarah M.", "Mike R."],
        tags: ["strategy", "product", "planning"],
        summary: "Discussed Q1 roadmap, prioritized features, and allocated resources for upcoming sprint.",
        actionItems: 3,
        audioUrl: "/audio/meeting1.mp3",
        transcriptUrl: "/transcripts/meeting1.txt",
        topics: ["roadmap", "features", "sprint planning", "resource allocation"],
        decisions: ["Use React for frontend", "Hire 2 developers", "Launch by March"]
      },
      {
        id: "2",
        title: "Client Onboarding Call",
        date: "2024-01-19",
        duration: "30 min",
        participants: ["Alice K.", "Tom W.", "Client Rep"],
        tags: ["client", "onboarding", "training"],
        summary: "Welcomed new client, explained platform features, and set up initial configuration.",
        actionItems: 5,
        audioUrl: "/audio/meeting2.mp3",
        transcriptUrl: "/transcripts/meeting2.txt",
        topics: ["platform features", "configuration", "training schedule"],
        decisions: ["Weekly check-ins", "Custom dashboard", "Training next week"]
      },
      {
        id: "3",
        title: "Weekly Team Standup",
        date: "2024-01-18",
        duration: "25 min",
        participants: ["Emma L.", "David P.", "Lisa C.", "Mark T."],
        tags: ["standup", "team", "progress"],
        summary: "Team updates on current projects, blockers discussion, and sprint progress review.",
        actionItems: 2,
        audioUrl: "/audio/meeting3.mp3",
        transcriptUrl: "/transcripts/meeting3.txt",
        topics: ["sprint progress", "blockers", "team updates"],
        decisions: ["Extend sprint by 2 days", "Focus on bug fixes"]
      }
    ];
    setMeetings(mockMeetings);
    setFilteredMeetings(mockMeetings);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = meetings;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(meeting =>
        meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meeting.participants.some(p => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
        meeting.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        meeting.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
        meeting.summary.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (filterBy !== "all") {
      filtered = filtered.filter(meeting =>
        meeting.tags.includes(filterBy)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "duration":
          return parseInt(b.duration) - parseInt(a.duration);
        case "participants":
          return b.participants.length - a.participants.length;
        default:
          return 0;
      }
    });

    setFilteredMeetings(filtered);
  }, [meetings, searchQuery, filterBy, sortBy]);

  const playAudio = (audioUrl: string, title: string) => {
    console.log(`Playing audio for: ${title}`);
    // In a real app, this would integrate with an audio player
  };

  const downloadTranscript = (transcriptUrl: string, title: string) => {
    console.log(`Downloading transcript for: ${title}`);
    // In a real app, this would trigger a download
  };

  const shareMeeting = (meeting: MeetingRecord) => {
    console.log(`Sharing meeting: ${meeting.title}`);
    // In a real app, this would open a sharing modal
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Meeting Repository
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search meetings, participants, topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/80"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-40 bg-white/80">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="strategy">Strategy</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="standup">Standup</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32 bg-white/80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="participants">Participants</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meeting Results */}
      <div className="space-y-4">
        {filteredMeetings.map((meeting) => (
          <Card key={meeting.id} className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {meeting.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
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
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      {meeting.actionItems} action items
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {meeting.summary}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {meeting.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Key Topics */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Key Topics:</p>
                <div className="flex flex-wrap gap-1">
                  {meeting.topics.map((topic, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  Participants: {meeting.participants.join(", ")}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => playAudio(meeting.audioUrl, meeting.title)}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Play
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => downloadTranscript(meeting.transcriptUrl, meeting.title)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => shareMeeting(meeting)}
                  >
                    <Share className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMeetings.length === 0 && (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No meetings found matching your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
