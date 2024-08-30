"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../auth";
import Intercom from "@intercom/messenger-js-sdk";
import SkeletonWrapper from "~/app/components/SkeletonWrapper";

import SecurityComponent from "~/app/components/(general)/SecurityGuards/security.wrapper";

const Page: React.FC = () => {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.user) {
      if (!auth.user.email) {
        router.replace("/get-started");
      } else {
        Intercom({
          app_id: "na5gvzp0",
          email: auth.user.email,
          name: auth.user.username,
          user_id: auth.user.userId,
          avatar: {
            type: "avatar",
            image_url: `https://platform.hivelabs.app/api/avatar?userIds=${auth.user.userId}&size=180x180&format=png`,
          },
        });
      }
    }
  }, [auth.user]);

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-zinc-50 py-6 sm:py-12">
      <SecurityComponent />
      <div className="relative flex flex-grow flex-col items-center justify-center antialiased">
        <div className="mx-auto w-full max-w-[90%] rounded-lg border border-zinc-200 bg-white md:w-[37rem]">
          <div className="space-y-3 px-3 py-8 text-center">
            <SkeletonWrapper isLoading={!auth.user}>
              <div className="flex items-center justify-center">
                <img
                  src="https://ucarecdn.com/0367e166-0623-4abc-bbb2-dbfca70dbb3f/-/preview/100x89/"
                  className="h-11"
                  alt="Centered Image"
                />
              </div>
              <div className="ml-4 mr-4">
                <h1 className="mt-5 text-lg font-bold text-zinc-900">
                  Thanks for joining our waitlist, {auth.user?.username}
                </h1>
                <p className="mt-3 text-sm font-medium text-zinc-500">
                  Thanks for joining the HiveLabs waitlist, you will be one of
                  the first to know about us when we launch publically. We are
                  on a mission to make group management more easier for you as a
                  manager, HiveLabs allows you to easily monitor and manage your
                  staff activity. Join us{" "}
                  <a
                    href="https://discord.gg/Hn6a2ZCbrH"
                    className="font-semibold text-[#393cd0] underline"
                  >
                    via this link
                  </a>
                  .
                </p>
                <p className="mt-5 text-sm font-medium text-zinc-500">
                  If you have any questions about the upcoming platform or the
                  development process, don&apos;t hesitate to reach out to the
                  team via our messenger.
                </p>
              </div>
            </SkeletonWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
