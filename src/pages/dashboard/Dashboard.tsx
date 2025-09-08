import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { useDashboard } from "./hooks/useDashboard";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const Dashboard = () => {
  const { stats, loading } = useDashboard();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  const displayStats = [
    {
      title: "Total Team Members",
      value: stats?.totalTeamMembers?.toString() || "0",
      change: "No change",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Skills Tracked",
      value: stats?.skillsTracked?.toString() || "0", 
      change: "No change",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Completed Assessments",
      value: stats?.completedAssessments ? `${stats.completedAssessments}%` : "0%",
      change: "No change",
      icon: CheckCircle,
      color: "text-purple-600"
    },
    {
      title: "Pending Reviews",
      value: stats?.pendingReviews?.toString() || "0",
      change: "No change",
      icon: Clock,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your team's skill development progress
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {displayStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">No recent activity</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Skills</CardTitle>
            <CardDescription>
              Most requested skills in your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">No skills data available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;