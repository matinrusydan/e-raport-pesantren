"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TambahGuruPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nip: "",
    nama: "",
    jenis_kelamin: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    alamat: "",
    no_telepon: "",
    email: "",
    mata_pelajaran: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/guru", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/dashboard/guru")
      } else {
        console.error("Error creating guru")
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/guru">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Data Guru
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tambah Guru Baru</CardTitle>
          <CardDescription>Masukkan data guru baru</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nip">NIP</Label>
                <Input
                  id="nip"
                  value={formData.nip}
                  onChange={(e) => handleChange("nip", e.target.value)}
                  placeholder="Nomor Induk Pegawai"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap *</Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => handleChange("nama", e.target.value)}
                  placeholder="Nama lengkap guru"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jenis_kelamin">Jenis Kelamin *</Label>
                <Select
                  value={formData.jenis_kelamin}
                  onValueChange={(value) => handleChange("jenis_kelamin", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Laki-laki</SelectItem>
                    <SelectItem value="P">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                <Input
                  id="tempat_lahir"
                  value={formData.tempat_lahir}
                  onChange={(e) => handleChange("tempat_lahir", e.target.value)}
                  placeholder="Tempat lahir"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                <Input
                  id="tanggal_lahir"
                  type="date"
                  value={formData.tanggal_lahir}
                  onChange={(e) => handleChange("tanggal_lahir", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="no_telepon">No. Telepon</Label>
                <Input
                  id="no_telepon"
                  value={formData.no_telepon}
                  onChange={(e) => handleChange("no_telepon", e.target.value)}
                  placeholder="Nomor telepon guru"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Email guru"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mata_pelajaran">Mata Pelajaran</Label>
                <Input
                  id="mata_pelajaran"
                  value={formData.mata_pelajaran}
                  onChange={(e) => handleChange("mata_pelajaran", e.target.value)}
                  placeholder="Mata pelajaran yang diampu"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alamat">Alamat</Label>
              <Textarea
                id="alamat"
                value={formData.alamat}
                onChange={(e) => handleChange("alamat", e.target.value)}
                placeholder="Alamat lengkap guru"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/guru">Batal</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
