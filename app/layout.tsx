import type { Metadata } from "next";
import { Rubik, Bungee } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { DashboardHeader } from "./components/dashboard/DashboardHeader";
import { MobileBottomBar } from "./components/dashboard/MobileBottomBar";
import { AuthProvider } from "./providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { Sidebar } from "./components/dashboard/Sidebar";
import { getUser } from "./services/roles";
import { isSuperAdmin } from "./services/roles";

const isSuper = await isSuperAdmin()
const profile = await getUser();

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const bungee = Bungee({
  variable: "--font-bungee",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Top Business Platform",
  description: "A platform for managing business operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${rubik.variable} ${bungee.variable}`}>
      <body
        className={`${rubik.className} antialiased overflow-hidden`}
        suppressHydrationWarning={true}
      >
        <AuthProvider isSuper={isSuper}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <DashboardHeader profile={profile}/>
            <Toaster />
            <div className="flex h-[calc(100vh-4rem)]">
              <Sidebar />
              <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
                {children}
              </main>
            </div>
            <MobileBottomBar />
            <Analytics />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
