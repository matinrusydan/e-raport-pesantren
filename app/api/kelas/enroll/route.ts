import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { validateRequest } from "@/lib/middleware/validation"
import { AcademicRules } from "@/lib/business-rules/academic-rules"

const enrollmentSchema = z.object({
  siswa_id: z.string().uuid("ID siswa tidak valid"),
  kelas_id: z.string().uuid("ID kelas tidak valid"),
  tahun_ajaran: z.string().regex(/^\d{4}\/\d{4}$/, "Format tahun ajaran: YYYY/YYYY"),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const validation = await validateRequest(enrollmentSchema)(request)
    if (validation.error) {
      return validation.error
    }

    const { siswa_id, kelas_id, tahun_ajaran } = validation.data

    const enrollmentCheck = await AcademicRules.canEnrollStudent(siswa_id, kelas_id, tahun_ajaran)
    if (!enrollmentCheck.canEnroll) {
      return NextResponse.json({ error: enrollmentCheck.reason }, { status: 400 })
    }

    const yearValidation = AcademicRules.validateAcademicYear(tahun_ajaran)
    if (!yearValidation.isValid) {
      return NextResponse.json({ error: yearValidation.reason }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("riwayat_kelas")
      .insert([{ siswa_id, kelas_id, tahun_ajaran }])
      .select(`
        *,
        siswas:siswa_id (nama, nis),
        kelas:kelas_id (nama_kelas, tingkat)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Siswa berhasil didaftarkan ke kelas",
      data,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
