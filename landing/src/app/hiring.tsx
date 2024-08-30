"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const { loadIntercom } = require("next-intercom");

export default function Homepage() {
  const [redirectUri, setRedirectUri] = useState<string>("");

  useEffect(() => {
    if (window.location.hostname === "localhost") {
      setRedirectUri("http://localhost:3001/api/auth/validate");
    } else {
      setRedirectUri(`https://platform.hivelabs.app/api/auth/validate`);
    }
  }, []);

  loadIntercom({
    appId: "na5gvzp0",
    ssr: false,
    initWindow: true,
    delay: 0,
  });

  return (
    <>
      <div className="flex h-screen flex-col overflow-x-hidden ">
        <nav className="z-50">
          <div className="container flex flex-col items-center justify-between p-4 mx-auto space-y-4 sm:space-y-0 sm:flex-row">
            <a href="#"></a>

            <div className="flex -mx-2 gap-2">
              <button className="flex items-center p-1.5 px-4 text-sm transition rounded-lg  font-semibold">
                <Link href={`#`} className="text-zinc-900 hover:text-black">
                  Login
                </Link>
              </button>

              <button className="flex items-center p-1.5 px-4 text-sm transition rounded-lg  border-[1.75px] border-zinc-800/75   font-semibold">
                <Link
                  href={`#`}
                  className="text-zinc-900 hover:text-black text-sm"
                >
                  Get Started{" "}
                </Link>
              </button>
            </div>
          </div>
        </nav>
        <div className="py-20 rounded-md relative flex flex-col items-center justify-center antialiased">
          <div className="max-w-5xl mx-auto p-4">
            <h1 className="max-w-3xl mx-auto font-extrabold text-6xl text-center relative text-zinc-900">
              Elevate how you manage your community and team
            </h1>

            <p className="max-w-3xl mx-auto text-lg text-center relative text-zinc-800 mt-4">
              HiveLabs offers a user-friendly interface to streamline your team.
              Customize to meet your team's and community's needs. Achieve
              efficiency with our flexible systems.
            </p>

            <div className="flex gap-4 mt-5 items-center justify-center">
              <button className="flex items-center p-2 px-8 text-md transition rounded-lg  border-[1.75px] border-zinc-800/75   font-semibold">
                <Link
                  href={`#`}
                  className="text-zinc-900 hover:text-black text-sm"
                >
                  Get started with HiveLabs
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
