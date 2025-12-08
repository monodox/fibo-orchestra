"use client";

import { Laptop, Sparkles, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { translatePrompt, renderPreview, inspireFromImage } from "@/lib/api";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [generatedJson, setGeneratedJson] = useState("");
  const [structuredPrompt, setStructuredPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleTranslate = async () => {
    if (!prompt) return;
    
    setIsGenerating(true);
    setError("");
    setPreviewUrl("");
    
    try {
      const result = await translatePrompt(prompt);
      setGeneratedJson(JSON.stringify(result.fibo_json, null, 2));
      
      const preview = await renderPreview(result.fibo_json);
      setPreviewUrl(preview.image_url);
      setStructuredPrompt(preview.metadata?.structured_prompt || "");
    } catch (err) {
      console.error("Generation error:", err);
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Laptop className="w-6 h-6" />
        <h1 className="text-3xl font-bold">Generate</h1>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generate"><Sparkles className="w-4 h-4 mr-2" />Generate</TabsTrigger>
          <TabsTrigger value="inspire"><Upload className="w-4 h-4 mr-2" />Inspire</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Prompt Input</CardTitle>
                <CardDescription>Describe your scene and let FIBO translate it to JSON</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="A cinematic sunset over mountains with warm golden lighting..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-32"
                />
                <Button onClick={handleTranslate} disabled={!prompt || isGenerating} className="w-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isGenerating ? "Generating..." : "Translate to FIBO JSON"}
                </Button>
                {isGenerating && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    AI image generation takes time. Please wait...
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>FIBO JSON Output</CardTitle>
                <CardDescription>Structured parameters for deterministic rendering</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={generatedJson}
                  readOnly
                  placeholder="Generated JSON will appear here..."
                  className="font-mono text-xs min-h-32"
                />
                {generatedJson && (
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">Save as Preset</Button>
                    <Button variant="outline" className="flex-1">Export JSON</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inspire" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inspire from Image</CardTitle>
              <CardDescription>Upload an image to extract its structured prompt and generate variations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              <Input
                placeholder="Optional: e.g., make futuristic, add more color"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <Button
                onClick={async () => {
                  if (!imageFile) return;
                  setIsGenerating(true);
                  setError("");
                  try {
                    const result = await inspireFromImage(imageFile, prompt);
                    setPreviewUrl(result.image_url);
                    setStructuredPrompt(result.structured_prompt);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Inspire failed");
                  } finally {
                    setIsGenerating(false);
                  }
                }}
                disabled={!imageFile || isGenerating}
                className="w-full"
              >
                {isGenerating ? "Generating..." : "Generate Inspired Image"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {previewUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Generated Image</CardTitle>
              <CardDescription>Automatically saved to Default Project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
              </div>
            </CardContent>
          </Card>
          
          {structuredPrompt && (
            <Card>
              <CardHeader>
                <CardTitle>Structured Prompt</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={structuredPrompt}
                  readOnly
                  className="font-mono text-xs min-h-64"
                />
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => navigator.clipboard.writeText(structuredPrompt)}
                >
                  Copy Structured Prompt
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
