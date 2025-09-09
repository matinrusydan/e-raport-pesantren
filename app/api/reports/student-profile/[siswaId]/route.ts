import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { DocxService } from "@/lib/docx/docx-service"

export async function GET(request: NextRequest, { params }: { params: Promise<{ siswaId: string }> }) {
  try {
    const { siswaId } = await params
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get student data
    const { data: siswa, error: siswaError } = await supabase.from("siswas").select("*").eq("id", siswaId).single()

    if (siswaError || !siswa) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Prepare template data
    const templateData = {
      nama: siswa.nama,
      nis: siswa.nis || "-",
      jenis_kelamin: siswa.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan",
      tempat_lahir: siswa.tempat_lahir || "-",
      tanggal_lahir: siswa.tanggal_lahir ? new Date(siswa.tanggal_lahir).toLocaleDateString("id-ID") : "-",
      alamat: siswa.alamat || "-",
      no_telepon: siswa.no_telepon || "-",
      email: siswa.email || "-",
      nama_wali: siswa.nama_wali || "-",
      no_telepon_wali: siswa.no_telepon_wali || "-",
      status: siswa.status,
      tanggal_masuk: siswa.tanggal_masuk ? new Date(siswa.tanggal_masuk).toLocaleDateString("id-ID") : "-",
    }

    // Generate document
    const templateBuffer = DocxService.createStudentProfileTemplate()
    const documentBuffer = await DocxService.generateReport(templateBuffer, templateData)

    return new NextResponse(documentBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="profil_${siswa.nama.replace(/\s+/g, "_")}.docx"`,
      },
    })
  } catch (error) {
    console.error("Error generating student profile:", error)
    return NextResponse.json({ error: "Failed to generate student profile" }, { status: 500 })
  }
}
