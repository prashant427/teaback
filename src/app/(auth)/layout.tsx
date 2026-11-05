export const metadata = {
  title: "Account",
  description: "Log in, sign up, or verify your Bebaak account.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-dvh bg-background">{children}</div>;
}
