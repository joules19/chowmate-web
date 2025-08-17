import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { customAntdTheme } from "./theme/themeConfig";
import { ConfigProvider } from "antd";
import { Montserrat } from "next/font/google";
import AdminLink from "./components/navigation/AdminLink";

export const metadata: Metadata = {
  title: "Food Delivery App",
  description: "Food delivery made easy",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={montserrat.className}>
      <body className="bg-primary-fade">
        <AntdRegistry>
          <ConfigProvider theme={customAntdTheme}>
            <main className="">{children}</main>
            <AdminLink />
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
