"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Homepage() {
  const [redirectUri, setRedirectUri] = useState<string>("");

  useEffect(() => {
    if (window.location.hostname === "localhost") {
      setRedirectUri("http://localhost:3002/auth/validate");
    } else {
      setRedirectUri(`https://platform.hivelabs.app/api/auth/validate`);
    }
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-x-hidden bg-white">
      <div className=" absolute inset-0 bg-[url(https://cdn.discordapp.com/attachments/1085699450346946571/1219412134761336862/New_Project_-_2024-03-18T182819.299.png?ex=660b350c&is=65f8c00c&hm=ca65b05f5fdc60161a984d13819a58e85bed86608a945b36877d30912aaed2d7&)] bg-center "></div>
      <div className="flex-grow rounded-md relative flex flex-col items-center justify-center antialiased">
        <div className="max-w-2xl mx-auto p-4">
          <h2 className="mx-auto font-bold text-3xl lg:text-4xl text-center relative text-black">
            Hey there, welcome to{" "}
            <span className="text-[#ff5789]">HiveLabs</span>.
          </h2>

          <p></p>
          <p className="max-w-lg mx-auto  text-sm text-center relative text-black mt-4">
            With HiveLabs, you are able to easily mitigate any admin abuse your
            community may experience, and efficientally manage your whole staff
            team all within a single dashboard.
          </p>
          <p></p>
          <div className="flex justify-center items-center gap-3 mt-5 ">
            <Button
              variant="default"
              className="w-[57%] transition h-10 rounded-xl bg-[#ff5789] hover:bg-[#93b23a] text-white font-semibold"
              asChild
            >
              <Link
                href={`https://apis.roblox.com/oauth/v1/authorize?client_id=3411785918827481640&redirect_uri=${redirectUri}&scope=openid+profile&response_type=Code&prompts=login+consent&nonce=12345&state=6789`}
                className="text-white"
              >
                Join our Waitlist
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
