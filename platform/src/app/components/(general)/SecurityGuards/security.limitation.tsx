"use client";

export function AccountDisabled() {
  return (
    <>
      <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-zinc-50 py-6 sm:py-12">
        <div className="relative flex flex-grow flex-col items-center justify-center rounded-md antialiased">
          <div className="mx-auto w-full max-w-[90%] rounded-xl border border-neutral-200 bg-white md:w-[37rem]">
            <div className="space-y-3 px-3 py-8 text-center">
              <div className="flex items-center justify-center">
                <img
                  src="https://ucarecdn.com/0367e166-0623-4abc-bbb2-dbfca70dbb3f/-/preview/100x89/"
                  className="h-11"
                  alt="Centered Image"
                />
              </div>

              <div className="ml-4 mr-4">
                <p className="mt-5 text-sm font-medium text-zinc-500">
                  At HiveLabs, we prioritize the safety and integrity of our
                  platform. Regrettably, it has come to our attention that
                  certain accounts have violated our Terms of Service.
                </p>

                <p className="mt-5 text-sm font-medium text-zinc-500">
                  After careful review, it has been determined that your account
                  is subject to suspension. This decision was made with the
                  utmost consideration for maintaining a secure environment for
                  all users.
                </p>

                <p className="mt-5 text-sm font-medium text-zinc-500">
                  Should you wish to discuss this matter further or feel that
                  there has been an error in the suspension of your account,
                  please don&apos;t hesitate to reach out to our dedicated
                  security team at <b>security@hivelabs.app</b>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
