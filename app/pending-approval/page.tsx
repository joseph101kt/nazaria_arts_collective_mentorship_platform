// app/onboarding/pending-approval/page.tsx

export default function NotApprovedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      {/* Replaced Card with standard div using Shadcn-like styling */}
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white shadow-sm text-center">
        <div className="flex flex-col items-center p-8">
          
          {/* Native SVG Icon replacing XCircle, colored for a "pending" warning state */}
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6 animate-pulse"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          
          <h1 className="mb-1.5 text-lg font-bold text-slate-900">
            Application Pending Approval
          </h1>
          
          <p className="text-sm text-slate-500">
            The program manager has not approved you as a mentor yet. Please wait while 
            we review your profile. If you think this is taking too long, reach out 
            to your program contact directly.
          </p>
          
        </div>
      </div>
    </div>
  );
}