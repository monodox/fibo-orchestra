"use client";

import { Folder, ArrowLeft, Edit, Trash2, CheckSquare, Square } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [renders, setRenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedRenders, setSelectedRenders] = useState<Set<string>>(new Set());

  const loadProject = () => {
    const projectId = params.id as string;
    
    const API_BASE = "https://fibo-orchestra.onrender.com/api/v1";
    Promise.all([
      fetch(`${API_BASE}/projects/${projectId}`).then(res => res.json()),
      fetch(`${API_BASE}/renders?project_id=${projectId}`).then(res => res.json())
    ])
      .then(([projectData, rendersData]) => {
        setProject(projectData);
        setName(projectData.name);
        setDescription(projectData.description);
        setRenders(rendersData.renders);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadProject();
  }, [params.id]);

  const handleEdit = async () => {
    try {
      const API_BASE = "https://fibo-orchestra.onrender.com/api/v1";
      await fetch(`${API_BASE}/projects/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description })
      });
      setEditOpen(false);
      loadProject();
    } catch (err) {
      console.error("Failed to update project", err);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this project and all its renders?")) return;
    
    try {
      const API_BASE = "https://fibo-orchestra.onrender.com/api/v1";
      await fetch(`${API_BASE}/projects/${params.id}`, {
        method: "DELETE"
      });
      router.push("/console/projects");
    } catch (err) {
      console.error("Failed to delete project", err);
    }
  };

  const toggleRenderSelection = (renderId: string) => {
    const newSelected = new Set(selectedRenders);
    if (newSelected.has(renderId)) {
      newSelected.delete(renderId);
    } else {
      newSelected.add(renderId);
    }
    setSelectedRenders(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedRenders.size === renders.length) {
      setSelectedRenders(new Set());
    } else {
      setSelectedRenders(new Set(renders.map(r => r.id)));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRenders.size === 0) return;
    if (!confirm(`Delete ${selectedRenders.size} selected render(s)?`)) return;
    
    try {
      const API_BASE = "https://fibo-orchestra.onrender.com/api/v1";
      await Promise.all(
        Array.from(selectedRenders).map(id =>
          fetch(`${API_BASE}/renders/${id}`, { method: "DELETE" })
        )
      );
      setSelectedRenders(new Set());
      loadProject();
    } catch (err) {
      console.error("Failed to delete renders", err);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/console/projects")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Folder className="w-6 h-6" />
            <h1 className="text-3xl font-bold">{project.name}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => setEditOpen(true)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update project name and description</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Project Name</Label>
              <Input 
                id="edit-name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea 
                id="edit-description" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit} disabled={!name}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">{project.description}</p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>{project.render_count} renders</span>
            <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Renders</h2>
          {renders.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={toggleSelectAll}>
                {selectedRenders.size === renders.length ? <CheckSquare className="w-4 h-4 mr-2" /> : <Square className="w-4 h-4 mr-2" />}
                {selectedRenders.size === renders.length ? "Deselect All" : "Select All"}
              </Button>
              {selectedRenders.size > 0 && (
                <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected ({selectedRenders.size})
                </Button>
              )}
            </div>
          )}
        </div>
        {renders.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">No renders yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renders.map((render) => (
              <Card 
                key={render.id} 
                className={`relative ${selectedRenders.has(render.id) ? 'ring-2 ring-primary' : ''}`}
              >
                <div className="absolute top-2 left-2 z-10">
                  <Checkbox 
                    checked={selectedRenders.has(render.id)}
                    onCheckedChange={() => toggleRenderSelection(render.id)}
                    className="bg-background"
                  />
                </div>
                <CardContent className="pt-6">
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-2">
                    <img src={render.image_url} alt="Render" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(render.created_at).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
