import { QueryProvider } from "@/providers/query-client-provider";

export default function CheckOutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QueryProvider>{children}</QueryProvider>;
}
