import "./globals.css";

export const metadata = {
  title: "Mirror Commits - Fix Your GitHub Contribution Graph",
  description: "Interactive tool to mirror your work commits to personal GitHub. No code, no secrets - just timestamps.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased font-mono">
        {children}
      </body>
    </html>
  );
}
