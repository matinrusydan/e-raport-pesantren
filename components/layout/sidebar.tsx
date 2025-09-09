"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Users, GraduationCap, BookOpen, Calendar, Home, FileText, Settings, Building } from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Data Siswa",
    href: "/dashboard/siswa",
    icon: Users,
  },
  {
    name: "Data Guru",
    href: "/dashboard/guru",
    icon: GraduationCap,
  },
  {
    name: "Data Kelas",
    href: "/dashboard/kelas",
    icon: BookOpen,
  },
  {
    name: "Kamar & Asrama",
    href: "/dashboard/kamar",
    icon: Building,
  },
  {
    name: "Kehadiran",
    href: "/dashboard/kehadiran",
    icon: Calendar,
  },
  {
    name: "Nilai & Raport",
    href: "/dashboard/nilai",
    icon: FileText,
  },
  {
    name: "Pengaturan",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-gray-50 border-r">
      <div className="flex h-16 items-center px-6 border-b">
        <h1 className="text-xl font-semibold">Pesantren Management</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Button
              key={item.name}
              variant={isActive ? "secondary" : "ghost"}
              className={cn("w-full justify-start", isActive && "bg-gray-200")}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Link>
            </Button>
          )
        })}
      </nav>
    </div>
  )
}
