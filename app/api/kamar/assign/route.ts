import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { penempatanKamarSchema } from "@/lib/validations/schemas"
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

    const validation = await validateRequest(penempatanKamarSchema)(request)
    if (validation.error) {
      return validation.error
    }

    const validatedData = validation.data

    const assignmentCheck = await AcademicRules.canAssignRoom(validatedData.siswa_id, validatedData.kamar_id)
    if (!assignmentCheck.canAssign) {
      return NextResponse.json({ error: assignmentCheck.reason }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("penempatan_kamar")
      .insert([validatedData])
      .select(`
        *,
        siswas:siswa_id (nama, nis),
        kamars:kamar_id (nama_kamar, jenis_kelamin)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Siswa berhasil ditempatkan di kamar",
      data,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
