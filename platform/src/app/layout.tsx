import "~/styles/globals.css";

import { TRPCReactProvider } from "~/trpc/react";
import { AuthProvider } from "./auth";
import "@uploadthing/react/styles.css";

export const metadata = {
  title: "HiveLabs",
  description:
    "With HiveLabs, you are able to easily mitigate any admin abuse your community may experience, and efficientally manage your whole staff team all within a single dashboard.",
  icons: [
    {
      rel: "icon",
      url: "https://ucarecdn.com/f5c10777-10e4-4760-a1f5-3d9c6981f92b/-/preview/1000x1000/",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="dark">
        <AuthProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
