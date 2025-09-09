"use client"

import { useState, useEffect } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal, Plus, Pencil, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Kelas } from "@/lib/types"
import Link from "next/link"

const columns: ColumnDef<Kelas>[] = [
  {
    accessorKey: "nama_kelas",
    header: "Nama Kelas",
  },
  {
    accessorKey: "tingkat",
    header: "Tingkat",
  },
  {
    accessorKey: "tahun_ajaran",
    header: "Tahun Ajaran",
  },
  {
    accessorKey: "kapasitas",
    header: "Kapasitas",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const kelas = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/kelas/${kelas.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
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

export default function KelasPage() {
  const [kelas, setKelas] = useState<Kelas[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchKelas()
  }, [])

  const fetchKelas = async () => {
    try {
      const response = await fetch("/api/kelas")
      if (response.ok) {
        const data = await response.json()
        setKelas(data)
      }
    } catch (error) {
      console.error("Error fetching kelas:", error)
    } finally {
      setLoading(false)
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
              <CardTitle>Data Kelas</CardTitle>
              <CardDescription>Kelola data kelas pesantren</CardDescription>
            </div>
            <Button asChild>
              <Link href="/dashboard/kelas/tambah">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Kelas
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={kelas} searchKey="nama_kelas" searchPlaceholder="Cari nama kelas..." />
        </CardContent>
      </Card>
    </div>
  )
}
