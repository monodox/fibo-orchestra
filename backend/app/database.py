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
        """Create default project and demo data if none exist"""
        if not self.data["projects"]:
            # Create multiple demo projects
            projects = [
                {
                    "id": "default",
                    "name": "Default Project",
                    "description": "This is a default project setup to get started.",
                    "render_count": 8
                },
                {
                    "id": "portraits",
                    "name": "Portrait Collection",
                    "description": "Professional portrait renders with various lighting setups",
                    "render_count": 6
                },
                {
                    "id": "landscapes",
                    "name": "Landscape Gallery",
                    "description": "Scenic landscapes and nature photography",
                    "render_count": 4
                },
                {
                    "id": "architecture",
                    "name": "Architecture Studio",
                    "description": "Modern and classical architectural renders",
                    "render_count": 3
                },
                {
                    "id": "experimental",
                    "name": "Experimental Art",
                    "description": "Abstract and creative experimental renders",
                    "render_count": 5
                }
            ]
            
            for i, proj in enumerate(projects):
                proj.update({
                    "created_at": (datetime.now().replace(day=i+1, hour=9)).isoformat(),
                    "updated_at": datetime.now().isoformat()
                })
                self.data["projects"][proj["id"]] = proj
            
            # Add comprehensive demo renders
            demo_renders = [
                # Default Project renders
                {
                    "id": "render_001",
                    "project_id": "default",
                    "image_url": "https://picsum.photos/512/512?random=1",
                    "fibo_json": {
                        "prompt_text": "cinematic portrait with warm lighting",
                        "camera": 50,
                        "fov": 35,
                        "lighting": "soft_rim",
                        "palette": "warm",
                        "hdr": False
                    },
                    "metadata": {"provider": "bria", "seed": 12345},
                    "created_at": (datetime.now().replace(day=1, hour=10)).isoformat()
                },
                {
                    "id": "render_002",
                    "project_id": "default",
                    "image_url": "https://picsum.photos/512/512?random=2",
                    "fibo_json": {
                        "prompt_text": "futuristic cityscape at sunset",
                        "camera": 45,
                        "fov": 40,
                        "lighting": "dramatic",
                        "palette": "cool",
                        "hdr": True
                    },
                    "metadata": {"provider": "replicate", "seed": 67890},
                    "created_at": (datetime.now().replace(day=1, hour=14)).isoformat()
                },
                {
                    "id": "render_003",
                    "project_id": "default",
                    "image_url": "https://picsum.photos/512/512?random=3",
                    "fibo_json": {
                        "prompt_text": "abstract art with vibrant colors",
                        "camera": 35,
                        "fov": 50,
                        "lighting": "ambient",
                        "palette": "vibrant",
                        "hdr": False
                    },
                    "metadata": {"provider": "fal", "seed": 11111},
                    "created_at": (datetime.now().replace(day=2, hour=9)).isoformat()
                },
                {
                    "id": "render_004",
                    "project_id": "default",
                    "image_url": "https://picsum.photos/512/512?random=4",
                    "fibo_json": {
                        "prompt_text": "minimalist product photography",
                        "camera": 85,
                        "fov": 25,
                        "lighting": "studio",
                        "palette": "neutral",
                        "hdr": False
                    },
                    "metadata": {"provider": "runware", "seed": 22222},
                    "created_at": (datetime.now().replace(day=2, hour=15)).isoformat()
                },
                {
                    "id": "render_005",
                    "project_id": "default",
                    "image_url": "https://picsum.photos/512/512?random=5",
                    "fibo_json": {
                        "prompt_text": "vintage street photography",
                        "camera": 28,
                        "fov": 60,
                        "lighting": "natural",
                        "palette": "sepia",
                        "hdr": True
                    },
                    "metadata": {"provider": "bria", "seed": 33333},
                    "created_at": (datetime.now().replace(day=3, hour=11)).isoformat()
                },
                {
                    "id": "render_006",
                    "project_id": "default",
                    "image_url": "https://picsum.photos/512/512?random=6",
                    "fibo_json": {
                        "prompt_text": "macro nature photography",
                        "camera": 100,
                        "fov": 15,
                        "lighting": "soft",
                        "palette": "natural",
                        "hdr": False
                    },
                    "metadata": {"provider": "replicate", "seed": 44444},
                    "created_at": (datetime.now().replace(day=3, hour=16)).isoformat()
                },
                {
                    "id": "render_007",
                    "project_id": "default",
                    "image_url": "https://picsum.photos/512/512?random=7",
                    "fibo_json": {
                        "prompt_text": "cyberpunk neon aesthetic",
                        "camera": 24,
                        "fov": 70,
                        "lighting": "neon",
                        "palette": "electric",
                        "hdr": True
                    },
                    "metadata": {"provider": "fal", "seed": 55555},
                    "created_at": (datetime.now().replace(day=4, hour=13)).isoformat()
                },
                {
                    "id": "render_008",
                    "project_id": "default",
                    "image_url": "https://picsum.photos/512/512?random=8",
                    "fibo_json": {
                        "prompt_text": "golden hour landscape",
                        "camera": 35,
                        "fov": 45,
                        "lighting": "golden",
                        "palette": "warm",
                        "hdr": True
                    },
                    "metadata": {"provider": "runware", "seed": 66666},
                    "created_at": (datetime.now().replace(day=5, hour=8)).isoformat()
                },
                # Portrait Collection renders
                {
                    "id": "portrait_001",
                    "project_id": "portraits",
                    "image_url": "https://picsum.photos/512/512?random=101",
                    "fibo_json": {
                        "prompt_text": "professional headshot with soft lighting",
                        "camera": 85,
                        "fov": 28,
                        "lighting": "soft_key",
                        "palette": "neutral",
                        "hdr": False
                    },
                    "metadata": {"provider": "bria", "seed": 77777},
                    "created_at": (datetime.now().replace(day=2, hour=10)).isoformat()
                },
                {
                    "id": "portrait_002",
                    "project_id": "portraits",
                    "image_url": "https://picsum.photos/512/512?random=102",
                    "fibo_json": {
                        "prompt_text": "dramatic portrait with rim lighting",
                        "camera": 135,
                        "fov": 18,
                        "lighting": "dramatic_rim",
                        "palette": "monochrome",
                        "hdr": False
                    },
                    "metadata": {"provider": "replicate", "seed": 88888},
                    "created_at": (datetime.now().replace(day=2, hour=14)).isoformat()
                },
                {
                    "id": "portrait_003",
                    "project_id": "portraits",
                    "image_url": "https://picsum.photos/512/512?random=103",
                    "fibo_json": {
                        "prompt_text": "fashion portrait with creative lighting",
                        "camera": 50,
                        "fov": 35,
                        "lighting": "creative",
                        "palette": "vibrant",
                        "hdr": True
                    },
                    "metadata": {"provider": "fal", "seed": 99999},
                    "created_at": (datetime.now().replace(day=3, hour=12)).isoformat()
                },
                {
                    "id": "portrait_004",
                    "project_id": "portraits",
                    "image_url": "https://picsum.photos/512/512?random=104",
                    "fibo_json": {
                        "prompt_text": "environmental portrait outdoors",
                        "camera": 35,
                        "fov": 50,
                        "lighting": "natural",
                        "palette": "earth_tones",
                        "hdr": False
                    },
                    "metadata": {"provider": "runware", "seed": 10101},
                    "created_at": (datetime.now().replace(day=4, hour=9)).isoformat()
                },
                {
                    "id": "portrait_005",
                    "project_id": "portraits",
                    "image_url": "https://picsum.photos/512/512?random=105",
                    "fibo_json": {
                        "prompt_text": "corporate portrait with clean background",
                        "camera": 85,
                        "fov": 28,
                        "lighting": "corporate",
                        "palette": "professional",
                        "hdr": False
                    },
                    "metadata": {"provider": "bria", "seed": 20202},
                    "created_at": (datetime.now().replace(day=4, hour=16)).isoformat()
                },
                {
                    "id": "portrait_006",
                    "project_id": "portraits",
                    "image_url": "https://picsum.photos/512/512?random=106",
                    "fibo_json": {
                        "prompt_text": "artistic portrait with shadows",
                        "camera": 50,
                        "fov": 35,
                        "lighting": "chiaroscuro",
                        "palette": "dramatic",
                        "hdr": True
                    },
                    "metadata": {"provider": "replicate", "seed": 30303},
                    "created_at": (datetime.now().replace(day=5, hour=11)).isoformat()
                },
                # Landscape renders
                {
                    "id": "landscape_001",
                    "project_id": "landscapes",
                    "image_url": "https://picsum.photos/512/512?random=201",
                    "fibo_json": {
                        "prompt_text": "mountain vista at sunrise",
                        "camera": 24,
                        "fov": 84,
                        "lighting": "sunrise",
                        "palette": "golden",
                        "hdr": True
                    },
                    "metadata": {"provider": "fal", "seed": 40404},
                    "created_at": (datetime.now().replace(day=3, hour=6)).isoformat()
                },
                {
                    "id": "landscape_002",
                    "project_id": "landscapes",
                    "image_url": "https://picsum.photos/512/512?random=202",
                    "fibo_json": {
                        "prompt_text": "coastal seascape with dramatic clouds",
                        "camera": 16,
                        "fov": 107,
                        "lighting": "stormy",
                        "palette": "moody",
                        "hdr": True
                    },
                    "metadata": {"provider": "runware", "seed": 50505},
                    "created_at": (datetime.now().replace(day=3, hour=18)).isoformat()
                },
                {
                    "id": "landscape_003",
                    "project_id": "landscapes",
                    "image_url": "https://picsum.photos/512/512?random=203",
                    "fibo_json": {
                        "prompt_text": "forest path with dappled sunlight",
                        "camera": 35,
                        "fov": 63,
                        "lighting": "dappled",
                        "palette": "forest_green",
                        "hdr": False
                    },
                    "metadata": {"provider": "bria", "seed": 60606},
                    "created_at": (datetime.now().replace(day=4, hour=14)).isoformat()
                },
                {
                    "id": "landscape_004",
                    "project_id": "landscapes",
                    "image_url": "https://picsum.photos/512/512?random=204",
                    "fibo_json": {
                        "prompt_text": "desert dunes under starry sky",
                        "camera": 14,
                        "fov": 114,
                        "lighting": "moonlight",
                        "palette": "night_blue",
                        "hdr": True
                    },
                    "metadata": {"provider": "replicate", "seed": 70707},
                    "created_at": (datetime.now().replace(day=5, hour=22)).isoformat()
                },
                # Architecture renders
                {
                    "id": "arch_001",
                    "project_id": "architecture",
                    "image_url": "https://picsum.photos/512/512?random=301",
                    "fibo_json": {
                        "prompt_text": "modern glass building facade",
                        "camera": 24,
                        "fov": 84,
                        "lighting": "architectural",
                        "palette": "steel_blue",
                        "hdr": False
                    },
                    "metadata": {"provider": "fal", "seed": 80808},
                    "created_at": (datetime.now().replace(day=4, hour=10)).isoformat()
                },
                {
                    "id": "arch_002",
                    "project_id": "architecture",
                    "image_url": "https://picsum.photos/512/512?random=302",
                    "fibo_json": {
                        "prompt_text": "classical columns with dramatic shadows",
                        "camera": 35,
                        "fov": 63,
                        "lighting": "classical",
                        "palette": "marble_white",
                        "hdr": True
                    },
                    "metadata": {"provider": "runware", "seed": 90909},
                    "created_at": (datetime.now().replace(day=4, hour=15)).isoformat()
                },
                {
                    "id": "arch_003",
                    "project_id": "architecture",
                    "image_url": "https://picsum.photos/512/512?random=303",
                    "fibo_json": {
                        "prompt_text": "brutalist concrete structure",
                        "camera": 16,
                        "fov": 107,
                        "lighting": "harsh",
                        "palette": "concrete_gray",
                        "hdr": False
                    },
                    "metadata": {"provider": "bria", "seed": 12121},
                    "created_at": (datetime.now().replace(day=5, hour=13)).isoformat()
                },
                # Experimental renders
                {
                    "id": "exp_001",
                    "project_id": "experimental",
                    "image_url": "https://picsum.photos/512/512?random=401",
                    "fibo_json": {
                        "prompt_text": "surreal dreamscape with floating objects",
                        "camera": 50,
                        "fov": 35,
                        "lighting": "surreal",
                        "palette": "psychedelic",
                        "hdr": True
                    },
                    "metadata": {"provider": "replicate", "seed": 13131},
                    "created_at": (datetime.now().replace(day=5, hour=9)).isoformat()
                },
                {
                    "id": "exp_002",
                    "project_id": "experimental",
                    "image_url": "https://picsum.photos/512/512?random=402",
                    "fibo_json": {
                        "prompt_text": "abstract geometric patterns",
                        "camera": 85,
                        "fov": 28,
                        "lighting": "geometric",
                        "palette": "neon_gradient",
                        "hdr": False
                    },
                    "metadata": {"provider": "fal", "seed": 14141},
                    "created_at": (datetime.now().replace(day=5, hour=14)).isoformat()
                },
                {
                    "id": "exp_003",
                    "project_id": "experimental",
                    "image_url": "https://picsum.photos/512/512?random=403",
                    "fibo_json": {
                        "prompt_text": "liquid metal textures",
                        "camera": 100,
                        "fov": 24,
                        "lighting": "metallic",
                        "palette": "chrome",
                        "hdr": True
                    },
                    "metadata": {"provider": "runware", "seed": 15151},
                    "created_at": (datetime.now().replace(day=6, hour=10)).isoformat()
                },
                {
                    "id": "exp_004",
                    "project_id": "experimental",
                    "image_url": "https://picsum.photos/512/512?random=404",
                    "fibo_json": {
                        "prompt_text": "fractal art with infinite recursion",
                        "camera": 35,
                        "fov": 50,
                        "lighting": "fractal",
                        "palette": "rainbow",
                        "hdr": False
                    },
                    "metadata": {"provider": "bria", "seed": 16161},
                    "created_at": (datetime.now().replace(day=6, hour=16)).isoformat()
                },
                {
                    "id": "exp_005",
                    "project_id": "experimental",
                    "image_url": "https://picsum.photos/512/512?random=405",
                    "fibo_json": {
                        "prompt_text": "particle system visualization",
                        "camera": 24,
                        "fov": 70,
                        "lighting": "particle",
                        "palette": "energy_blue",
                        "hdr": True
                    },
                    "metadata": {"provider": "replicate", "seed": 17171},
                    "created_at": (datetime.now().replace(day=7, hour=12)).isoformat()
                }
            ]
            
            for render in demo_renders:
                self.data["renders"][render["id"]] = render
            
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
