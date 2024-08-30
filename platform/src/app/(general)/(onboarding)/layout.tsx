"use client";
import React, { useEffect } from "react";
import { useAuth } from "../../auth";
import { api } from "~/trpc/react";
import { LayoutContext } from "../../(root)/props/UserContext";

export default function ClientLayout({ children }: any) {
  const auth = useAuth();
  const { data, error, isLoading } = api.user.whois.useQuery();
  useEffect(() => {
    if (data) {
      auth.setUser!(data as any);
    }
  }, [data, auth]);

  return (
    <LayoutContext.Provider value={auth.user}>
      <div>{children}</div>
    </LayoutContext.Provider>
  );
}
