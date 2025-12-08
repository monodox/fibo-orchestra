"use client";

import { Plug, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

export default function IntegrationsPage() {
  const [replicateKey, setReplicateKey] = useState("");
  const [falKey, setFalKey] = useState("");
  const [briaKey, setBriaKey] = useState("");
  const [runwareKey, setRunwareKey] = useState("");
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    // Load saved keys from localStorage
    setReplicateKey(localStorage.getItem("replicate_api_key") || "");
    setFalKey(localStorage.getItem("fal_api_key") || "");
    setBriaKey(localStorage.getItem("bria_api_key") || "");
    setRunwareKey(localStorage.getItem("runware_api_key") || "");
  }, []);

  const saveKey = (provider: string, key: string) => {
    localStorage.setItem(`${provider}_api_key`, key);
    setSaved(provider);
    setTimeout(() => setSaved(null), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Plug className="w-6 h-6" />
        <h1 className="text-3xl font-bold">Integrations</h1>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Replicate</CardTitle>
            <CardDescription>Deploy models on Replicate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>API Key</Label>
              <Input 
                type="password" 
                placeholder="r8_••••••••" 
                value={replicateKey}
                onChange={(e) => setReplicateKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Get your key from <a href="https://replicate.com/account/api-tokens" target="_blank" className="underline">replicate.com</a>
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => saveKey("replicate", replicateKey)} disabled={!replicateKey} className="flex-1">
                {saved === "replicate" ? <Check className="w-4 h-4 mr-2" /> : null}
                {saved === "replicate" ? "Saved!" : "Save Key"}
              </Button>
              {replicateKey && (
                <Button variant="destructive" onClick={() => { setReplicateKey(""); localStorage.removeItem("replicate_api_key"); }}>
                  Delete
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="border-t" />

        <Card>
          <CardHeader>
            <CardTitle>FAL.ai</CardTitle>
            <CardDescription>Connect to FAL.ai services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>API Key</Label>
              <Input 
                type="password" 
                placeholder="fal_••••••••" 
                value={falKey}
                onChange={(e) => setFalKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Get your key from <a href="https://fal.ai/dashboard/keys" target="_blank" className="underline">fal.ai</a>
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => saveKey("fal", falKey)} disabled={!falKey} className="flex-1">
                {saved === "fal" ? <Check className="w-4 h-4 mr-2" /> : null}
                {saved === "fal" ? "Saved!" : "Save Key"}
              </Button>
              {falKey && (
                <Button variant="destructive" onClick={() => { setFalKey(""); localStorage.removeItem("fal_api_key"); }}>
                  Delete
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="border-t" />

        <Card>
          <CardHeader>
            <CardTitle>Bria FIBO</CardTitle>
            <CardDescription>Connect to Bria FIBO API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>API Key</Label>
              <Input 
                type="password" 
                placeholder="bria_••••••••" 
                value={briaKey}
                onChange={(e) => setBriaKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Get your key from <a href="https://bria.ai" target="_blank" className="underline">bria.ai</a>
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => saveKey("bria", briaKey)} disabled={!briaKey} className="flex-1">
                {saved === "bria" ? <Check className="w-4 h-4 mr-2" /> : null}
                {saved === "bria" ? "Saved!" : "Save Key"}
              </Button>
              {briaKey && (
                <Button variant="destructive" onClick={() => { setBriaKey(""); localStorage.removeItem("bria_api_key"); }}>
                  Delete
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="border-t" />

        <Card>
          <CardHeader>
            <CardTitle>Runware</CardTitle>
            <CardDescription>Connect to Runware API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>API Key</Label>
              <Input 
                type="password" 
                placeholder="runware_••••••••" 
                value={runwareKey}
                onChange={(e) => setRunwareKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Get your key from <a href="https://runware.ai" target="_blank" className="underline">runware.ai</a>
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => saveKey("runware", runwareKey)} disabled={!runwareKey} className="flex-1">
                {saved === "runware" ? <Check className="w-4 h-4 mr-2" /> : null}
                {saved === "runware" ? "Saved!" : "Save Key"}
              </Button>
              {runwareKey && (
                <Button variant="destructive" onClick={() => { setRunwareKey(""); localStorage.removeItem("runware_api_key"); }}>
                  Delete
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
