"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const features = [
  {
    name: "Seamless Integration",
    description:
      "Easily integrate our platform with managed devices to effectively monitor student behavior and academic integrity, all from a single interface.",
  },
  {
    name: "Comprehensive Compliance",
    description:
      "Our platform adheres to all relevant international and state regulations, ensuring robust security and privacy for students.",
  },
  {
    name: "Advanced Machine Learning",
    description:
      "Utilize our cutting-edge AI tools that continuously learn and adapt from student behavior to enhance detection and support.",
  },
];

export default function Homepage() {
  const [redirectUri, setRedirectUri] = useState<string>("");

  useEffect(() => {
    if (window.location.hostname === "localhost") {
      setRedirectUri("http://localhost:3001/api/auth/validate");
    } else {
      setRedirectUri(`https://platform.hivelabs.app/api/auth/validate`);
    }
  }, []);

  return (
    <>
      <div className="flex h-screen flex-col overflow-x-hidden bg-gray-50">
        <nav className="z-50">
          <div className="container flex flex-col items-center justify-between p-4 mx-auto space-y-4 sm:space-y-0 sm:flex-row">
            <a href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 622 93"
                className="h-10 w-36"
              >
                <path
                  fill="#000000"
                  fill-rule="evenodd"
                  d="M10.3 46.4 30 12H70l5.7 10H50a5 5 0 0 0 0 10h31.4l4.6 8H42a5 5 0 0 0 0 10h45.6L70 80.8H30L22.7 68H49a5 5 0 0 0 0-10H17l-6.7-11.6ZM22 6.1A8.2 8.2 0 0 1 29.1 2h41.8c3 0 5.6 1.6 7.1 4.1l20.9 36.2a8.2 8.2 0 0 1 0 8.2L78 86.7a8.2 8.2 0 0 1-7.1 4.1H29.1c-3 0-5.6-1.6-7.1-4.1L1.1 50.5a8.2 8.2 0 0 1 0-8.2L22 6.1Z"
                  clip-rule="evenodd"
                />
                <path
                  fill="#000000"
                  d="M123 .1h16.6V32c4.1-7.3 11.5-10.3 19.6-10.3 14.8 0 22.8 11 22.8 25.8V91h-16.5V53.1c0-11.3-3-17.5-11.7-17.5-9 0-14.2 6.2-14.2 17.5V91H123V.1ZM199.8 23.2h16.7V91h-16.7V23.2Zm-.2-9.5V0h17.1v13.6h-17.1ZM297.7 23.2l-25 67.8h-19.5L228 23.2h17.1l17.7 51 17.5-51h17.3ZM302.4 57c0-21.4 13.3-35.4 33.5-35.4 17.4 0 31.6 11.8 31.9 35.9l.1 4h-48.2c.7 11.3 6.6 18 16.2 18a15 15 0 0 0 14-9.4l17 1.3c-4 13-16.3 21.1-31 21.1-20.2 0-33.5-14-33.5-35.4Zm17.5-6.4h30.9c-1.3-11.6-7.7-16-14.9-16-9 0-14.7 6.1-16 16ZM383.5.1h11v77c0 2.9 1.3 4.2 4 4.2h6V91h-7.7c-8 0-13.3-5.4-13.3-13.3V0ZM416.8 43.1c2.7-13.2 13.3-21.5 27.8-21.5C462 21.6 472 32 472 50v27.2c0 2.8 1.2 4 4 4h2.9V91H474c-6.9 0-13-2.2-13-10.4-2.8 6.2-10.3 12-21 12-13.5 0-24.5-7.2-24.5-19.4 0-14 10.5-17.5 25.6-20.5L461 49c-.2-11.3-5.6-16.8-16.4-16.8-8.5 0-14.1 4.2-16.2 12l-11.6-1Zm10.4 30.1c0 5.3 4.4 9.6 14.3 9.6 11 0 19.7-7.7 19.7-23.5v-.7l-15.9 2.8c-10 1.8-18.1 2.3-18.1 11.8ZM493.6.1h11V32c3.7-6.3 11.7-10.3 20.8-10.3 17.6 0 28.6 13.7 28.6 35.5 0 21.7-11 35.4-28.6 35.4-9.5 0-17.7-4.2-21.4-11l-.4 9.5h-10V.1Zm10 57c0 15.3 7.6 25 19.5 25s19.4-9.7 19.4-25c0-15.6-7.5-25.5-19.4-25.5-12 0-19.5 9.9-19.5 25.5ZM609.2 44.2c-1.6-7.6-9.1-12-16.6-12-7.4 0-13.4 3.6-13.4 10 0 6.7 8.8 9.4 16 10.8 15.4 3 26.8 7.2 26.8 20.7 0 13.2-13.7 18.8-26.5 18.8-16.2 0-28.5-8.8-29.5-22.9l11.5-.7c1.4 8 7.8 13.1 18 13.1 6.4 0 15-2 15-9 0-8-9.5-8.8-17.2-10.5-12.3-2.9-25.6-6.3-25.6-19.6 0-13 10.5-21.3 26-21.3 13.7 0 24.8 8.6 27 21.8l-11.5.8Z"
                />
              </svg>
            </a>

            <div className="flex -mx-2 gap-2"></div>
          </div>
        </nav>
        <div className="py-20 rounded-md relative flex flex-col items-center justify-center antialiased">
          <div className="max-w-5xl mx-auto p-4">
            <h1 className="w-4xl mx-auto font-extrabold text-6xl text-center relative text-zinc-900">
              <span className="bg-gradient-to-r from-red-500 via-rose-500 mr-4 to-red-500 bg-clip-text text-transparent">
                Seems like that page has gone missing!
              </span>
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}
