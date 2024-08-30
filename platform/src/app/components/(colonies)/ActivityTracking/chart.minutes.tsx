import React from "react";
import { AreaChart } from "@tremor/react";
import { usePathname } from "next/navigation";
import { api } from "~/trpc/react";
import { useAuth } from "~/app/auth";

export function ActivityPulse({ user }: { user: any }): JSX.Element {
  const path = usePathname();
  const { data } = api.activity.fetchMessages.useQuery({
    id: `${path.split("/")[1]}`,
    user_id: user?.userId,
  });

  const chartData = [] as any;
  const minutesbyHour: { [key: string]: number } = {};

  if (data) {
    data.forEach((doc) => {
      const TimeEndDate = new Date(doc.start as any);
      const options: Intl.DateTimeFormatOptions = {
        month: "2-digit",
        day: "2-digit",
        hour12: true,
      };
      const time = TimeEndDate.toLocaleString("en-US", options);

      const startDate2 = new Date(doc.start as any) as any;
      const endDate = new Date(doc.end as any) as any;

      const differenceInMs = endDate - startDate2;

      const minutes = Math.floor(differenceInMs / (1000 * 60));

      if (minutesbyHour[time]) {
        minutesbyHour[time] += minutes;
      } else {
        minutesbyHour[time] = minutes;
      }
    });

    for (const time in minutesbyHour) {
      chartData.push({ date: time, minutes: minutesbyHour[time] });
    }
  }

  const customTooltip = (props: { payload: any; active: any }) => {
    const { payload, active } = props;
    if (!active || !payload) return null;
    return (
      <div className="w-56 rounded-md border border-zinc-200 bg-tremor-background bg-white p-2 dark:border-zinc-800 dark:bg-[#1a1a1a] ">
        {payload.map(
          (
            category: {
              color: any;
              dataKey:
                | string
                | number
                | bigint
                | boolean
                | React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >
                | Iterable<React.ReactNode>
                | React.ReactPortal
                | Promise<React.AwaitedReactNode>
                | null
                | undefined;
              value:
                | string
                | number
                | bigint
                | boolean
                | React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >
                | Iterable<React.ReactNode>
                | React.ReactPortal
                | Promise<React.AwaitedReactNode>
                | null
                | undefined;
            },
            idx: React.Key | null | undefined,
          ) => (
            <div key={idx} className="flex flex-1 space-x-2.5">
              <div
                className={`flex w-1 flex-col bg-${category.color}-500 rounded`}
              />
              <div className="space-y-1">
                <p className="text-inter text-sm font-medium text-white">
                  {category.value} minutes
                </p>
              </div>
            </div>
          ),
        )}
      </div>
    );
  };

  return (
    <AreaChart
      data={chartData}
      index="date"
      categories={["minutes"]}
      colors={["rose"]}
      curveType="monotone"
      showAnimation={true}
      animationDuration={1500}
      yAxisWidth={40}
      showLegend={false}
      noDataText=""
      customTooltip={customTooltip}
    />
  );
}
