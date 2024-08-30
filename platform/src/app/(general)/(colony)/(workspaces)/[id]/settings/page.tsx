"use client";
import { AuthProvider } from "../../../../../auth";
import { usePathname, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import ColorPicker from "~/app/components/customisation/colorPicker";
import { Input } from "~/app/components/ui/input";

import "@uploadcare/react-uploader/core.css";
import {
  FileUploaderRegular,
  type UploadCtxProvider,
} from "@uploadcare/react-uploader";

import { Tab, TabGroup, TabList, TabPanels, TabPanel } from "@tremor/react";
import { Button } from "~/app/_components/ui/button";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/app/_components/ui/accordion";
import { Badge } from "~/app/_components/ui/badge";
import { Switch } from "~/app/_components/ui/switch";
import { useState } from "react";
import { Permissions } from "~/app/components/(colonies)/SettingConfig/permissions.component";

export default function Dashboard() {
  const pathname = usePathname();
  const router = useRouter();
  const { data, error } = api.spaces.fetch.useQuery({
    id: `${pathname.split("/")[1]}`,
  });

  const response = api.colony.edit.useMutation();

  const [files, setFiles] = useState([]);
  const handleChangeEvent = (items: { allEntries: any[] }) => {
    response.mutate(
      {
        id: `${data?.id}`,
        color: `#6466e9`,
        wallpaper: `${items.allEntries[0].cdnUrl}`,
      },
      {
        onSuccess: (bi) => {
          router.refresh();
        },
      },
    );
  };

  return (
    <AuthProvider>
      <div className="ml-5 mr-5">
        <TabGroup className="mt-5">
          <TabList>
            <Tab className="font-light">General Settings</Tab>
            <Tab className="font-light">Role Permssions</Tab>
            <Tab className="font-light">Activity Tracking</Tab>
          </TabList>
          <TabPanels>
            <TabPanel key="general">
              <main className="ml-2 mr-5 mt-4 flex-1">
                <div className="w-full rounded-md border border-zinc-200 bg-white px-4 py-4 outline-0 ring-0 xl:py-5 dark:border-zinc-800 dark:bg-[#1a1a1a]">
                  <h3 className="font-display text-xl font-semibold">
                    Customize your workspace
                  </h3>
                  <div className="mb-2 ml-2 mt-3">
                    <div>
                      <p className="text-sm font-medium text-black dark:text-white">
                        Action color
                      </p>
                      <p className="text-xs font-normal text-black dark:text-zinc-300">
                        Used in buttons, links and more across the space.
                      </p>
                      <div className="mt-2">
                        <ColorPicker />
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium text-black dark:text-white">
                        Background wallpaper
                      </p>
                      <p className="text-xs font-normal text-black dark:text-zinc-300">
                        Shown as the background wallpaper across your workspace.
                      </p>
                      <div className="mt-2">
                        <FileUploaderRegular
                          onChange={handleChangeEvent}
                          pubkey="ee51cd25d23ef2f8aa4d"
                          maxLocalFileSizeBytes={10000000}
                          imgOnly={true}
                          multiple={false}
                          sourceList="local"
                          useCloudImageEditor={false}
                          classNameUploader="my-config"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-2 w-full overflow-hidden rounded-md border border-zinc-200 bg-white outline-0 ring-0 dark:border-zinc-800 dark:bg-[#1a1a1a]">
                  <div className="mb-5 mt-5 px-4">
                    <h3 className="font-display text-xl font-semibold">
                      Danger Zone
                    </h3>
                    <p className="mb-3 mt-1 text-sm text-neutral-800 dark:text-neutral-400">
                      This action will permanently remove all data associated
                      with <strong>{data?.name}</strong> from HiveLabs. This
                      cannot be undone.
                    </p>
                  </div>

                  <div className="left-0 right-0 flex w-full items-center border-t bg-zinc-50 px-4 py-3  dark:border-zinc-800 dark:bg-[#1a1a1a]">
                    <div className="ml-auto">
                      <button
                        className="group inline-flex shrink-0 items-center justify-center rounded-sm border border-red-500 bg-red-500 px-4 py-2 text-sm font-medium text-white outline-none hover:border-red-700 hover:bg-red-600 dark:border-red-500 dark:bg-red-500 dark:text-white dark:hover:border-red-700 dark:hover:bg-red-600"
                        type="button"
                        aria-haspopup="dialog"
                        aria-expanded="false"
                        aria-controls="confirmation-dialog"
                        data-state="closed"
                      >
                        <span className="whitespace-nowrap">
                          Delete {data?.name}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </main>
            </TabPanel>
            <TabPanel key="permissions">
              <main className="mb-5 ml-2 mr-5 mt-4 flex-1">
                <div className="w-full rounded-md border border-zinc-200 bg-white px-4 py-4 outline-0 ring-0 xl:py-5 dark:border-zinc-800 dark:bg-[#1a1a1a]">
                  <h3 className="font-display text-xl font-semibold">
                    Configure your permissions
                  </h3>
                  <p className="mt-1 text-xs font-normal text-black dark:text-zinc-300">
                    Configure who can access certain permissions within your
                    workspace.
                  </p>
                  <div className="mb-2 ml-2 mr-2 mt-2">
                    <Accordion type="single" collapsible>
                      <Permissions id={`${pathname.split("/")[1]}`} />
                    </Accordion>
                  </div>
                </div>
              </main>
            </TabPanel>
            <TabPanel key="activity">
              <main className="ml-2 mr-5 mt-4 flex-1">
                <div className="w-full rounded-md border border-zinc-200 bg-white px-4 py-4 outline-0 ring-0 xl:py-5 dark:border-zinc-800 dark:bg-[#1a1a1a]"></div>
              </main>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </AuthProvider>
  );
}
