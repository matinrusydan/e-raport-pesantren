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
import { siswaSchema, type SiswaInput } from "@/lib/validations/schemas"
import { FormFieldError } from "@/components/forms/form-field-error"
import { useToast } from "@/lib/hooks/use-toast"

export default function TambahSiswaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<SiswaInput>({
    nis: "",
    nama: "",
    jenis_kelamin: "L",
    tempat_lahir: "",
    tanggal_lahir: "",
    alamat: "",
    no_telepon: "",
    email: "",
    nama_wali: "",
    no_telepon_wali: "",
    status: "aktif",
    tanggal_masuk: new Date().toISOString().split("T")[0],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const validationResult = siswaSchema.safeParse(formData)
      if (!validationResult.success) {
        const fieldErrors: Record<string, string> = {}
        validationResult.error.errors.forEach((error) => {
          const field = error.path.join(".")
          fieldErrors[field] = error.message
        })
        setErrors(fieldErrors)
        setLoading(false)
        return
      }

      const response = await fetch("/api/siswa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validationResult.data),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: "Data siswa berhasil disimpan",
        })
        router.push("/dashboard/siswa")
      } else {
        if (result.details) {
          const fieldErrors: Record<string, string> = {}
          result.details.forEach((detail: any) => {
            fieldErrors[detail.field] = detail.message
          })
          setErrors(fieldErrors)
        } else {
          toast({
            title: "Error",
            description: result.error || "Gagal menyimpan data siswa",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof SiswaInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/siswa">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Data Siswa
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tambah Siswa Baru</CardTitle>
          <CardDescription>Masukkan data siswa baru dengan lengkap dan benar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nis">NIS</Label>
                <Input
                  id="nis"
                  value={formData.nis || ""}
                  onChange={(e) => handleChange("nis", e.target.value)}
                  placeholder="Nomor Induk Siswa"
                />
                <FormFieldError error={errors.nis} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap *</Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => handleChange("nama", e.target.value)}
                  placeholder="Nama lengkap siswa"
                  required
                />
                <FormFieldError error={errors.nama} />
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
                <FormFieldError error={errors.jenis_kelamin} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                <Input
                  id="tempat_lahir"
                  value={formData.tempat_lahir || ""}
                  onChange={(e) => handleChange("tempat_lahir", e.target.value)}
                  placeholder="Tempat lahir"
                />
                <FormFieldError error={errors.tempat_lahir} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                <Input
                  id="tanggal_lahir"
                  type="date"
                  value={formData.tanggal_lahir || ""}
                  onChange={(e) => handleChange("tanggal_lahir", e.target.value)}
                />
                <FormFieldError error={errors.tanggal_lahir} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="no_telepon">No. Telepon</Label>
                <Input
                  id="no_telepon"
                  value={formData.no_telepon || ""}
                  onChange={(e) => handleChange("no_telepon", e.target.value)}
                  placeholder="Nomor telepon siswa"
                />
                <FormFieldError error={errors.no_telepon} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Email siswa"
                />
                <FormFieldError error={errors.email} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nama_wali">Nama Wali</Label>
                <Input
                  id="nama_wali"
                  value={formData.nama_wali || ""}
                  onChange={(e) => handleChange("nama_wali", e.target.value)}
                  placeholder="Nama wali siswa"
                />
                <FormFieldError error={errors.nama_wali} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="no_telepon_wali">No. Telepon Wali</Label>
                <Input
                  id="no_telepon_wali"
                  value={formData.no_telepon_wali || ""}
                  onChange={(e) => handleChange("no_telepon_wali", e.target.value)}
                  placeholder="Nomor telepon wali"
                />
                <FormFieldError error={errors.no_telepon_wali} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tanggal_masuk">Tanggal Masuk</Label>
                <Input
                  id="tanggal_masuk"
                  type="date"
                  value={formData.tanggal_masuk || ""}
                  onChange={(e) => handleChange("tanggal_masuk", e.target.value)}
                />
                <FormFieldError error={errors.tanggal_masuk} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alamat">Alamat</Label>
              <Textarea
                id="alamat"
                value={formData.alamat || ""}
                onChange={(e) => handleChange("alamat", e.target.value)}
                placeholder="Alamat lengkap siswa"
                rows={3}
              />
              <FormFieldError error={errors.alamat} />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/siswa">Batal</Link>
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
