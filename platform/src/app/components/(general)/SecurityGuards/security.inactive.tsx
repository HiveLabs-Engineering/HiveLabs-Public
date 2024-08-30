"use client";

import {
  KeyIcon,
  QuestionMarkCircleIcon,
  RectangleGroupIcon,
} from "@heroicons/react/20/solid";
import { ShieldIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { api } from "~/trpc/react";

export function PaymentRequired() {
  const path = usePathname();
  const { data } = api.spaces.fetch.useQuery({ id: `${path.split("/")[1]}` });

  return (
    <>
      <div className=" flex h-full flex-col justify-center overflow-hidden  ">
        <div className="flex flex-grow  flex-col items-center justify-center rounded-md ">
          <div className="space-y-3 px-3 py-7 text-center">
            <div className="flex items-center justify-center">
              <RectangleGroupIcon className="h-16 w-16 text-zinc-600 dark:text-white" />
            </div>
            <div className="mx-4">
              <p className="text-lg font-bold text-zinc-700 dark:text-white">
                We cannot find an active subscription
              </p>
              <p className="mt-2 max-w-xl text-sm text-zinc-500 dark:text-zinc-400">
                {data?.name} does not have an active subscription. Please reach
                out to the workspace owner to restore access before{" "}
                <strong>June 1, 2024</strong>. After this date, the workspace
                will be permanently deleted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
