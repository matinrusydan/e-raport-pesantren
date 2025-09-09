"use client"

import { useState, useEffect } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal, Plus, Pencil, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Guru } from "@/lib/types"
import Link from "next/link"

const columns: ColumnDef<Guru>[] = [
  {
    accessorKey: "nip",
    header: "NIP",
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
    accessorKey: "mata_pelajaran",
    header: "Mata Pelajaran",
  },
  {
    accessorKey: "no_telepon",
    header: "No. Telepon",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const guru = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/guru/${guru.id}/edit`}>
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

export default function GuruPage() {
  const [guru, setGuru] = useState<Guru[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGuru()
  }, [])

  const fetchGuru = async () => {
    try {
      const response = await fetch("/api/guru")
      if (response.ok) {
        const data = await response.json()
        setGuru(data)
      }
    } catch (error) {
      console.error("Error fetching guru:", error)
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
              <CardTitle>Data Guru</CardTitle>
              <CardDescription>Kelola data guru dan staff pesantren</CardDescription>
            </div>
            <Button asChild>
              <Link href="/dashboard/guru/tambah">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Guru
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={guru} searchKey="nama" searchPlaceholder="Cari nama guru..." />
        </CardContent>
      </Card>
    </div>
  )
}
