import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ReactNode } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { customAntdTheme } from "./theme/themeConfig";
import { ConfigProvider } from "antd";
import { Montserrat } from "next/font/google";

export const metadata = {
  title: "Job Posting App",
  description: "Job posting and recruitment made easy",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // All weights
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={montserrat.className}>
      <body>
        <AntdRegistry>
          <ConfigProvider theme={customAntdTheme}>{children} </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
