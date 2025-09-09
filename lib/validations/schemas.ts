import { z } from "zod"

// Base schemas
export const siswaSchema = z.object({
  nis: z.string().optional().nullable(),
  nama: z.string().min(2, "Nama minimal 2 karakter").max(100, "Nama maksimal 100 karakter"),
  jenis_kelamin: z.enum(["L", "P"], { required_error: "Jenis kelamin wajib dipilih" }),
  tempat_lahir: z.string().max(50, "Tempat lahir maksimal 50 karakter").optional().nullable(),
  tanggal_lahir: z.string().optional().nullable(),
  alamat: z.string().max(500, "Alamat maksimal 500 karakter").optional().nullable(),
  no_telepon: z
    .string()
    .regex(/^[0-9+\-\s()]*$/, "Format nomor telepon tidak valid")
    .max(15, "Nomor telepon maksimal 15 karakter")
    .optional()
    .nullable(),
  email: z.string().email("Format email tidak valid").optional().nullable(),
  nama_wali: z.string().max(100, "Nama wali maksimal 100 karakter").optional().nullable(),
  no_telepon_wali: z
    .string()
    .regex(/^[0-9+\-\s()]*$/, "Format nomor telepon tidak valid")
    .max(15, "Nomor telepon maksimal 15 karakter")
    .optional()
    .nullable(),
  status: z.enum(["aktif", "lulus", "pindah", "keluar"]).default("aktif"),
  tanggal_masuk: z.string().optional().nullable(),
})

export const guruSchema = z.object({
  nip: z.string().optional().nullable(),
  nama: z.string().min(2, "Nama minimal 2 karakter").max(100, "Nama maksimal 100 karakter"),
  jenis_kelamin: z.enum(["L", "P"], { required_error: "Jenis kelamin wajib dipilih" }),
  tempat_lahir: z.string().max(50, "Tempat lahir maksimal 50 karakter").optional().nullable(),
  tanggal_lahir: z.string().optional().nullable(),
  alamat: z.string().max(500, "Alamat maksimal 500 karakter").optional().nullable(),
  no_telepon: z
    .string()
    .regex(/^[0-9+\-\s()]*$/, "Format nomor telepon tidak valid")
    .max(15, "Nomor telepon maksimal 15 karakter")
    .optional()
    .nullable(),
  email: z.string().email("Format email tidak valid").optional().nullable(),
  mata_pelajaran: z.string().max(100, "Mata pelajaran maksimal 100 karakter").optional().nullable(),
})

export const kelasSchema = z.object({
  nama_kelas: z.string().min(1, "Nama kelas wajib diisi").max(50, "Nama kelas maksimal 50 karakter"),
  tingkat: z.number().int().min(1, "Tingkat minimal 1").max(12, "Tingkat maksimal 12"),
  tahun_ajaran: z.string().regex(/^\d{4}\/\d{4}$/, "Format tahun ajaran: YYYY/YYYY"),
  kapasitas: z.number().int().min(1, "Kapasitas minimal 1").max(50, "Kapasitas maksimal 50 siswa"),
})

export const nilaiUjianSchema = z.object({
  siswa_id: z.string().uuid("ID siswa tidak valid"),
  mata_pelajaran_id: z.string().uuid("ID mata pelajaran tidak valid"),
  jenis_ujian: z.enum(["UTS", "UAS", "Quiz", "Tugas"]),
  nilai: z.number().min(0, "Nilai minimal 0").max(100, "Nilai maksimal 100"),
  tanggal_ujian: z.string(),
  semester: z.number().int().min(1, "Semester minimal 1").max(2, "Semester maksimal 2"),
  tahun_ajaran: z.string().regex(/^\d{4}\/\d{4}$/, "Format tahun ajaran: YYYY/YYYY"),
})

export const kehadiranSchema = z.object({
  siswa_id: z.string().uuid("ID siswa tidak valid"),
  indikator_kehadiran_id: z.string().uuid("ID indikator kehadiran tidak valid"),
  status: z.enum(["hadir", "sakit", "izin", "alpha"]),
  tanggal: z.string(),
  keterangan: z.string().max(500, "Keterangan maksimal 500 karakter").optional().nullable(),
})

export const nilaiSikapSchema = z.object({
  siswa_id: z.string().uuid("ID siswa tidak valid"),
  indikator_sikap_id: z.string().uuid("ID indikator sikap tidak valid"),
  nilai: z.enum(["A", "B", "C", "D"]),
  semester: z.number().int().min(1, "Semester minimal 1").max(2, "Semester maksimal 2"),
  tahun_ajaran: z.string().regex(/^\d{4}\/\d{4}$/, "Format tahun ajaran: YYYY/YYYY"),
  catatan: z.string().max(500, "Catatan maksimal 500 karakter").optional().nullable(),
})

export const penempatanKamarSchema = z.object({
  siswa_id: z.string().uuid("ID siswa tidak valid"),
  kamar_id: z.string().uuid("ID kamar tidak valid"),
  tanggal_masuk: z.string(),
  tanggal_keluar: z.string().optional().nullable(),
})

// Form schemas (for frontend validation)
export const loginFormSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
})

export const registerFormSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  fullName: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  role: z.enum(["admin", "guru", "staff"]),
})

// Export types
export type SiswaInput = z.infer<typeof siswaSchema>
export type GuruInput = z.infer<typeof guruSchema>
export type KelasInput = z.infer<typeof kelasSchema>
export type NilaiUjianInput = z.infer<typeof nilaiUjianSchema>
export type KehadiranInput = z.infer<typeof kehadiranSchema>
export type NilaiSikapInput = z.infer<typeof nilaiSikapSchema>
export type PenempatanKamarInput = z.infer<typeof penempatanKamarSchema>
export type LoginFormInput = z.infer<typeof loginFormSchema>
export type RegisterFormInput = z.infer<typeof registerFormSchema>
