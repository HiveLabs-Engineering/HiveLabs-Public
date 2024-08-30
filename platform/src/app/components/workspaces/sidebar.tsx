import * as React from "react";
import { useRouter } from "next/router"; // Import the useRouter hook

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/app/components/ui/tooltip";

import {
  ClipboardIcon,
  ClockIcon,
  Cog6ToothIcon,
  CommandLineIcon,
  HomeIcon,
  LifebuoyIcon,
  UserGroupIcon,
} from "@heroicons/react/20/solid";
import { api } from "~/trpc/react";
import { usePathname } from "next/navigation";

import { Skeleton } from "~/app/components/ui/skeleton";
import Link from "next/link";

interface TooltipItem {
  icon: React.ElementType;
  text: string;
  href: string;
}

export function Sidebar(): JSX.Element {
  const path = usePathname();
  const { data } = api.spaces.fetch.useQuery({ id: `${path.split("/")[1]}` });

  // Function to determine if a link is active
  const isLinkActive = (href: string): boolean => {
    if (`${path.split("/")[1]}/${path.split("/")[2]}`) {
      return `${path.split("/")[1]}/${path.split("/")[2]}` === href;
    } else {
      return `${path.split("/")[1]}` === href;
    }
  };

  // TooltipContent components for each link
  const tooltips: TooltipItem[] = [
    { icon: HomeIcon, text: "Overview", href: `/${path.split("/")[1]}` },
    {
      icon: ClockIcon,
      text: "Activity",
      href: `${path.split("/")[1]}/activity`,
    },
    {
      icon: UserGroupIcon,
      text: "Staff Team",
      href: `${path.split("/")[1]}/staff`,
    },
    {
      icon: ClipboardIcon,
      text: "Assignments",
      href: `${path.split("/")[1]}/assignments`,
    },
  ];

  return (
    <aside className="flex h-screen w-16 flex-col items-center overflow-y-auto border-r bg-white py-5 rtl:border-l rtl:border-r-0 dark:border-[#2e2e2e] dark:bg-[#1a1a1a]">
      <TooltipProvider>
        <Tooltip delayDuration={150}>
          <TooltipTrigger asChild>
            <div>
              {!data ? (
                <Skeleton className="h-10 w-[40px] rounded-lg" />
              ) : (
                <img
                  className="h-10 w-auto rounded-lg"
                  src={`https://thumbs.metrik.app/group/${data?.groupId}`}
                  alt=""
                />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="ml-1 dark:bg-[#454545] dark:text-white"
          >
            <p>Switch Workspace</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <nav className="mt-1 flex flex-1 flex-col">
        {tooltips.map((tooltip, index) => (
          <TooltipProvider key={index}>
            <Tooltip delayDuration={150}>
              <TooltipTrigger asChild>
                <Link
                  href={tooltip.href}
                  className={`mt-3 rounded-lg p-1.5 text-zinc-700 transition-colors duration-200 focus:outline-none ${isLinkActive(tooltip.href) ? `text-[#ff3d6a] dark:text-[#ff3d6a]` : "dark:text-zinc-300"} ${isLinkActive(tooltip.href) ? "bg-zinc-100 dark:bg-[#282828]" : "hover:bg-zinc-100 dark:hover:bg-[#282828]"}`}
                >
                  <tooltip.icon className="h-6" />
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="ml-1 dark:bg-[#454545] dark:text-white"
              >
                <p>{tooltip.text}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </nav>

      <div className="flex flex-col">
        <TooltipProvider>
          <Tooltip delayDuration={150}>
            <TooltipTrigger asChild>
              <Link
                href="https://help.hivelabs.app"
                className="focus:outline-nones mt-3 rounded-lg p-1.5 text-zinc-700 transition-colors duration-200 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-[#282828] dark:hover:bg-zinc-800"
              >
                <LifebuoyIcon className="h-6" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Help Center</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip delayDuration={150}>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="focus:outline-nones mt-3 rounded-lg p-1.5 text-zinc-700 transition-colors duration-200 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-[#282828] dark:hover:bg-zinc-800"
              >
                <CommandLineIcon />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Documentation</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip delayDuration={150}>
            <TooltipTrigger asChild>
              <Link
                href={`${path.split("/")[1]}/settings`}
                className={`mt-3 rounded-lg p-1.5 text-zinc-700 transition-colors duration-200 focus:outline-none ${isLinkActive(`${path.split("/")[2]}/settings`) ? "text-[#93b23a] dark:text-[#93b23a]" : "dark:text-zinc-300"} ${isLinkActive(`${path.split("/")[2]}/settings`) ? "bg-zinc-100 dark:bg-[#282828]" : "hover:bg-zinc-100 dark:hover:bg-[#282828]"}`}
              >
                <Cog6ToothIcon />
              </Link>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="dark:bg-[#454545] dark:text-white"
            >
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
}
