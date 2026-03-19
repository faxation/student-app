import { InstructorAuthProvider } from "@/lib/instructor-auth-context";

export default function InstructorRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <InstructorAuthProvider>{children}</InstructorAuthProvider>;
}
