import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { ExcelService } from "@/lib/excel/excel-service"

export async function POST(request: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  try {
    const { type } = await params
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    let expectedColumns: string[]
    let tableName: string

    switch (type) {
      case "siswa":
        expectedColumns = ["NIS", "Nama Lengkap", "Jenis Kelamin", "Status"]
        tableName = "siswas"
        break
      case "guru":
        expectedColumns = ["NIP", "Nama Lengkap", "Jenis Kelamin"]
        tableName = "gurus"
        break
      case "kelas":
        expectedColumns = ["Nama Kelas", "Tingkat", "Tahun Ajaran", "Kapasitas"]
        tableName = "kelas"
        break
      default:
        return NextResponse.json({ error: "Import type not supported" }, { status: 400 })
    }

    // Parse Excel file
    const data = await ExcelService.parseExcelFile(buffer, expectedColumns)

    if (data.length === 0) {
      return NextResponse.json({ error: "No data found in file" }, { status: 400 })
    }

    // Transform data to match database schema
    const transformedData = data.map((row) => {
      const transformed: any = {}

      switch (type) {
        case "siswa":
          transformed.nis = row["NIS"]
          transformed.nama = row["Nama Lengkap"]
          transformed.jenis_kelamin = row["Jenis Kelamin"]
          transformed.tempat_lahir = row["Tempat Lahir"]
          transformed.tanggal_lahir = row["Tanggal Lahir"]
          transformed.alamat = row["Alamat"]
          transformed.no_telepon = row["No. Telepon"]
          transformed.email = row["Email"]
          transformed.nama_wali = row["Nama Wali"]
          transformed.no_telepon_wali = row["No. Telepon Wali"]
          transformed.status = row["Status"] || "aktif"
          transformed.tanggal_masuk = row["Tanggal Masuk"] || new Date()
          break
        case "guru":
          transformed.nip = row["NIP"]
          transformed.nama = row["Nama Lengkap"]
          transformed.jenis_kelamin = row["Jenis Kelamin"]
          transformed.tempat_lahir = row["Tempat Lahir"]
          transformed.tanggal_lahir = row["Tanggal Lahir"]
          transformed.alamat = row["Alamat"]
          transformed.no_telepon = row["No. Telepon"]
          transformed.email = row["Email"]
          transformed.mata_pelajaran = row["Mata Pelajaran"]
          break
        case "kelas":
          transformed.nama_kelas = row["Nama Kelas"]
          transformed.tingkat = Number(row["Tingkat"])
          transformed.tahun_ajaran = row["Tahun Ajaran"]
          transformed.kapasitas = Number(row["Kapasitas"]) || 30
          break
      }

      return transformed
    })

    // Validate required fields
    const errors: string[] = []
    transformedData.forEach((item, index) => {
      if (type === "siswa" && (!item.nama || !item.jenis_kelamin)) {
        errors.push(`Baris ${index + 2}: Nama dan Jenis Kelamin wajib diisi`)
      }
      if (type === "guru" && (!item.nama || !item.jenis_kelamin)) {
        errors.push(`Baris ${index + 2}: Nama dan Jenis Kelamin wajib diisi`)
      }
      if (type === "kelas" && (!item.nama_kelas || !item.tingkat || !item.tahun_ajaran)) {
        errors.push(`Baris ${index + 2}: Nama Kelas, Tingkat, dan Tahun Ajaran wajib diisi`)
      }
    })

    if (errors.length > 0) {
      return NextResponse.json(
        {
          error: "Validation errors",
          details: errors,
        },
        { status: 400 },
      )
    }

    // Insert data to database
    const { data: insertedData, error: insertError } = await supabase.from(tableName).insert(transformedData).select()

    if (insertError) {
      return NextResponse.json(
        {
          error: "Database error",
          details: insertError.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      message: `Successfully imported ${insertedData.length} records`,
      imported: insertedData.length,
      data: insertedData,
    })
  } catch (error: any) {
    console.error("Import error:", error)
    return NextResponse.json(
      {
        error: "Import failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
