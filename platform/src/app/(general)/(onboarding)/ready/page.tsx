"use client";
import React, { useState, useCallback, Fragment } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { useAuth } from "../../../auth";
import { Button } from "~/app/_components/ui/button";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { toast, Toaster } from "sonner";
import { Input } from "~/app/components/ui/input";

import posthog from "posthog-js";

export default function ClientPage() {
  const router = useRouter();
  const [state, setState] = useState({
    page: 1,
    id: "",
  });

  const response = api.colony.create.useMutation();

  const changeGroupId = useCallback((e: { target: { value: any } }) => {
    setState((prevState) => ({ ...prevState, id: e.target.value }));
  }, []);

  let [isShowing, setIsShowing] = useState(false);

  const handleContinue = useCallback(async () => {
    const { page, id } = state;
    if (page === 2) {
      if (!id) {
        return toast("Error creating colony", {
          description: "Please enter a valid Group ID and try again.",
        });
      }

      response.mutate(
        { id },
        {
          onSuccess: (data) => {
            posthog.capture("Colony Creation", { "Group ID": `${id}` });
            router.replace(`${data.url}`);
          },
        },
      );
    } else {
      setIsShowing(true);
      setState((prevState) => ({ ...prevState, page: prevState.page + 1 }));
    }
  }, [state, response.mutate, router]);

  const isPageOne = state.page === 1;

  return (
    <div
      className={`relative flex min-h-screen flex-col justify-center overflow-hidden bg-zinc-50 py-6 sm:py-12`}
    >
      <Toaster />
      <div className="relative flex flex-grow flex-col items-center justify-center rounded-md antialiased">
        <AnimatePresence mode="wait">
          {!isShowing && (
            <motion.div
              key="firstDiv"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.21 }}
            >
              <div
                className={`mx-auto flex w-full max-w-[90%] overflow-hidden rounded-xl border border-zinc-200 bg-white md:w-[37rem] ${isShowing ? "hidden" : ""}`}
              >
                <div className="overflow-hidden">
                  <div
                    className={`flex flex-col justify-center transition duration-700`}
                  >
                    <div className="space-y-2 px-2 py-5">
                      <div className="ml-4 mr-4">
                        <h1 className="mt-3 text-center text-lg font-semibold text-zinc-900">
                          Revolutionize your staff management today
                        </h1>

                        <p className="mt-2 flex justify-center text-center text-sm font-normal text-zinc-500">
                          HiveLabs allows you to easily and efficientally manage
                          your team from a single dashboard, you can easily
                          manage time-off requests, staff activity, and much
                          more.
                        </p>

                        <Button
                          type="button"
                          onClick={handleContinue}
                          className={`mt-4 w-full rounded-md  bg-zinc-800 font-semibold text-white transition hover:bg-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-900`}
                          style={{ color: "#FFFFFF" }}
                        >
                          Let&apos;s create this colony.
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {isShowing && (
            <motion.div
              key="secondDiv"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mx-auto flex w-full max-w-[90%] overflow-hidden rounded-xl border border-zinc-200 bg-white md:w-[37rem]">
                <div
                  className={`flex flex-col justify-center transition duration-700 `}
                >
                  <div className="space-y-2 px-2 py-5">
                    <div className="ml-4 mr-4">
                      <h1 className="mt-3 text-center text-lg font-semibold text-zinc-900">
                        Let&apos;s sync your colony to your Roblox group
                      </h1>

                      <p className="mt-2 flex justify-center text-center text-sm font-normal text-zinc-500">
                        HiveLabs allows communities like yours to customise
                        their branding to fit their aesthetic and fit their
                        teams preferences.
                      </p>

                      <Input
                        onChange={changeGroupId}
                        placeholder="Roblox Group ID"
                        className="mt-4 w-full rounded-md border-zinc-200 text-sm font-medium text-zinc-800 focus:border-zinc-800"
                      />

                      <Button
                        type="button"
                        onClick={handleContinue}
                        className={`mt-2 w-full rounded-md bg-zinc-800 font-semibold text-white transition hover:bg-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-900`}
                        style={{ color: "#FFFFFF" }}
                      >
                        Create my brand new colony
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
