import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { ExcelService } from "@/lib/excel/excel-service"
import { siswaTemplateColumns, guruTemplateColumns, kelasTemplateColumns } from "@/lib/excel/templates"

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

    let tableName: string
    let columns: any[]
    let fileName: string

    switch (type) {
      case "siswa":
        tableName = "siswas"
        columns = siswaTemplateColumns
        fileName = "data_siswa"
        break
      case "guru":
        tableName = "gurus"
        columns = guruTemplateColumns
        fileName = "data_guru"
        break
      case "kelas":
        tableName = "kelas"
        columns = kelasTemplateColumns
        fileName = "data_kelas"
        break
      default:
        return NextResponse.json({ error: "Export type not supported" }, { status: 400 })
    }

    // Fetch data from database
    const { data, error } = await supabase.from(tableName).select("*").order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform data for Excel export
    const transformedData = data.map((item) => {
      const transformed: any = {}

      switch (type) {
        case "siswa":
          transformed.nis = item.nis
          transformed.nama = item.nama
          transformed.jenis_kelamin = item.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"
          transformed.tempat_lahir = item.tempat_lahir
          transformed.tanggal_lahir = item.tanggal_lahir
          transformed.alamat = item.alamat
          transformed.no_telepon = item.no_telepon
          transformed.email = item.email
          transformed.nama_wali = item.nama_wali
          transformed.no_telepon_wali = item.no_telepon_wali
          transformed.status = item.status
          transformed.tanggal_masuk = item.tanggal_masuk
          break
        case "guru":
          transformed.nip = item.nip
          transformed.nama = item.nama
          transformed.jenis_kelamin = item.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"
          transformed.tempat_lahir = item.tempat_lahir
          transformed.tanggal_lahir = item.tanggal_lahir
          transformed.alamat = item.alamat
          transformed.no_telepon = item.no_telepon
          transformed.email = item.email
          transformed.mata_pelajaran = item.mata_pelajaran
          break
        case "kelas":
          transformed.nama_kelas = item.nama_kelas
          transformed.tingkat = item.tingkat
          transformed.tahun_ajaran = item.tahun_ajaran
          transformed.kapasitas = item.kapasitas
          break
      }

      return transformed
    })

    const buffer = await ExcelService.exportToExcel(
      transformedData,
      columns,
      `Data ${type.charAt(0).toUpperCase() + type.slice(1)}`,
    )

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${fileName}_${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
