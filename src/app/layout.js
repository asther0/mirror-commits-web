import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Mirror Commits - Fix Your GitHub Contribution Graph",
  description: "Interactive tool to mirror your work commits to personal GitHub. No code, no secrets - just timestamps.",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased font-mono">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
