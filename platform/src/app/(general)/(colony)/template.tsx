"use client";
import React, { createContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../auth";

import { api } from "~/trpc/react";
import { LayoutContext } from "../../(root)/props/UserContext";
import { GroupContext } from "../../(root)/props/GroupContext";

export default function ClientLayout({ children }: any) {
  const auth = useAuth();
  const ruoter = useRouter();
  const path = usePathname();
  const { data, isLoading, error } = api.spaces.fetch.useQuery({
    id: `${path.split("/")[1]}`,
  });

  return (
    <GroupContext.Provider value={data as any}>
      <LayoutContext.Provider value={auth.user}>
        <div>{children}</div>
      </LayoutContext.Provider>
    </GroupContext.Provider>
  );
}
