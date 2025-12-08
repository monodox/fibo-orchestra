"use client";

import { Activity, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { cacheGet, cacheSet } from "@/lib/cache";

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalRenders: 0, projectCount: 0, weeklyRenders: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check cache first
    const cachedStats = cacheGet('dashboard-stats');
    if (cachedStats) {
      setStats(cachedStats.stats);
      setChartData(cachedStats.chartData);
      setLoading(false);
      return;
    }

    Promise.all([
      fetch("http://localhost:8000/api/v1/projects").then(res => res.json()),
      fetch("http://localhost:8000/api/v1/renders").then(res => res.json())
    ])
      .then(([projectsData, rendersData]) => {
        const renders = rendersData.renders;
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const weeklyRenders = renders.filter((r: any) => new Date(r.created_at) > weekAgo).length;
        
        setStats({
          totalRenders: renders.length,
          projectCount: projectsData.projects.length,
          weeklyRenders
        });
        
        // Generate chart data (last 7 days)
        const days = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
          const dayStart = new Date(date.setHours(0, 0, 0, 0));
          const dayEnd = new Date(date.setHours(23, 59, 59, 999));
          const count = renders.filter((r: any) => {
            const renderDate = new Date(r.created_at);
            return renderDate >= dayStart && renderDate <= dayEnd;
          }).length;
          
          days.push({
            day: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
            renders: count
          });
        }
        setChartData(days);
        setLoading(false);
        
        // Cache for 30 seconds
        cacheSet('dashboard-stats', { stats: { totalRenders: renders.length, projectCount: projectsData.projects.length, weeklyRenders }, chartData: days }, 30);
      })
      .catch(() => setLoading(false));
  }, []);

  const maxRenders = Math.max(...chartData.map(d => d.renders), 1);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6" />
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Activity className="w-6 h-6" />
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Renders This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.weeklyRenders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Renders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRenders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.projectCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Render Activity (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2">
              {chartData.map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-primary/20 rounded-t relative" style={{ height: `${(data.renders / maxRenders) * 100}%`, minHeight: data.renders > 0 ? '20px' : '2px' }}>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium">
                      {data.renders > 0 ? data.renders : ''}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{data.day}</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
