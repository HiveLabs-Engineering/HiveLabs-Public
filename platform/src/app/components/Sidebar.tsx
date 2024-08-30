import * as React from "react";
import Link from "next/link";
import { api } from "~/trpc/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/app/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "~/app/_components/ui/command";
import { Skeleton } from "~/app/components/ui/skeleton";
import {
  HomeIcon,
  ClockIcon,
  UserGroupIcon,
  ClipboardIcon,
  Cog6ToothIcon,
  Squares2X2Icon,
  CpuChipIcon,
  BeakerIcon,
  EllipsisVerticalIcon,
  SquaresPlusIcon,
} from "@heroicons/react/20/solid";
import { usePathname } from "next/navigation";
import {
  Calendar,
  CalendarCheck2,
  Shield,
  ShieldBan,
  ShieldEllipsisIcon,
} from "lucide-react";
import { useState } from "react";

interface TooltipItem {
  icon: React.ElementType;
  text: string;
  href: string;
}

function isActiveLink(path: string, href: string): boolean {
  const base = path.split("/")[1];
  const subpath = path.split("/")[2];
  return href === `/${base}/${subpath}` || href === `/${base}`;
}

export function Sidebar(): JSX.Element {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data, error } = api.spaces.fetch.useQuery({
    id: `${pathname.split("/")[1]}`,
  });

  function openCommand() {
    setOpen((open) => !open);
  }

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for a colony or create one" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            <a href={`http://localhost:3001/ready`}>
              <CommandItem className="mt-1 max-h-10 text-sm">
                <SquaresPlusIcon className="mr-2 h-6 w-6 rounded-md object-cover" />
                Create a new colony
              </CommandItem>
            </a>
            <a href={`/${data?.id}`}>
              <CommandItem className="mt-1 max-h-10 text-sm">
                {!data ? (
                  <Skeleton className="h-7 w-7 rounded-lg" />
                ) : (
                  <img
                    className="mr-2 h-6 w-6 rounded-md object-cover"
                    src={`${!data ? "" : `/api/icon/group?groupIds=${data?.groupId}&size=420x420&format=Png&isCircular=false`}`}
                    alt="avatar"
                  />
                )}

                {data?.name}
              </CommandItem>
            </a>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <aside className="flex h-screen w-60 flex-col overflow-y-auto border-r bg-white px-5 py-6 rtl:border-l rtl:border-r-0 dark:border-zinc-800 dark:bg-[#1a1a1a]">
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-x-2">
            {!data ? (
              <Skeleton className="h-7 w-7 rounded-lg" />
            ) : (
              <img
                className="h-7 w-7 rounded-md object-cover"
                src={`${!data ? "" : `/api/icon/group?groupIds=${data?.groupId}&size=420x420&format=Png&isCircular=false`}`}
                alt="avatar"
              />
            )}
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
              {!data ? "..." : data?.name}
            </span>
          </a>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVerticalIcon className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="right"
              className="mt-12 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <DropdownMenuLabel className="font-medium">
                <div className="flex items-center">
                  {!data ? (
                    <Skeleton className="h-7 w-7 rounded-lg" />
                  ) : (
                    <img
                      className="mr-2 h-6 w-6 rounded-md object-cover"
                      src={`${!data ? "" : `/api/icon/group?groupIds=${data?.groupId}&size=420x420&format=Png&isCircular=false`}`}
                      alt="avatar"
                    />
                  )}{" "}
                  {data?.name}
                  <TooltipProvider>
                    <Tooltip delayDuration={150}>
                      <TooltipTrigger asChild>
                        <CpuChipIcon className="ml-[6px] h-4 w-4 text-rose-600" />
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="ml-1 dark:bg-[#454545] dark:text-white"
                      >
                        <p className="font-mono text-xs font-normal">DEMO</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip delayDuration={150}>
                      <TooltipTrigger asChild>
                        <BeakerIcon className="ml-1 h-4 w-4 text-indigo-600" />
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="ml-1 dark:bg-[#454545] dark:text-white"
                      >
                        <p className="font-mono text-xs font-normal">BETA</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip delayDuration={150}>
                      <TooltipTrigger asChild>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="ml-1 h-4 w-4 text-blue-500"
                        >
                          <path
                            d="M9 12L11 14L15.5 9.5M17.9012 4.99851C18.1071 5.49653 18.5024 5.8924 19.0001 6.09907L20.7452 6.82198C21.2433 7.02828 21.639 7.42399 21.8453 7.92206C22.0516 8.42012 22.0516 8.97974 21.8453 9.47781L21.1229 11.2218C20.9165 11.7201 20.9162 12.2803 21.1236 12.7783L21.8447 14.5218C21.9469 14.7685 21.9996 15.0329 21.9996 15.2999C21.9997 15.567 21.9471 15.8314 21.8449 16.0781C21.7427 16.3249 21.5929 16.549 21.4041 16.7378C21.2152 16.9266 20.991 17.0764 20.7443 17.1785L19.0004 17.9009C18.5023 18.1068 18.1065 18.5021 17.8998 18.9998L17.1769 20.745C16.9706 21.2431 16.575 21.6388 16.0769 21.8451C15.5789 22.0514 15.0193 22.0514 14.5212 21.8451L12.7773 21.1227C12.2792 20.9169 11.7198 20.9173 11.2221 21.1239L9.47689 21.8458C8.97912 22.0516 8.42001 22.0514 7.92237 21.8453C7.42473 21.6391 7.02925 21.2439 6.82281 20.7464L6.09972 19.0006C5.8938 18.5026 5.49854 18.1067 5.00085 17.9L3.25566 17.1771C2.75783 16.9709 2.36226 16.5754 2.15588 16.0777C1.94951 15.5799 1.94923 15.0205 2.1551 14.5225L2.87746 12.7786C3.08325 12.2805 3.08283 11.7211 2.8763 11.2233L2.15497 9.47678C2.0527 9.2301 2.00004 8.96568 2 8.69863C1.99996 8.43159 2.05253 8.16715 2.15472 7.92043C2.25691 7.67372 2.40671 7.44955 2.59557 7.26075C2.78442 7.07195 3.00862 6.92222 3.25537 6.8201L4.9993 6.09772C5.49687 5.89197 5.89248 5.4972 6.0993 5.00006L6.82218 3.25481C7.02848 2.75674 7.42418 2.36103 7.92222 2.15473C8.42027 1.94842 8.97987 1.94842 9.47792 2.15473L11.2218 2.87712C11.7199 3.08291 12.2793 3.08249 12.7771 2.87595L14.523 2.15585C15.021 1.94966 15.5804 1.9497 16.0784 2.15597C16.5763 2.36223 16.972 2.75783 17.1783 3.25576L17.9014 5.00153L17.9012 4.99851Z"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="ml-1 dark:bg-[#454545] dark:text-white"
                      >
                        <p className="font-mono text-xs font-normal">PARTNER</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center font-medium text-zinc-700">
                <button
                  onClick={openCommand}
                  className="flex items-center font-medium text-zinc-700 dark:text-white"
                >
                  <Squares2X2Icon className="mr-1 h-4 w-4" /> Switch Colonies
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  className="flex items-center font-medium text-zinc-700  dark:text-white"
                  href={`/${data?.id}/settings`}
                >
                  <Cog6ToothIcon className="mr-1 h-4 w-4" /> Configuration
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-4 flex flex-1 flex-col justify-between">
          <nav className="-mx-3 flex-1 space-y-2 ">
            <Link
              className={`flex transform items-center rounded-lg px-3 py-2 transition-colors duration-300 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 ${!pathname.split("/")[2] ? `text-[${data?.customisation}]` : "text-zinc-600 dark:text-zinc-300"}`}
              href={`/${data?.id}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M5.566 4.657A4.505 4.505 0 0 1 6.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0 0 15.75 3h-7.5a3 3 0 0 0-2.684 1.657ZM2.25 12a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3v-6ZM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 0 1 6.75 6h10.5a3 3 0 0 1 2.683 1.657A4.505 4.505 0 0 0 18.75 7.5H5.25Z" />
              </svg>

              <span className="mx-2 text-sm font-medium">Overview</span>
            </Link>

            <Link
              className={`flex transform items-center rounded-lg px-3 py-2 transition-colors duration-300 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 ${pathname.split("/")[2] == "activity" ? `text-[${data?.customisation}]` : "text-zinc-600 dark:text-zinc-300"}`}
              href={`/${data?.id}/activity`}
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 12H18L15 21L9 3L6 12H2"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <span className="mx-2 text-sm font-medium">
                Activity Tracking
              </span>
            </Link>

            <Link
              className={`flex transform items-center rounded-lg px-3 py-2 transition-colors duration-300 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 ${pathname.split("/")[2] == "staff" ? `text-[${data?.customisation}]` : "text-zinc-600 dark:text-zinc-300"}`}
              href={`/${data?.id}/staff`}
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 15.8369C19.4559 16.5683 20.7041 17.742 21.6152 19.2096C21.7956 19.5003 21.8858 19.6456 21.917 19.8468C21.9804 20.2558 21.7008 20.7585 21.3199 20.9204C21.1325 21 20.9216 21 20.5 21M16 11.5322C17.4817 10.7959 18.5 9.26686 18.5 7.5C18.5 5.73314 17.4817 4.20411 16 3.46776M14 7.5C14 9.98528 11.9852 12 9.49996 12C7.01468 12 4.99996 9.98528 4.99996 7.5C4.99996 5.01472 7.01468 3 9.49996 3C11.9852 3 14 5.01472 14 7.5ZM2.55919 18.9383C4.1535 16.5446 6.66933 15 9.49996 15C12.3306 15 14.8464 16.5446 16.4407 18.9383C16.79 19.4628 16.9646 19.725 16.9445 20.0599C16.9289 20.3207 16.7579 20.64 16.5495 20.7976C16.2819 21 15.9138 21 15.1776 21H3.82232C3.08613 21 2.71804 21 2.4504 20.7976C2.24201 20.64 2.07105 20.3207 2.05539 20.0599C2.03529 19.725 2.20992 19.4628 2.55919 18.9383Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <span className="mx-2 text-sm font-medium">Team Management</span>
            </Link>

            <Link
              className={`flex transform items-center rounded-lg px-3 py-2 transition-colors duration-300 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 ${pathname.split("/")[2] == "tasks" ? `text-[${data?.customisation}]` : "text-zinc-600 dark:text-zinc-300"}`}
              href={`/${data?.id}/tasks`}
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 13V17.8C20 18.9201 20 19.4802 19.782 19.908C19.5903 20.2843 19.2843 20.5903 18.908 20.782C18.4802 21 17.9201 21 16.8 21H7.2C6.0799 21 5.51984 21 5.09202 20.782C4.71569 20.5903 4.40973 20.2843 4.21799 19.908C4 19.4802 4 18.9201 4 17.8V13M9 10H15M9.28571 14H14.7143C16.8467 14 17.913 14 18.7355 13.6039C19.552 13.2107 20.2107 12.552 20.6039 11.7355C21 10.913 21 9.84674 21 7.71429C21 6.11494 21 5.31527 20.7029 4.69835C20.408 4.08603 19.914 3.59197 19.3017 3.29709C18.6847 3 17.8851 3 16.2857 3H7.71429C6.11494 3 5.31527 3 4.69835 3.29709C4.08603 3.59197 3.59197 4.08603 3.29709 4.69835C3 5.31527 3 6.11494 3 7.71429C3 9.84674 3 10.913 3.39612 11.7355C3.7893 12.552 4.44803 13.2107 5.26447 13.6039C6.08703 14 7.15326 14 9.28571 14Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <span className="mx-2 text-sm font-medium">Assignments</span>
            </Link>
          </nav>
        </div>
      </aside>
    </>
  );
}
