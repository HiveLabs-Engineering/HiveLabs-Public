"use client";

import {
  KeyIcon,
  QuestionMarkCircleIcon,
  RectangleGroupIcon,
} from "@heroicons/react/20/solid";
import { LucideShieldBan, ShieldIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { api } from "~/trpc/react";

export function WorkspaceDisabled() {
  const path = usePathname();
  const { data } = api.spaces.fetch.useQuery({ id: `${path.split("/")[1]}` });

  return (
    <>
      <div className=" flex h-full flex-col justify-center overflow-hidden  ">
        <div className="flex flex-grow  flex-col items-center justify-center rounded-md ">
          <div className="space-y-3 px-3 py-7 text-center">
            <div className="flex items-center justify-center">
              <LucideShieldBan className="h-16 w-16 text-zinc-600 dark:text-white" />
            </div>
            <div className="mx-4">
              <p className="text-lg font-bold text-zinc-700 dark:text-white">
                This workspace has been disabled
              </p>
              <p className="mt-2 max-w-xl text-sm text-zinc-500 dark:text-zinc-400">
                {data?.name} has been disabled for violating our Terms of
                Service. If you believe this is a mistake, please either contact
                a workspace administrator or HiveLabs customer support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
