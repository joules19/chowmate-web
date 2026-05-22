import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    template: "%s | Chowmate",
    default: "Chowmate",
  },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-primary-fade">
      <div className="">{children}</div>
    </div>
  );
}
