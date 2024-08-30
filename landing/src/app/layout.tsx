import { useRouter } from "next/navigation";
import "./globals.css";

export const metadata = {
  title: "HiveLabs",
  description:
    "With HiveLabs, you are able to easily mitigate any admin abuse your community may experience, and efficientally manage your whole staff team all within a single dashboard.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="light">{children}</body>
    </html>
  );
}
