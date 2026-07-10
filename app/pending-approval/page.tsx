import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PendingApprovalPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <Card className="w-full max-w-sm text-center">
        <CardContent className="flex flex-col items-center p-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-warning-soft text-warning">
            <Clock className="h-6 w-6" />
          </div>
          <h1 className="mb-1.5 text-lg font-bold">Your account is pending approval</h1>
          <p className="text-sm text-muted-foreground">
            A program manager or associate needs to approve your account before
            you can access the portal. You'll be able to sign in as soon as
            that happens — no need to sign up again.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}