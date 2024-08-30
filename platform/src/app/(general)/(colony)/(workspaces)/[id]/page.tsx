"use client";
import { api } from "~/trpc/react";
import { AuthProvider } from "../../../../auth";
import {
  ChartBarIcon,
  CakeIcon,
  UserGroupIcon,
  RocketLaunchIcon,
  ClockIcon,
  TrophyIcon,
} from "@heroicons/react/20/solid";
import { usePathname } from "next/navigation";

import { useEffect, useState } from "react";
import { TotalActive } from "~/app/components/(colonies)/Dashboard/main.totalActive";

export default function Dashboard() {
  const path = usePathname();
  const { data } = api.spaces.fetch.useQuery({ id: `${path.split("/")[1]}` });
  const { data: globalTotals } = api.activity.findGlobals.useQuery({
    id: `${path.split("/")[1]}`,
  });

  return (
    <AuthProvider>
      <div className="ml-6 mr-6">
        <div>
          <div className="mt-5 grid gap-5 md:grid-cols-3 lg:grid-cols-3">
            <TotalActive id={`${data?.id}`} />
            <div className="w-full rounded-md border border-zinc-200 bg-white px-4 py-4 outline-0 ring-0 xl:py-5 dark:border-zinc-800 dark:bg-[#1a1a1a]">
              <div>
                <p className="text-sm font-medium text-zinc-400 dark:text-zinc-400">
                  Average Session Length
                </p>
                <p className="mt-1 text-xl font-semibold text-zinc-900 dark:text-white">
                  {globalTotals?.avg && globalTotals.amt >= 2
                    ? `${globalTotals?.avg} minutes`
                    : "0 minutes"}
                </p>
              </div>
            </div>
            <div className="w-full rounded-md border border-zinc-200 bg-white px-4 py-4 outline-0 ring-0 xl:py-5 dark:border-zinc-800 dark:bg-[#1a1a1a]">
              <div>
                <p className="text-sm font-medium text-zinc-400 dark:text-zinc-400">
                  Assignments Completed
                </p>
                <p className="mt-1 text-xl font-semibold text-zinc-900 dark:text-white">
                  0 minutes{" "}
                  <span className="text-sm font-medium text-zinc-400">
                    this week
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 grid gap-5 border-t border-zinc-200 py-3 md:grid-cols-2 dark:border-zinc-800">
            <div className="w-full rounded-md border border-zinc-200 bg-white px-4 py-4 outline-0 ring-0 xl:py-5 dark:border-zinc-800 dark:bg-[#1a1a1a]">
              <div>
                <p className="text-sm font-medium text-zinc-400 dark:text-zinc-400">
                  Recently Onboarded
                </p>
                <p className="text-md mt-1 font-semibold text-zinc-500 dark:text-white dark:text-zinc-500">
                  Looks like nobody has been recently onboarded.
                </p>
              </div>
            </div>
            <div className="w-full rounded-md border border-zinc-200 bg-white px-4 py-4 outline-0 ring-0 xl:py-5 dark:border-zinc-800 dark:bg-[#1a1a1a]">
              <div>
                <p className="text-sm font-medium text-zinc-400 dark:text-zinc-400">
                  Upcoming Birthdays
                </p>
                <p className="text-md mt-1 font-semibold text-zinc-500 dark:text-white dark:text-zinc-500">
                  {" "}
                  There are no upcoming birthdays this week.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
