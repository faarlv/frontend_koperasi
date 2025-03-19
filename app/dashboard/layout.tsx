"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  FileSpreadsheet,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Receipt,
  Settings,
  Users,
  Wallet,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Loans",
    href: "/dashboard/loans",
    icon: Receipt,
  },
  {
    title: "Balance",
    href: "/dashboard/balance",
    icon: Wallet,
  },
  {
    title: "Installments",
    href: "/dashboard/installments",
    icon: BarChart3,
  },
  {
    title: "Excel Reports",
    href: "/dashboard/reports",
    icon: FileSpreadsheet,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Check for authentication
    const token = localStorage.getItem("auth-token")
    if (!token) {
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("auth-token")
    router.push("/")
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <nav className="grid gap-2 text-lg font-medium">
              <div className="flex h-16 items-center border-b px-2">
                <Home className="mr-2 h-6 w-6" />
                <span className="text-lg font-semibold">Admin Dashboard</span>
              </div>
              {navItems.map((item, index) => (
                <Button
                  key={index}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="justify-start gap-2"
                  asChild
                >
                  <a href={item.href}>
                    <item.icon className="h-5 w-5" />
                    {item.title}
                  </a>
                </Button>
              ))}
              <Button
                variant="ghost"
                className="justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2 md:ml-auto md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-600 hover:bg-red-50 ml-auto"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 flex-col border-r bg-background md:flex">
          <div className="flex h-16 items-center border-b px-6">
            <Home className="mr-2 h-6 w-6" />
            <span className="text-lg font-semibold">Admin Dashboard</span>
          </div>
          <nav className="grid gap-1 p-4">
            {navItems.map((item, index) => (
              <Button
                key={index}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn("justify-start gap-2", pathname === item.href && "bg-primary/10")}
                asChild
              >
                <a href={item.href}>
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </a>
              </Button>
            ))}
            <Button
              variant="ghost"
              className="justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 mt-auto"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </nav>
        </aside>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

