"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../auth";
import Intercom from "@intercom/messenger-js-sdk";
import SkeletonWrapper from "~/app/components/SkeletonWrapper";

import { AccountDisabled } from "~/app/components/(general)/SecurityGuards/security.limitation";

export default function ClientPagex() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.user) {
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
  }, [auth.user]);

  return <AccountDisabled />;
}
