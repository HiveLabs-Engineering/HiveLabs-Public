import { AreaChart } from "@tremor/react";

const chartdata = [
  {
    date: "Jan 22",
    Minutes: 2890,
    Messages: 2338,
  },
  {
    date: "Feb 22",
    Minutes: 2756,
    Messages: 2103,
  },
  {
    date: "Mar 22",
    Minutes: 3322,
    Messages: 2194,
  },
  {
    date: "Apr 22",
    Minutes: 3470,
    Messages: 2108,
  },
  {
    date: "May 22",
    Minutes: 3475,
    Messages: 1812,
  },
  {
    date: "Jun 22",
    Minutes: 3129,
    Messages: 1726,
  },
  {
    date: "Jul 22",
    Minutes: 3490,
    Messages: 1982,
  },
  {
    date: "Aug 22",
    Minutes: 2903,
    Messages: 2012,
  },
  {
    date: "Sep 22",
    Minutes: 2643,
    Messages: 2342,
  },
  {
    date: "Oct 22",
    Minutes: 2837,
    Messages: 2473,
  },
  {
    date: "Nov 22",
    Minutes: 2954,
    Messages: 3848,
  },
  {
    date: "Dec 22",
    Minutes: 3239,
    Messages: 3736,
  },
];

export function ActivityMessages() {
  return (
    <AreaChart
      className="h-80"
      data={chartdata}
      index="date"
      categories={["Messages"]}
      colors={["blue"]}
      showAnimation={true}
      animationDuration={1500}
      yAxisWidth={40}
      onValueChange={(v) => console.log(v)}
    />
  );
}
