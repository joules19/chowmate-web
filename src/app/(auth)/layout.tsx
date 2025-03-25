import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-primary-fade">
      <div className="">{children}</div>
    </div>
  );
}
