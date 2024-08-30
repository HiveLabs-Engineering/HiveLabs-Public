import { usePathname } from "next/navigation";
import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/app/components/ui/tooltip";
import { api } from "~/trpc/react";
import { SignalIcon, SignalSlashIcon } from "@heroicons/react/20/solid";
import { useEffect, useState, useMemo, useContext } from "react";
import { GiftIcon, TrophyIcon } from "lucide-react";
import { useAuth } from "~/app/auth";

const LoadingSpinner = () => (
  <div className="center flex items-center justify-center">
    <div role="status" aria-label="loading">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 2400 2400"
        width="20"
        height="20"
      >
        <g
          stroke-width="200"
          stroke-linecap="round"
          stroke="#b1b1b1"
          fill="none"
        >
          <path d="M1200 600V100" />
          <path opacity=".5" d="M1200 2300v-500" />
          <path opacity=".917" d="M900 680.4l-250-433" />
          <path opacity=".417" d="M1750 2152.6l-250-433" />
          <path opacity=".833" d="M680.4 900l-433-250" />
          <path opacity=".333" d="M2152.6 1750l-433-250" />
          <path opacity=".75" d="M600 1200H100" />
          <path opacity=".25" d="M2300 1200h-500" />
          <path opacity=".667" d="M680.4 1500l-433 250" />
          <path opacity=".167" d="M2152.6 650l-433 250" />
          <path opacity=".583" d="M900 1719.6l-250 433" />
          <path opacity=".083" d="M1750 247.4l-250 433" />
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            keyTimes="0;0.08333;0.16667;0.25;0.33333;0.41667;0.5;0.58333;0.66667;0.75;0.83333;0.91667"
            values="0 1199 1199;30 1199 1199;60 1199 1199;90 1199 1199;120 1199 1199;150 1199 1199;180 1199 1199;210 1199 1199;240 1199 1199;270 1199 1199;300 1199 1199;330 1199 1199"
            dur="0.83333s"
            begin="0s"
            repeatCount="indefinite"
            calcMode="discrete"
          />
        </g>
      </svg>
    </div>
  </div>
);

const NoActivityMessage = ({ data }: { data: any }) => (
  <div className="mt-7 flex flex-grow flex-col items-center justify-center rounded-md">
    <div className="space-y-3 px-3 py-7 text-center">
      <div className="flex items-center justify-center">
        <SignalSlashIcon className="h-16 w-16 text-zinc-600 dark:text-white" />
      </div>
      <div className="mx-4">
        <p className="text-lg font-semibold text-zinc-700 dark:text-white">
          We have not received any activity data yet
        </p>
        <p className="mt-2 max-w-xl text-sm text-zinc-500 dark:text-zinc-400">
          You do not have anything logged for activity in{" "}
          <strong>{data.name}</strong>. If you think this is a mistake, feel
          free to contact our support team via our Intercom messenger.
        </p>
      </div>
    </div>
  </div>
);

const formatDuration = (
  startTime: string | Date,
  endTime: string | Date,
): string => {
  const start = typeof startTime === "string" ? new Date(startTime) : startTime;
  const end = typeof endTime === "string" ? new Date(endTime) : endTime;
  const durationInSeconds = Math.abs(end.getTime() - start.getTime()) / 1000;

  if (durationInSeconds === 0) {
    return "0 seconds";
  }

  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = Math.floor(durationInSeconds % 60);

  const formattedDuration: string[] = [];
  if (hours > 0) {
    formattedDuration.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  }
  if (minutes > 0) {
    formattedDuration.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
  }
  if (seconds > 0) {
    formattedDuration.push(`${seconds} second${seconds > 1 ? "s" : ""}`);
  }

  return formattedDuration.join(" and ");
};

const formatDate = (date: Date): string => {
  const d = new Date(date);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[d.getMonth()];
  const day = d.getDate();
  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
          ? "rd"
          : "th";
  return `${month} ${day}${suffix} ${d.getFullYear()}, ${d.toLocaleTimeString()}`;
};

const getTimeOfDay = (date: Date): string => {
  const hours = date.getHours();
  if (hours >= 5 && hours < 12) {
    return "Morning";
  } else if (hours >= 12 && hours < 17) {
    return "Afternoon";
  } else if (hours >= 17 && hours < 21) {
    return "Evening";
  } else {
    return "Midnight";
  }
};

const ActivityItem = ({
  activity,
  currentTime,
}: {
  activity: any;
  currentTime: Date;
}) => {
  const timeOfDay = !activity.end
    ? getTimeOfDay(new Date(activity.start))
    : getTimeOfDay(new Date(activity.end));
  return (
    <div className="mt-2 mt-3 w-full rounded-md border border-zinc-200 bg-white px-4 py-4 outline-0 ring-0 dark:border-zinc-800 dark:bg-[#1a1a1a]">
      <div className="flex items-center">
        <img
          className="h-16 overflow-hidden rounded-lg"
          src={
            activity.game_details.thumbnail
              ? `${activity.game_details.thumbnail}`
              : "https://t7.rbxcdn.com/950a81432c46318c84335384a6e4d77e"
          }
          alt="Activity"
        />
        <div className="ml-3">
          <p className="text-md flex items-center font-semibold text-black dark:text-white">
            {timeOfDay} in {activity.game_details.name}
            {!activity.ended && (
              <div className="ml-2 mr-1 flex items-center rounded-md border border-rose-200 bg-rose-100 p-0.5 text-xs text-rose-500 dark:border-rose-300 dark:bg-rose-200 dark:text-rose-600">
                <SignalIcon className="ml-1 mr-1 h-4 w-4" />
                <span className="mr-1">LIVE</span>
              </div>
            )}
          </p>
          <TooltipProvider>
            <Tooltip delayDuration={150}>
              <TooltipTrigger asChild>
                <p className="font-mono text-xs font-normal text-zinc-500 dark:text-neutral-300">
                  {activity.ended
                    ? formatDuration(activity.start, activity.end)
                    : formatDuration(activity.start, currentTime)}
                </p>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="ml-1 dark:bg-[#454545] dark:text-white"
              >
                <p>
                  {activity.ended
                    ? `${formatDate(activity.start)} - ${formatDate(activity.end)}`
                    : `${formatDate(activity.start)} - ${formatDate(currentTime)}`}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export function GameActivities({ user }: { user: any }): JSX.Element {
  const path = usePathname();
  const gameId = useMemo(() => path.split("/")[1], [path]);
  const { data: workspace } = api.spaces.fetch.useQuery({ id: `${gameId}` });
  const { data, isLoading, error } = api.activity.fetch.useQuery({
    id: `${gameId}`,
    user_id: `${user?.userId}`,
  });
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="mt-7 flex-grow overflow-y-auto p-3">
        <LoadingSpinner />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <>
        <NoActivityMessage data={workspace} />
      </>
    );
  }

  return (
    <>
      {data.map((activity: any) => (
        <ActivityItem
          key={activity.id}
          activity={activity}
          currentTime={currentTime}
        />
      ))}
    </>
  );
}
