"use client";
import React, { createContext, useEffect, useState } from "react";
import { useAuth } from "../auth";
import { api } from "~/trpc/react";
import { LayoutContext } from "../(root)/props/UserContext";
import { redirect } from "next/navigation";

const Layout: React.FC = ({ children }: any) => {
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
};

export default Layout;
