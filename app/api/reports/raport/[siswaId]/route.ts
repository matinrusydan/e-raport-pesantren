import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { DocxService } from "@/lib/docx/docx-service"

export async function GET(request: NextRequest, { params }: { params: Promise<{ siswaId: string }> }) {
  try {
    const { siswaId } = await params
    const { searchParams } = new URL(request.url)
    const semester = searchParams.get("semester") || "1"
    const tahunAjaran = searchParams.get("tahun_ajaran") || "2024/2025"

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

    // Get student's current class
    const { data: riwayatKelas } = await supabase
      .from("riwayat_kelas")
      .select(`
        kelas:kelas_id (
          nama_kelas,
          tingkat
        )
      `)
      .eq("siswa_id", siswaId)
      .eq("tahun_ajaran", tahunAjaran)
      .single()

    // Get student's grades
    const { data: nilaiUjian } = await supabase
      .from("nilaiujians")
      .select(`
        nilai,
        jenis_ujian,
        matapelajarans:mata_pelajaran_id (
          nama_mata_pelajaran
        )
      `)
      .eq("siswa_id", siswaId)
      .eq("semester", Number.parseInt(semester))
      .eq("tahun_ajaran", tahunAjaran)

    // Process grades by subject
    const nilaiBySubject: { [key: string]: number[] } = {}

    nilaiUjian?.forEach((nilai) => {
      const mataPelajaran = nilai.matapelajarans?.nama_mata_pelajaran
      if (mataPelajaran) {
        if (!nilaiBySubject[mataPelajaran]) {
          nilaiBySubject[mataPelajaran] = []
        }
        nilaiBySubject[mataPelajaran].push(nilai.nilai)
      }
    })

    // Calculate average grades
    const nilaiRaport = Object.entries(nilaiBySubject).map(([mataPelajaran, nilaiArray]) => {
      const rataRata = nilaiArray.reduce((sum, nilai) => sum + nilai, 0) / nilaiArray.length
      return {
        mata_pelajaran: mataPelajaran,
        nilai: Math.round(rataRata),
        predikat: DocxService.getNilaiPredikat(rataRata),
      }
    })

    // Prepare template data
    const templateData = {
      nama_siswa: siswa.nama,
      nis: siswa.nis || "-",
      kelas: riwayatKelas?.kelas?.nama_kelas || "-",
      semester: semester,
      tahun_ajaran: tahunAjaran,
      nilai: nilaiRaport,
    }

    // Generate document
    const templateBuffer = DocxService.createRaportTemplate()
    const documentBuffer = await DocxService.generateReport(templateBuffer, templateData)

    return new NextResponse(documentBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="raport_${siswa.nama}_${semester}_${tahunAjaran.replace("/", "-")}.docx"`,
      },
    })
  } catch (error) {
    console.error("Error generating raport:", error)
    return NextResponse.json({ error: "Failed to generate raport" }, { status: 500 })
  }
}
