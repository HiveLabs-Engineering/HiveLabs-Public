import { usePathname } from "next/navigation";
import * as React from "react";
import { api } from "~/trpc/react";

import { Badge } from "~/app/_components/ui/badge";

export function TeamViewer({ id }: { id: string }): JSX.Element {
  const { data: roles } = api.colony.roles.useQuery({ id });
  const { data: users } = api.colony.sync.useQuery({ id });

  return (
    <>
      {users?.data.map((user: any) => (
        <div
          key={user.user.userId}
          className="w-full rounded-md border border-zinc-200 bg-white px-4 py-4 outline-none ring-0 transition duration-500 hover:cursor-pointer hover:bg-zinc-900 xl:py-5 dark:border-zinc-800 dark:bg-[#1a1a1a]"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  className="mr-2 h-6 w-6 rounded-md bg-zinc-200 outline-none ring-0 dark:bg-[#2e2e2e]"
                  src={`/api/avatar?userIds=${user.user.userId}&size=180x180&format=png`}
                  alt={`${user.user.username}'s avatar`}
                />
                <p className="text-sm font-medium text-black dark:text-white">
                  {user.user.username}
                </p>
              </div>
              <Badge variant={"secondary"}>{user.role.name}</Badge>
            </div>
            <p className="mt-1 text-xl font-semibold text-zinc-900 dark:text-white">
              <Badge variant={"outline"}>{user.user.userId}</Badge>
              <Badge className="ml-1" variant={"secondary"}>
                Not Registered
              </Badge>
              <div className="mt-2 w-full p-0.5">
                <div className="mb-1 flex justify-between text-xs font-normal text-zinc-400 dark:text-zinc-600">
                  <span>This Week - 0%</span>
                  <span>0 tasks</span>
                </div>
                <div className="relative h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-800">
                  <div
                    className="absolute top-0 h-1.5 rounded-full bg-indigo-500"
                    style={{ width: `0%` }}
                  ></div>
                </div>
              </div>
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
