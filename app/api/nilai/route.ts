import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { nilaiUjianSchema } from "@/lib/validations/schemas"
import { validateRequest } from "@/lib/middleware/validation"
import { AcademicRules } from "@/lib/business-rules/academic-rules"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const validation = await validateRequest(nilaiUjianSchema)(request)
    if (validation.error) {
      return validation.error
    }

    const validatedData = validation.data

    const gradeValidation = AcademicRules.validateGradeEntry(validatedData.nilai, validatedData.jenis_ujian)
    if (!gradeValidation.isValid) {
      return NextResponse.json({ error: gradeValidation.reason }, { status: 400 })
    }

    const yearValidation = AcademicRules.validateAcademicYear(validatedData.tahun_ajaran)
    if (!yearValidation.isValid) {
      return NextResponse.json({ error: yearValidation.reason }, { status: 400 })
    }

    const { data: existingGrade } = await supabase
      .from("nilaiujians")
      .select("id")
      .eq("siswa_id", validatedData.siswa_id)
      .eq("mata_pelajaran_id", validatedData.mata_pelajaran_id)
      .eq("jenis_ujian", validatedData.jenis_ujian)
      .eq("semester", validatedData.semester)
      .eq("tahun_ajaran", validatedData.tahun_ajaran)
      .single()

    if (existingGrade) {
      return NextResponse.json(
        { error: "Nilai untuk kombinasi siswa, mata pelajaran, jenis ujian, dan semester ini sudah ada" },
        { status: 400 },
      )
    }

    const { data, error } = await supabase
      .from("nilaiujians")
      .insert([validatedData])
      .select(`
        *,
        siswas:siswa_id (nama, nis),
        matapelajarans:mata_pelajaran_id (nama_mata_pelajaran)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Nilai berhasil disimpan",
      data: {
        ...data,
        grade_letter: AcademicRules.getGradeLetter(validatedData.nilai),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
