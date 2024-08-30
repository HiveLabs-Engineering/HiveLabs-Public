"use client";
import Head from "next/head";
import React, { useState, ChangeEvent, useEffect } from "react";

import { AnimatePresence, motion } from "framer-motion";
const EmailValidator = require("email-validator");
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../../../_components/ui/input-otp";

import { useAuth } from "../../../auth";
import { Button } from "~/app/_components/ui/button";
import { api } from "~/trpc/react";
import { Input } from "~/app/components/ui/input";

import { Toaster, toast } from "sonner";
import { EarthLockIcon, LockKeyholeIcon } from "lucide-react";
import Intercom from "@intercom/messenger-js-sdk";

import * as Castle from "@castleio/castle-js";

export default function ClientPage() {
  const auth = useAuth();
  const router = useRouter();
  const [acitvePage, setActivePage] = useState("1");
  const [pendingPae, setPendingPage] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [castletoken, setCastleToken] = useState("");

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    if (auth.user) {
      if (auth.user.email) {
        router.replace("/waitlist");
      }
    }
  }, [auth.user]);

  useEffect(() => {
    const castle = Castle.configure({
      pk: "",
    });

    castle.createRequestToken().then((requestToken) => {
      setCastleToken(requestToken);
    });
  }, []);

  Intercom({
    app_id: "na5gvzp0",
    email: `${email}`,
    name: auth.user?.username,
    user_id: auth.user?.userId,
    avatar: {
      type: "avatar",
      image_url: `https://platform.hivelabs.app/api/avatar?userIds=${auth.user?.userId}&size=180x180&format=png`,
    },
  });

  const response = api.auth.verify.useMutation();
  const validation = api.auth.validate.useMutation();

  async function ValidateChanges(type: string, e: any) {
    if (type === "EmailAddress") {
      const valid = EmailValidator.validate(e.target.value);
      if (valid) {
        setDisabled(false);
        setEmail(e.target.value);
      } else {
        setDisabled(true);
      }
    }
    if (type === "VerificationCode") {
      setCode(e);
    }
  }

  async function Submit(type: string) {
    if (type === "ApproveDPA") {
      setActivePage("2");
    }
    if (type === "EmailAddress") {
      console.log(auth.user);
      response.mutate({
        email: `${email}`,
        username: `${auth.user?.username}`,
        userId: `${auth.user?.userId}`,
      });
      setActivePage("3");
    }
    if (type === "VerificationCode") {
      await validation.mutate(
        {
          code: `${code}`,
        },
        {
          onSuccess: (data) => {
            if (data.success) {
              setActivePage("final");
              api.security.risk.useQuery({ token: `${castletoken}` });
              return router.replace("/waitlist");
            } else {
              if (data.message === "Internal Server Error") {
                toast("We encountered an error", {
                  description:
                    "Our servers replied with an 'Internal Server Error', please try again or contact support.",
                });
              } else {
                toast("Verification Incomplete", {
                  description:
                    "You provided an invalid verification code, please try again with the correct code.",
                });
              }
            }
          },
        },
      );
    }
  }

  return (
    <div
      className={`relative flex min-h-screen flex-col justify-center overflow-hidden bg-zinc-50 py-6 sm:py-12`}
    >
      <Toaster />
      <div className="relative flex flex-grow flex-col items-center justify-center rounded-md antialiased">
        <AnimatePresence mode="wait">
          {acitvePage == "1" && (
            <motion.div
              key="firstDiv"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.21 }}
            >
              <div
                className={`mx-auto flex w-full max-w-[90%] overflow-hidden rounded-lg border border-zinc-200 bg-white md:w-[37rem]`}
              >
                <div className="overflow-hidden">
                  <div
                    className={`flex flex-col justify-center transition duration-700`}
                  >
                    <div className="space-y-2 px-2 py-5">
                      <div className="ml-4 mr-4">
                        <h1 className="mt-2 text-center text-lg font-bold text-zinc-800">
                          Data and Privacy Agreement
                        </h1>

                        <p className="mt-2 text-sm font-normal text-zinc-500">
                          HiveLabs allows registered users to access and manage
                          their data collected by us, and third-party services
                          for ultimate transparency.
                        </p>

                        <p className="mt-2 text-sm font-normal text-zinc-500">
                          Before you register your account with HiveLabs, we
                          require you to agree to our{" "}
                          <a className="text-zinc-900 underline">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a className="text-zinc-900 underline">
                            Privacy Policy
                          </a>
                        </p>

                        <p className="mt-2 text-sm font-normal text-zinc-500">
                          Any questions regarding your data & privacy you should
                          contact our dedicated team at{" "}
                          <b className="text-zinc-900">data@hivelabs.app</b>
                        </p>

                        <Button
                          type="button"
                          onClick={() => Submit("ApproveDPA")}
                          className={`mt-4 w-full rounded-md bg-zinc-800 font-semibold text-white transition hover:bg-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-900`}
                        >
                          Accept Agreement
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {acitvePage == "2" && (
            <motion.div
              key="secondDiv"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mx-auto flex w-full max-w-[90%] overflow-hidden rounded-lg border border-zinc-200 bg-white md:w-[37rem]">
                <div
                  className={`flex flex-col justify-center transition duration-700 `}
                >
                  <div className="space-y-2 px-2 py-5">
                    <div className="ml-4 mr-4">
                      <h1 className="mt-2 text-center text-lg font-bold text-zinc-800">
                        We need to verify your account to continue
                      </h1>

                      <p className="mt-2 text-center text-sm font-normal text-zinc-500">
                        For security, HiveLabs requires you to link your email
                        to your account. You&apos;ll receive a one-time
                        verification code to continue with account creation.
                      </p>

                      <Input
                        onChange={(e) => ValidateChanges("EmailAddress", e)}
                        id="email"
                        placeholder="What is your email address?"
                        className="focus:outline-pink mt-4 w-full rounded-md border-zinc-200 text-sm font-medium text-zinc-800 focus:border-zinc-800"
                      />

                      <Button
                        type="button"
                        onClick={() => Submit("EmailAddress")}
                        className={`mt-4 w-full rounded-md bg-zinc-800 font-semibold text-white transition hover:bg-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-900 ${!disabled ? "" : "cursor-not-allowed opacity-50"}`}
                      >
                        Verify my email address
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {acitvePage == "3" && (
            <motion.div
              key="thirdDiv"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mx-auto flex w-full max-w-[90%] overflow-hidden rounded-lg border border-zinc-200 bg-white md:w-[37rem]">
                <div
                  className={`flex flex-col justify-center transition duration-700 `}
                >
                  <div className="space-y-2 px-2 py-5">
                    <div className="ml-4 mr-4">
                      <h1 className="mt-2 text-center text-xl font-bold text-zinc-800">
                        We have sent you a verification code
                      </h1>

                      <p className="mt-3 text-center text-sm text-gray-500">
                        Didn&apos;t receive the code? Please check your spam
                        folder or ensure your email address is correct. You can{" "}
                        <a href="#" className="text-indigo-800 underline">
                          contact support
                        </a>{" "}
                        if necessary.
                      </p>

                      <div className="mb-2 mt-5 flex justify-center ">
                        <InputOTP
                          className="h-4 w-4 border-zinc-900 focus-visible:ring-0"
                          maxLength={6}
                          onChange={(e) =>
                            ValidateChanges("VerificationCode", e)
                          }
                          onComplete={() => Submit("VerificationCode")}
                          autoFocus={true}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot
                              aria-autocomplete="none"
                              className={
                                " aspect-square h-12 w-12 bg-white text-lg font-medium text-zinc-900 dark:border-zinc-300"
                              }
                              index={0}
                            />
                            <InputOTPSlot
                              aria-autocomplete="none"
                              className={
                                "aspect-square h-12 w-12 bg-white  text-lg font-medium text-zinc-900 dark:border-zinc-300 "
                              }
                              index={1}
                            />
                            <InputOTPSlot
                              aria-autocomplete="none"
                              className={
                                "aspect-square h-12 w-12 bg-white text-lg font-medium text-zinc-900 dark:border-zinc-300"
                              }
                              index={2}
                            />
                          </InputOTPGroup>
                          <InputOTPSeparator className="text-zinc-300" />
                          <InputOTPGroup>
                            <InputOTPSlot
                              aria-autocomplete="none"
                              className={
                                "aspect-square h-12 w-12 bg-white text-lg font-medium text-zinc-900 dark:border-zinc-300"
                              }
                              index={3}
                            />
                            <InputOTPSlot
                              aria-autocomplete="none"
                              className={
                                "aspect-square h-12 w-12 bg-white text-lg font-medium text-zinc-900 dark:border-zinc-300"
                              }
                              index={4}
                            />
                            <InputOTPSlot
                              aria-autocomplete="none"
                              className={
                                "aspect-square h-12 w-12 bg-white text-lg font-medium text-zinc-900 dark:border-zinc-300 "
                              }
                              index={5}
                            />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
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
