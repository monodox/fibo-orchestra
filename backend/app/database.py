# backend/app/database.py
import json
import os
from typing import Dict, List, Any
from datetime import datetime
from uuid import uuid4

class SimpleDB:
    """Simple JSON-based database for projects and renders"""
    
    def __init__(self, db_path: str = None):
        if db_path is None:
            db_path = os.path.join(os.path.dirname(__file__), "data", "db.json")
        self.db_path = db_path
        os.makedirs(os.path.dirname(db_path), exist_ok=True)
        self._load()
        self._ensure_default_project()
    
    def _load(self):
        if os.path.exists(self.db_path):
            with open(self.db_path, "r") as f:
                self.data = json.load(f)
        else:
            self.data = {"projects": {}, "renders": {}}
            self._save()
    
    def _save(self):
        with open(self.db_path, "w") as f:
            json.dump(self.data, f, indent=2)
    
    def _ensure_default_project(self):
        """Create default project if none exist"""
        if not self.data["projects"]:
            default_project = {
                "id": "default",
                "name": "Default Project",
                "description": "This is a default project setup to get started.",
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
                "render_count": 0
            }
            self.data["projects"]["default"] = default_project
            self._save()
    
    def get_projects(self) -> List[Dict[str, Any]]:
        return list(self.data["projects"].values())
    
    def get_project(self, project_id: str) -> Dict[str, Any]:
        return self.data["projects"].get(project_id)
    
    def create_project(self, name: str, description: str = "") -> Dict[str, Any]:
        project_id = uuid4().hex
        project = {
            "id": project_id,
            "name": name,
            "description": description,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
            "render_count": 0
        }
        self.data["projects"][project_id] = project
        self._save()
        return project
    
    def update_project(self, project_id: str, name: str = None, description: str = None) -> Dict[str, Any]:
        if project_id not in self.data["projects"]:
            return None
        
        if name is not None:
            self.data["projects"][project_id]["name"] = name
        if description is not None:
            self.data["projects"][project_id]["description"] = description
        
        self.data["projects"][project_id]["updated_at"] = datetime.now().isoformat()
        self._save()
        return self.data["projects"][project_id]
    
    def delete_project(self, project_id: str) -> bool:
        if project_id not in self.data["projects"]:
            return False
        
        # Delete all renders in this project
        render_ids = [r_id for r_id, r in self.data["renders"].items() if r.get("project_id") == project_id]
        for r_id in render_ids:
            del self.data["renders"][r_id]
        
        del self.data["projects"][project_id]
        self._save()
        return True
    
    def add_render(self, project_id: str, render_data: Dict[str, Any]) -> Dict[str, Any]:
        render_id = uuid4().hex
        render = {
            "id": render_id,
            "project_id": project_id,
            "created_at": datetime.now().isoformat(),
            **render_data
        }
        self.data["renders"][render_id] = render
        
        # Update project render count
        if project_id in self.data["projects"]:
            self.data["projects"][project_id]["render_count"] += 1
            self.data["projects"][project_id]["updated_at"] = datetime.now().isoformat()
        
        self._save()
        return render
    
    def delete_render(self, render_id: str) -> bool:
        if render_id not in self.data["renders"]:
            return False
        
        render = self.data["renders"][render_id]
        project_id = render.get("project_id")
        
        # Update project render count
        if project_id and project_id in self.data["projects"]:
            self.data["projects"][project_id]["render_count"] = max(0, self.data["projects"][project_id]["render_count"] - 1)
            self.data["projects"][project_id]["updated_at"] = datetime.now().isoformat()
        
        del self.data["renders"][render_id]
        self._save()
        return True
    
    def clear_all_renders(self) -> int:
        count = len(self.data["renders"])
        self.data["renders"] = {}
        
        # Reset all project render counts
        for project in self.data["projects"].values():
            project["render_count"] = 0
            project["updated_at"] = datetime.now().isoformat()
        
        self._save()
        return count
    
    def get_renders(self, project_id: str = None) -> List[Dict[str, Any]]:
        renders = list(self.data["renders"].values())
        if project_id:
            renders = [r for r in renders if r.get("project_id") == project_id]
        return sorted(renders, key=lambda x: x["created_at"], reverse=True)

db = SimpleDB()
