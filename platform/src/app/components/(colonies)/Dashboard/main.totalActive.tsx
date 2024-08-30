import { usePathname } from "next/navigation";
import * as React from "react";
import { api } from "~/trpc/react";

export function TotalActive({ id }: { id: string }): JSX.Element {
  const { data } = api.activity.globalTotal.useQuery({ id: `${id}` });

  return (
    <div className="w-full rounded-md border border-zinc-200 bg-white px-4 py-4 outline-0 ring-0 xl:py-5 dark:border-zinc-800 dark:bg-[#1a1a1a]">
      <div>
        <p className="text-sm font-medium text-zinc-400 dark:text-zinc-400">
          Total Active Staff
        </p>
        <p className="mt-1 text-xl font-semibold text-zinc-900 dark:text-white">
          {data?.length}
        </p>
      </div>
    </div>
  );
}
