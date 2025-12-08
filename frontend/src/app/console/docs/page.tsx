"use client";

import { BookOpen, Copy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function DocsPage() {

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <BookOpen className="w-6 h-6" />
        <h1 className="text-3xl font-bold">Documentation</h1>
      </div>

      <Tabs defaultValue="schema">
        <TabsList>
          <TabsTrigger value="schema">FIBO Schema</TabsTrigger>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="schema" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>FIBO JSON Schema</CardTitle>
              <CardDescription>Complete schema reference for FIBO rendering</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Schema documentation coming soon</p>
              <Button variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                Copy Schema
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parameters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Camera Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <strong>fov</strong>: Field of view (20-120 degrees)
              </div>
              <div>
                <strong>position</strong>: [x, y, z] camera position
              </div>
              <div>
                <strong>rotation</strong>: [x, y, z] rotation in degrees
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lighting Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <strong>type</strong>: studio | natural | dramatic
              </div>
              <div>
                <strong>exposure</strong>: -2 to 2
              </div>
              <div>
                <strong>shadows</strong>: boolean
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Example Presets</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Sample JSON configurations coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
