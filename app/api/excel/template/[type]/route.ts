import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { ExcelService } from "@/lib/excel/excel-service"
import {
  siswaTemplateColumns,
  guruTemplateColumns,
  kelasTemplateColumns,
  nilaiTemplateColumns,
  sampleSiswaData,
  sampleGuruData,
} from "@/lib/excel/templates"

export async function GET(request: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  try {
    const { type } = await params
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let columns, templateName, sampleData

    switch (type) {
      case "siswa":
        columns = siswaTemplateColumns
        templateName = "Template Data Siswa"
        sampleData = sampleSiswaData
        break
      case "guru":
        columns = guruTemplateColumns
        templateName = "Template Data Guru"
        sampleData = sampleGuruData
        break
      case "kelas":
        columns = kelasTemplateColumns
        templateName = "Template Data Kelas"
        sampleData = []
        break
      case "nilai":
        columns = nilaiTemplateColumns
        templateName = "Template Data Nilai"
        sampleData = []
        break
      default:
        return NextResponse.json({ error: "Template type not found" }, { status: 404 })
    }

    const buffer = await ExcelService.generateTemplate(templateName, columns, sampleData)

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="template_${type}_${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    })
  } catch (error) {
    console.error("Error generating template:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
