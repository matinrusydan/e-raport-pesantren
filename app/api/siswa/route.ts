import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { siswaSchema } from "@/lib/validations/schemas"
import { validateRequest } from "@/lib/middleware/validation"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase.from("siswas").select("*").order("nama", { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const validation = await validateRequest(siswaSchema)(request)
    if (validation.error) {
      return validation.error
    }

    const validatedData = validation.data

    if (validatedData.nis) {
      const { data: existingStudent } = await supabase.from("siswas").select("id").eq("nis", validatedData.nis).single()

      if (existingStudent) {
        return NextResponse.json({ error: "NIS sudah digunakan oleh siswa lain" }, { status: 400 })
      }
    }

    if (validatedData.tanggal_lahir) {
      const birthDate = new Date(validatedData.tanggal_lahir)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()

      if (age < 5 || age > 25) {
        return NextResponse.json({ error: "Usia siswa harus antara 5-25 tahun" }, { status: 400 })
      }
    }

    const { data, error } = await supabase.from("siswas").insert([validatedData]).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
