"use client";

import { usePathname } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/app/_components/ui/accordion";
import { TeamViewer } from "~/app/components/(colonies)/TeamViewer/member.template";

import { api } from "~/trpc/react";

export default function Dashboard() {
  const pathname = usePathname();

  return (
    <div className="ml-6 mr-6 mt-4">
      <div className="mt-5 grid gap-4 md:grid-cols-3 lg:grid-cols-3">
        <TeamViewer id={`${pathname.split("/")[1]}`} />
      </div>
    </div>
  );
}
