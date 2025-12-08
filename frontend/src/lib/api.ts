// frontend/src/lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface FiboJson {
  prompt_text: string;
  camera: number;
  fov: number;
  lighting: string;
  palette: string;
  hdr: boolean;
  composition?: any;
}

export interface TranslateResponse {
  fibo_json: FiboJson;
}

export interface RenderPreviewResponse {
  image_url: string;
  metadata: any;
}

export interface BatchRenderResponse {
  job_id: string;
}

export interface JobStatusResponse {
  status: string;
  progress: number;
  result_url?: string;
  error?: string;
}

export async function translatePrompt(prompt: string): Promise<TranslateResponse> {
  // Get API keys from localStorage
  const apiKeys = {
    replicate: localStorage.getItem("replicate_api_key") || "",
    fal: localStorage.getItem("fal_api_key") || "",
    bria: localStorage.getItem("bria_api_key") || "",
    runware: localStorage.getItem("runware_api_key") || ""
  };

  const response = await fetch(`${API_BASE}/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, api_keys: apiKeys }),
  });
  
  if (!response.ok) {
    throw new Error(`Translation failed: ${response.statusText}`);
  }
  
  return response.json();
}

export async function renderPreview(
  fiboJson: FiboJson,
  seed?: number,
  size?: string
): Promise<RenderPreviewResponse> {
  // Get API keys from localStorage
  const apiKeys = {
    replicate: localStorage.getItem("replicate_api_key") || "",
    fal: localStorage.getItem("fal_api_key") || "",
    bria: localStorage.getItem("bria_api_key") || "",
    runware: localStorage.getItem("runware_api_key") || ""
  };

  const response = await fetch(`${API_BASE}/render-preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fibo_json: fiboJson, seed, size, api_keys: apiKeys }),
  });
  
  if (!response.ok) {
    throw new Error(`Render failed: ${response.statusText}`);
  }
  
  return response.json();
}

export async function batchRender(
  prompt: string,
  sweep?: Record<string, any[]>,
  projectId?: string
): Promise<BatchRenderResponse> {
  const response = await fetch(`${API_BASE}/batch-render`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, sweep, project_id: projectId }),
  });
  
  if (!response.ok) {
    throw new Error(`Batch render failed: ${response.statusText}`);
  }
  
  return response.json();
}

export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  const response = await fetch(`${API_BASE}/job-status/${jobId}`);
  
  if (!response.ok) {
    throw new Error(`Job status failed: ${response.statusText}`);
  }
  
  return response.json();
}

export async function healthCheck(): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE}/health`);
  return response.json();
}

export interface InspireResponse {
  image_url: string;
  structured_prompt: string;
  metadata: any;
}

export async function inspireFromImage(
  imageFile: File,
  prompt?: string,
  seed?: number
): Promise<InspireResponse> {
  // Get API keys from localStorage
  const apiKeys = {
    replicate: localStorage.getItem("replicate_api_key") || "",
    fal: localStorage.getItem("fal_api_key") || "",
    bria: localStorage.getItem("bria_api_key") || "",
    runware: localStorage.getItem("runware_api_key") || ""
  };

  // Convert image to base64
  const base64 = await fileToBase64(imageFile);
  
  const response = await fetch(`${API_BASE}/inspire`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_base64: base64.split(',')[1], // Remove data:image/png;base64, prefix
      prompt,
      seed,
      api_keys: apiKeys
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Inspire failed: ${response.statusText}`);
  }
  
  return response.json();
}

export async function refineImage(
  prompt: string,
  structuredPrompt?: string,
  fiboJson?: FiboJson,
  seed?: number
): Promise<RenderPreviewResponse> {
  // Get API keys from localStorage
  const apiKeys = {
    replicate: localStorage.getItem("replicate_api_key") || "",
    fal: localStorage.getItem("fal_api_key") || "",
    bria: localStorage.getItem("bria_api_key") || "",
    runware: localStorage.getItem("runware_api_key") || ""
  };

  const response = await fetch(`${API_BASE}/refine`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      structured_prompt: structuredPrompt,
      fibo_json: fiboJson,
      seed,
      api_keys: apiKeys
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Refine failed: ${response.statusText}`);
  }
  
  return response.json();
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}
