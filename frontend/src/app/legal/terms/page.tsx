import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: December 15, 2025</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              By accessing and using Fibo Orchestra ("the Service"), you accept and agree to be bound by the terms and 
              provision of this agreement. If you do not agree to these terms, please do not use the Service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Description of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              Fibo Orchestra is an open-source JSON-native visual generation console built on Bria FIBO and other AI image 
              generation providers. The Service provides tools for creating, managing, and rendering AI-generated images 
              through a web-based interface.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. User Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>You agree to:</p>
            <ul>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Be responsible for all activities under your account</li>
              <li>Use the Service in compliance with all applicable laws</li>
              <li>Not use the Service to generate illegal, harmful, or offensive content</li>
              <li>Respect intellectual property rights of others</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. API Keys and Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              Fibo Orchestra integrates with third-party AI providers (Bria, Replicate, FAL.ai, Runware). You are responsible 
              for obtaining and managing your own API keys. Your use of these services is subject to their respective terms 
              of service and privacy policies.
            </p>
            <p>
              We do not store or have access to your API keys when using client-side storage. For production deployments 
              with backend environment variables, API keys are encrypted and stored securely.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Content and Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              You retain ownership of content you create using the Service. However, generated images may be subject to 
              the terms and conditions of the AI provider used to generate them.
            </p>
            <p>
              The Fibo Orchestra software is open source and licensed under the MIT License. The FIBO model is subject to 
              Bria's licensing terms for non-commercial use.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Prohibited Uses</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>You may not use the Service to:</p>
            <ul>
              <li>Generate illegal, harmful, hateful, or offensive content</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Distribute malware or conduct security attacks</li>
              <li>Impersonate others or misrepresent your identity</li>
              <li>Scrape or collect data without permission</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Service Availability</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              We strive to maintain service availability but do not guarantee uninterrupted access. The Service may be 
              temporarily unavailable due to maintenance, updates, or technical issues. We reserve the right to modify or 
              discontinue the Service at any time.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Disclaimer of Warranties</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT 
              THAT THE SERVICE WILL BE ERROR-FREE, SECURE, OR UNINTERRUPTED.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
              CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              We reserve the right to modify these terms at any time. We will notify users of significant changes by 
              updating the "Last updated" date. Continued use of the Service after changes constitutes acceptance of the 
              new terms.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>11. Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              For questions about these Terms of Service, please contact us through our GitHub repository at 
              <a href="https://github.com/monodox/fibo-orchestra" className="text-primary hover:underline ml-1">
                github.com/monodox/fibo-orchestra
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
