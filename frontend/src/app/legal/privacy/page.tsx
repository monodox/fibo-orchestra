import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: December 15, 2025</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Introduction</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              Fibo Orchestra ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. 
              This Privacy Policy explains how we collect, use, and safeguard your information when you use our Service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <h3 className="text-lg font-semibold mt-4 mb-2">Account Information</h3>
            <ul>
              <li>Email address</li>
              <li>Name</li>
              <li>Password (encrypted)</li>
              <li>Account preferences</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">Usage Data</h3>
            <ul>
              <li>Project and render history</li>
              <li>Generated prompts and JSON configurations</li>
              <li>API usage statistics</li>
              <li>Browser type and device information</li>
              <li>IP address and location data</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">API Keys (Client-Side Storage)</h3>
            <p>
              When using client-side API key storage, your keys are stored in your browser's localStorage and are never 
              transmitted to our servers. This method is recommended for development and prototyping only.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>We use collected information to:</p>
            <ul>
              <li>Provide and maintain the Service</li>
              <li>Authenticate and manage user accounts</li>
              <li>Store and retrieve your projects and render history</li>
              <li>Improve and optimize the Service</li>
              <li>Communicate important updates and notifications</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Data Storage and Security</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              We implement industry-standard security measures to protect your data, including:
            </p>
            <ul>
              <li>Encryption of data in transit (HTTPS/TLS)</li>
              <li>Encrypted password storage using bcrypt</li>
              <li>Secure backend environment for API keys (production deployments)</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
            </ul>
            <p>
              However, no method of transmission over the Internet is 100% secure. While we strive to protect your data, 
              we cannot guarantee absolute security.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              Fibo Orchestra integrates with third-party AI providers (Bria, Replicate, FAL.ai, Runware). When you use 
              these services through our platform, your data may be processed by these providers according to their 
              respective privacy policies:
            </p>
            <ul>
              <li>Bria AI: <a href="https://bria.ai/privacy" className="text-primary hover:underline">bria.ai/privacy</a></li>
              <li>Replicate: <a href="https://replicate.com/privacy" className="text-primary hover:underline">replicate.com/privacy</a></li>
              <li>FAL.ai: <a href="https://fal.ai/privacy" className="text-primary hover:underline">fal.ai/privacy</a></li>
              <li>Runware: <a href="https://runware.ai/privacy" className="text-primary hover:underline">runware.ai/privacy</a></li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              We use cookies and similar tracking technologies to enhance your experience. See our{" "}
              <a href="/legal/cookies" className="text-primary hover:underline">Cookie Policy</a> for detailed information.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              We retain your personal data for as long as your account is active or as needed to provide the Service. 
              You may request deletion of your account and associated data at any time.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              Our Service is not intended for children under 13 years of age. We do not knowingly collect personal 
              information from children. If you become aware that a child has provided us with personal data, please 
              contact us.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              Your data may be transferred to and processed in countries other than your country of residence. We ensure 
              appropriate safeguards are in place for such transfers.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>11. Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes by updating 
              the "Last updated" date and posting the new policy on this page.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>12. Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              For questions about this Privacy Policy or to exercise your rights, please contact us through our GitHub 
              repository at{" "}
              <a href="https://github.com/monodox/fibo-orchestra" className="text-primary hover:underline">
                github.com/monodox/fibo-orchestra
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
