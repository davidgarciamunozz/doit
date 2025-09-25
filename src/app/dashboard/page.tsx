import Layout from "@/components/layout";
import { createClient } from "@/lib/supabase/server";
import { InfoIcon } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  // The middleware already handles authentication, so we can safely get the user
  const { data } = await supabase.auth.getClaims();

  return (
    <Layout>
      <div className="w-full flex flex-col gap-12">
        <div className="w-full">
          <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
            <InfoIcon size="16" strokeWidth={2} />
            This is a protected page that you can only see as an authenticated
            user n
          </div>
        </div>
        <div className="flex flex-col gap-2 items-start">
          <h2 className="font-bold text-2xl mb-4">Your user details</h2>
          <pre className="text-xs sm:text-sm font-mono p-3 sm:p-4 rounded border max-h-32 sm:max-h-48 overflow-auto w-full break-words whitespace-pre-wrap">
            {JSON.stringify(data?.claims || {}, null, 2)}
          </pre>
        </div>
      </div>
    </Layout>
  );
}
