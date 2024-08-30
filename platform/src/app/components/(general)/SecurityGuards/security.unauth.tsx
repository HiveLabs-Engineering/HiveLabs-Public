"use client";

import { KeyIcon, QuestionMarkCircleIcon } from "@heroicons/react/20/solid";

export function InvalidPermissions() {
  return (
    <>
      <div className=" flex h-full flex-col justify-center overflow-hidden bg-zinc-50 ">
        <div className="flex flex-grow  flex-col items-center justify-center rounded-md ">
          <div className="space-y-3 px-3 py-7 text-center">
            <div className="flex items-center justify-center">
              <KeyIcon className="h-16 w-16 text-zinc-600" />
            </div>
            <div className="mx-4">
              <p className="text-lg font-bold text-zinc-700">
                You do not have valid permissions
              </p>
              <p className="mt-2 max-w-xl text-sm text-zinc-500">
                We do not have the authorization to complete this request, if
                you believe this is a mistake either contact the workspace owner
                or our team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
