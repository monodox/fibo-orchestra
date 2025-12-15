"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle2, XCircle, Loader2 } from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"pending" | "verifying" | "success" | "error">(
    token ? "verifying" : "pending"
  );
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    setStatus("verifying");
    try {
      // TODO: Implement actual email verification logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStatus("success");
      setTimeout(() => {
        router.push("/console/dashboard");
      }, 3000);
    } catch (err) {
      setStatus("error");
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      // TODO: Implement resend verification email logic
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      console.error("Failed to resend email");
    } finally {
      setIsResending(false);
    }
  };

  if (status === "verifying") {
    return (
      <Card className="shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Verifying your email</CardTitle>
          <CardDescription className="text-center">
            Please wait while we verify your email address...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (status === "success") {
    return (
      <Card className="shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Email verified!</CardTitle>
          <CardDescription className="text-center">
            Your email has been successfully verified
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center">
            Redirecting to your dashboard...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (status === "error") {
    return (
      <Card className="shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Verification failed</CardTitle>
          <CardDescription className="text-center">
            The verification link is invalid or has expired
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            onClick={handleResend}
            className="w-full"
            disabled={isResending}
          >
            {isResending ? "Sending..." : "Resend verification email"}
          </Button>
          <Link href="/auth/login" className="w-full">
            <Button variant="outline" className="w-full">
              Back to login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  // Default pending state (no token)
  return (
    <Card className="shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
            <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Verify your email</CardTitle>
        <CardDescription className="text-center">
          We've sent a verification link to your email address
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground text-center">
          Please check your inbox and click the verification link to activate your account.
        </p>
        <p className="text-sm text-muted-foreground text-center">
          Didn't receive the email? Check your spam folder.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button
          onClick={handleResend}
          variant="outline"
          className="w-full"
          disabled={isResending}
        >
          {isResending ? "Sending..." : "Resend verification email"}
        </Button>
        <Link href="/auth/login" className="w-full">
          <Button variant="ghost" className="w-full">
            Back to login
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
