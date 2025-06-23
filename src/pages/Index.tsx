
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mic, 
  Search, 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  TrendingUp,
  Settings,
  Play,
  Pause,
  Square
} from "lucide-react";
import { RecordingInterface } from "@/components/RecordingInterface";
import { MeetingCard } from "@/components/MeetingCard";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { SettingsPanel } from "@/components/SettingsPanel";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for demonstration
  const recentMeetings = [
    {
      id: "1",
      title: "Product Strategy Meeting",
      date: "2024-01-20",
      duration: "45 min",
      participants: ["John D.", "Sarah M.", "Mike R."],
      status: "completed",
      summary: "Discussed Q1 roadmap, prioritized features, and allocated resources for upcoming sprint.",
      actionItems: 3,
      keywords: ["roadmap", "features", "sprint planning"]
    },
    {
      id: "2",
      title: "Client Onboarding Call",
      date: "2024-01-19",
      duration: "30 min",
      participants: ["Alice K.", "Tom W."],
      status: "completed",
      summary: "Welcomed new client, explained platform features, and set up initial configuration.",
      actionItems: 5,
      keywords: ["onboarding", "configuration", "training"]
    },
    {
      id: "3",
      title: "Weekly Team Standup",
      date: "2024-01-18",
      duration: "25 min",
      participants: ["Emma L.", "David P.", "Lisa C.", "Mark T."],
      status: "completed",
      summary: "Team updates on current projects, blockers discussion, and sprint progress review.",
      actionItems: 2,
      keywords: ["standup", "progress", "blockers"]
    }
  ];

  const stats = {
    totalMeetings: 127,
    totalHours: 89.5,
    actionItems: 45,
    avgDuration: 32
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  AI Meeting Assistant
                </h1>
                <p className="text-sm text-gray-500">Powered by AI transcription & analysis</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search meetings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-white/60 backdrop-blur-sm"
                />
              </div>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-96">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="record">Record</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Meetings</CardTitle>
                  <Calendar className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalMeetings}</div>
                  <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Hours</CardTitle>
                  <Clock className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalHours}h</div>
                  <p className="text-xs text-green-600 mt-1">+8% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Action Items</CardTitle>
                  <FileText className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stats.actionItems}</div>
                  <p className="text-xs text-orange-600 mt-1">15 pending</p>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg Duration</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stats.avgDuration}min</div>
                  <p className="text-xs text-blue-600 mt-1">-5% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Meetings */}
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Recent Meetings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMeetings.map((meeting) => (
                    <MeetingCard key={meeting.id} meeting={meeting} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="record">
            <RecordingInterface />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
