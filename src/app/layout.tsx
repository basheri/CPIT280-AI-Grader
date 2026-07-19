import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CPIT280 AI Grader",
  description: "مساعد شخصي لتصحيح واجبات مقرر CPIT280 وفق السؤال والـRubric.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
