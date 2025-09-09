"use client"

import { useState, useEffect } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Plus, Pencil, Trash2, Download } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Siswa } from "@/lib/types"
import Link from "next/link"
import { ExcelImportDialog } from "@/components/excel/excel-import-dialog"
import { ReportGenerator } from "@/components/reports/report-generator"
import { useToast } from "@/lib/hooks/use-toast"

const columns: ColumnDef<Siswa>[] = [
  {
    accessorKey: "nis",
    header: "NIS",
  },
  {
    accessorKey: "nama",
    header: "Nama",
  },
  {
    accessorKey: "jenis_kelamin",
    header: "Jenis Kelamin",
    cell: ({ row }) => {
      const jenisKelamin = row.getValue("jenis_kelamin") as string
      return jenisKelamin === "L" ? "Laki-laki" : "Perempuan"
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const variant = status === "aktif" ? "default" : status === "lulus" ? "secondary" : "destructive"
      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    accessorKey: "tanggal_masuk",
    header: "Tanggal Masuk",
    cell: ({ row }) => {
      const date = row.getValue("tanggal_masuk") as string
      return date ? new Date(date).toLocaleDateString("id-ID") : "-"
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const siswa = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/siswa/${siswa.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <div className="w-full">
                <ReportGenerator type="raport" entityId={siswa.id} entityName={siswa.nama} />
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <div className="w-full">
                <ReportGenerator type="student-profile" entityId={siswa.id} entityName={siswa.nama} />
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function SiswaPage() {
  const [siswa, setSiswa] = useState<Siswa[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchSiswa()
  }, [])

  const fetchSiswa = async () => {
    try {
      const response = await fetch("/api/siswa")
      if (response.ok) {
        const data = await response.json()
        setSiswa(data)
      }
    } catch (error) {
      console.error("Error fetching siswa:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportExcel = async () => {
    try {
      const response = await fetch("/api/excel/export/siswa")
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `data_siswa_${new Date().toISOString().split("T")[0]}.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Export berhasil",
          description: "Data siswa berhasil diekspor ke Excel",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengekspor data",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Data Siswa</CardTitle>
              <CardDescription>Kelola data siswa pesantren</CardDescription>
            </div>
            <div className="flex gap-2">
              <ExcelImportDialog type="siswa" onImportSuccess={fetchSiswa} />
              <Button variant="outline" onClick={handleExportExcel}>
                <Download className="mr-2 h-4 w-4" />
                Export Excel
              </Button>
              <Button asChild>
                <Link href="/dashboard/siswa/tambah">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Siswa
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={siswa} searchKey="nama" searchPlaceholder="Cari nama siswa..." />
        </CardContent>
      </Card>
    </div>
  )
}
