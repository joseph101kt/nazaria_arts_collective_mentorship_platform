import { XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function NotApprovedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <Card className="w-full max-w-sm text-center">
        <CardContent className="flex flex-col items-center p-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive-soft text-destructive">
            <XCircle className="h-6 w-6" />
          </div>
          <h1 className="mb-1.5 text-lg font-bold">Your application wasn't approved</h1>
          <p className="text-sm text-muted-foreground">
            If you think this is a mistake, reach out to your program contact
            directly — this portal doesn't currently support re-applying with
            the same account.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}