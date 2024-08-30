"use client";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "../../../../../auth";
import { api } from "~/trpc/react";
import { useContext } from "react";

import { GameActivities } from "~/app/components/(colonies)/ActivityTracking/activity.template";
import { ActivityPulse } from "~/app/components/(colonies)/ActivityTracking/chart.minutes";
import { ActivityMessages } from "~/app/components/(colonies)/ActivityTracking/chart.messages";

export default function Dashboard() {
  const auth = useAuth();
  const path = usePathname();
  const { data } = api.activity.totals.useQuery({
    id: `${path.split("/")[1]}`,
    user_id: `${auth.user?.userId}`,
  });

  return (
    <AuthProvider>
      <div className="ml-6 mr-6">
        <div>
          <div className="mt-3 grid gap-5 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-2">
            <div className="mt-2 rounded-md border border-zinc-200 bg-white px-4 py-4 outline-0 ring-0 dark:border-zinc-800 dark:bg-[#1a1a1a]">
              <ActivityPulse user={auth.user} />
            </div>
            <div className="mt-2 rounded-md border border-zinc-200 bg-white px-4 py-4 outline-0 ring-0 dark:border-zinc-800 dark:bg-[#1a1a1a]">
              <ActivityMessages user={auth.user} />
            </div>
          </div>

          <div className="mt-3 grid gap-5 md:grid-cols-3 lg:grid-cols-3">
            <div className="w-full rounded-md border border-zinc-200 bg-white px-4 py-4 outline-0 ring-0 xl:py-5 dark:border-zinc-800 dark:bg-[#1a1a1a]">
              <div>
                <p className="text-sm text-zinc-400 dark:text-zinc-500">
                  Total Minutes
                </p>
                <p className="text-xl font-semibold text-zinc-900 dark:text-white">
                  {data?.minutes ? `${data?.minutes}` : "-"}
                </p>
              </div>
            </div>
            <div className="w-full rounded-md border border-zinc-200 bg-white px-4 py-4 outline-0 ring-0 xl:py-5 dark:border-zinc-800 dark:bg-[#1a1a1a]">
              <div>
                <p className="text-sm text-zinc-400 dark:text-zinc-500">
                  Total Messages
                </p>
                <p className="text-xl font-semibold text-zinc-900  dark:text-white">
                  {data?.messages ? `${data?.messages}` : "-"}
                </p>
              </div>
            </div>
            <div className="w-full rounded-md border border-zinc-200 bg-white px-4 py-4 outline-0 ring-0 xl:py-5 dark:border-zinc-800 dark:bg-[#1a1a1a]">
              <div>
                <p className="text-sm text-zinc-400 dark:text-zinc-500">
                  Average Minutes per Day
                </p>
                <p className="flex items-center text-xl font-semibold text-zinc-900 dark:text-white">
                  {data?.avg && data.amt >= 2 ? `${data?.avg} minutes` : "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 border-t dark:border-zinc-800">
            <GameActivities user={auth.user} />
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
