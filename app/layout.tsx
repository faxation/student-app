import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import { MoodleProvider } from "@/lib/moodle-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Student App – University Dashboard",
  description: "A modern student dashboard for academic organization.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <MoodleProvider>{children}</MoodleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
