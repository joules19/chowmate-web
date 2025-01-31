import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-primary-3">
      <div className="">{children}</div>
    </div>
  );
}
