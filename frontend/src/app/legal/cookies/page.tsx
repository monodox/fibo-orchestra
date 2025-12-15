import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Cookie Policy</h1>
        <p className="text-muted-foreground">Last updated: December 15, 2025</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. What Are Cookies?</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              Cookies are small text files that are placed on your device when you visit a website. They help websites 
              remember your preferences and improve your browsing experience. Cookies can be "persistent" (remaining on 
              your device until deleted) or "session" (deleted when you close your browser).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. How We Use Cookies</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              Fibo Orchestra uses cookies and similar technologies to provide, secure, and improve our Service. We use 
              both first-party cookies (set by us) and third-party cookies (set by our service providers).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Types of Cookies We Use</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <h3 className="text-lg font-semibold mt-4 mb-2">Essential Cookies</h3>
            <p>These cookies are necessary for the Service to function properly:</p>
            <ul>
              <li><strong>Authentication cookies:</strong> Keep you logged in and secure your session</li>
              <li><strong>Security cookies:</strong> Protect against fraud and unauthorized access</li>
              <li><strong>CSRF tokens:</strong> Prevent cross-site request forgery attacks</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">Functional Cookies</h3>
            <p>These cookies enhance functionality and personalization:</p>
            <ul>
              <li><strong>Preference cookies:</strong> Remember your settings (theme, language, etc.)</li>
              <li><strong>localStorage:</strong> Store API keys locally (when using client-side storage)</li>
              <li><strong>Project data:</strong> Cache project information for faster loading</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">Analytics Cookies</h3>
            <p>These cookies help us understand how visitors use our Service:</p>
            <ul>
              <li><strong>Usage analytics:</strong> Track page views, navigation patterns, and feature usage</li>
              <li><strong>Performance metrics:</strong> Monitor load times and identify errors</li>
              <li><strong>A/B testing:</strong> Test new features and improvements</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">Marketing Cookies (Optional)</h3>
            <p>With your consent, we may use cookies for:</p>
            <ul>
              <li><strong>Targeted advertising:</strong> Show relevant ads on third-party sites</li>
              <li><strong>Conversion tracking:</strong> Measure effectiveness of marketing campaigns</li>
              <li><strong>Social media integration:</strong> Enable sharing and social features</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. localStorage and sessionStorage</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              In addition to cookies, we use browser storage technologies (localStorage and sessionStorage) to:
            </p>
            <ul>
              <li>Store API keys locally (client-side storage option)</li>
              <li>Cache project data and render history</li>
              <li>Remember UI preferences and settings</li>
              <li>Improve application performance</li>
            </ul>
            <p className="mt-4 p-4 bg-amber-50 dark:bg-amber-950 rounded-md">
              <strong>Security Note:</strong> API keys stored in localStorage are only suitable for development and 
              prototyping. For production use, always configure API keys as backend environment variables.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Third-Party Cookies</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>Our Service may include cookies from third-party services:</p>
            <ul>
              <li><strong>Vercel Analytics:</strong> Performance monitoring and analytics</li>
              <li><strong>AI Provider APIs:</strong> Cookies set by Bria, Replicate, FAL.ai, or Runware</li>
              <li><strong>CDN Services:</strong> Content delivery and caching</li>
            </ul>
            <p>
              These third parties have their own privacy policies governing their use of cookies. We recommend reviewing 
              their policies for more information.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Cookie Duration</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Cookie Type</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-4 py-2 text-sm">Session cookies</td>
                    <td className="px-4 py-2 text-sm">Until browser is closed</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm">Authentication cookies</td>
                    <td className="px-4 py-2 text-sm">30 days</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm">Preference cookies</td>
                    <td className="px-4 py-2 text-sm">1 year</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm">Analytics cookies</td>
                    <td className="px-4 py-2 text-sm">2 years</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Managing Cookies</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>You can control cookies through your browser settings:</p>
            
            <h3 className="text-lg font-semibold mt-4 mb-2">Browser Settings</h3>
            <ul>
              <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
              <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
              <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">Cookie Preferences</h3>
            <p>
              You can also manage your cookie preferences through our cookie consent banner when you first visit the site, 
              or by accessing cookie settings in your account preferences.
            </p>

            <p className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-md">
              <strong>Note:</strong> Disabling essential cookies may prevent you from using certain features of the Service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Do Not Track</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              Some browsers include a "Do Not Track" (DNT) feature that signals to websites that you do not want to be 
              tracked. We respect DNT signals and will not track users who have DNT enabled, except for essential cookies 
              required for Service functionality.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Updates to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              We may update this Cookie Policy to reflect changes in our practices or for legal reasons. We will notify 
              you of significant changes by updating the "Last updated" date at the top of this page.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              If you have questions about our use of cookies, please contact us through our GitHub repository at{" "}
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
