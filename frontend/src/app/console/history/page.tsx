"use client";

import { Clock, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cacheGet, cacheSet, cacheClear } from "@/lib/cache";

export default function HistoryPage() {
  const [renders, setRenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRenders = (skipCache = false) => {
    if (!skipCache) {
      const cached = cacheGet('history-renders');
      if (cached) {
        setRenders(cached);
        setLoading(false);
        return;
      }
    }

    const API_BASE = "https://fibo-orchestra.onrender.com/api/v1";
    fetch(`${API_BASE}/renders`)
      .then(res => res.json())
      .then(data => {
        setRenders(data.renders);
        setLoading(false);
        cacheSet('history-renders', data.renders, 30);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadRenders();
  }, []);

  const handleDelete = async (renderId: string) => {
    if (!confirm("Delete this render?")) return;
    
    try {
      const API_BASE = "https://fibo-orchestra.onrender.com/api/v1";
      await fetch(`${API_BASE}/renders/${renderId}`, {
        method: "DELETE"
      });
      cacheClear('history-renders');
      cacheClear('dashboard-stats');
      loadRenders(true);
    } catch (err) {
      console.error("Failed to delete render", err);
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Clear all history? This cannot be undone.")) return;
    
    try {
      const API_BASE = "https://fibo-orchestra.onrender.com/api/v1";
      await fetch(`${API_BASE}/renders`, {
        method: "DELETE"
      });
      cacheClear('history-renders');
      cacheClear('dashboard-stats');
      loadRenders(true);
    } catch (err) {
      console.error("Failed to clear history", err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-6 h-6" />
          <h1 className="text-3xl font-bold">History</h1>
        </div>
        {renders.length > 0 && (
          <Button variant="destructive" onClick={handleClearAll}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All History
          </Button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Thumbnail</TableHead>
            <TableHead>Prompt</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                Loading...
              </TableCell>
            </TableRow>
          ) : renders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No renders yet
              </TableCell>
            </TableRow>
          ) : (
            renders.map((render) => (
              <TableRow key={render.id}>
                <TableCell>
                  <img src={render.image_url} alt="Render" className="w-16 h-16 object-cover rounded" />
                </TableCell>
                <TableCell className="max-w-md truncate">
                  {render.fibo_json?.prompt_text || "N/A"}
                </TableCell>
                <TableCell>{render.project_id}</TableCell>
                <TableCell>{new Date(render.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(render.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
