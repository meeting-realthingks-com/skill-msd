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
      value: stats?.totalMembers?.toString() || "0",
      change: stats?.membersChange || "No change",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Skills Tracked",
      value: stats?.totalSkills?.toString() || "0", 
      change: stats?.skillsChange || "No change",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Completed Assessments",
      value: stats?.completionRate ? `${stats.completionRate}%` : "0%",
      change: stats?.completionChange || "No change",
      icon: CheckCircle,
      color: "text-purple-600"
    },
    {
      title: "Pending Reviews",
      value: stats?.pendingReviews?.toString() || "0",
      change: stats?.reviewsChange || "No change",
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
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                </div>
              )}
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
              {stats?.topSkills && stats.topSkills.length > 0 ? (
                stats.topSkills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <Badge variant="secondary">{skill.name}</Badge>
                    <span className="text-sm text-muted-foreground">{skill.percentage}%</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No skills data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;