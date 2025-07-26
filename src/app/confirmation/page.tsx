import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConfirmationPage() {
  return (
    <div className="flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-green-900/50 rounded-full p-3 w-fit">
            <CheckCircle2 className="h-12 w-12 text-green-400" />
          </div>
          <CardTitle className="text-2xl md:text-3xl font-headline mt-4">Thank You!</CardTitle>
          <CardDescription className="text-base">
            Your issue report has been submitted successfully.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            We appreciate you helping us improve our community. You can track the status of your report on the main dashboard.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild className="w-full max-w-xs mx-auto">
              <Link href="/">View Dashboard</Link>
            </Button>
             <Button asChild variant="outline" className="w-full max-w-xs mx-auto">
              <Link href="/report">Report Another Issue</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
