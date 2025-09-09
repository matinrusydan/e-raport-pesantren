import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { DocxService } from "@/lib/docx/docx-service"

export async function GET(request: NextRequest, { params }: { params: Promise<{ kelasId: string }> }) {
  try {
    const { kelasId } = await params
    const { searchParams } = new URL(request.url)
    const tahunAjaran = searchParams.get("tahun_ajaran") || "2024/2025"

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get class data
    const { data: kelas, error: kelasError } = await supabase.from("kelas").select("*").eq("id", kelasId).single()

    if (kelasError || !kelas) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    // Get students in this class
    const { data: riwayatKelas } = await supabase
      .from("riwayat_kelas")
      .select(`
        siswas:siswa_id (
          nis,
          nama,
          jenis_kelamin,
          tempat_lahir,
          tanggal_lahir,
          status
        )
      `)
      .eq("kelas_id", kelasId)
      .eq("tahun_ajaran", tahunAjaran)

    const siswaList =
      riwayatKelas?.map((rk, index) => ({
        no: index + 1,
        nis: rk.siswas?.nis || "-",
        nama: rk.siswas?.nama || "",
        jenis_kelamin: rk.siswas?.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan",
        tempat_lahir: rk.siswas?.tempat_lahir || "-",
        tanggal_lahir: rk.siswas?.tanggal_lahir ? new Date(rk.siswas.tanggal_lahir).toLocaleDateString("id-ID") : "-",
        status: rk.siswas?.status || "aktif",
      })) || []

    // Create class list template
    const templateContent = `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="28"/>
        </w:rPr>
        <w:t>DAFTAR SISWA KELAS {nama_kelas}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
      </w:pPr>
      <w:r>
        <w:t>Tahun Ajaran: {tahun_ajaran}</w:t>
      </w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:tbl>
      <w:tblPr>
        <w:tblW w:w="0" w:type="auto"/>
        <w:tblBorders>
          <w:top w:val="single" w:sz="4" w:space="0" w:color="000000"/>
          <w:left w:val="single" w:sz="4" w:space="0" w:color="000000"/>
          <w:bottom w:val="single" w:sz="4" w:space="0" w:color="000000"/>
          <w:right w:val="single" w:sz="4" w:space="0" w:color="000000"/>
          <w:insideH w:val="single" w:sz="4" w:space="0" w:color="000000"/>
          <w:insideV w:val="single" w:sz="4" w:space="0" w:color="000000"/>
        </w:tblBorders>
      </w:tblPr>
      <w:tr>
        <w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>No</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>NIS</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Nama</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Jenis Kelamin</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Status</w:t></w:r></w:p></w:tc>
      </w:tr>
      {#siswa_list}
      <w:tr>
        <w:tc><w:p><w:r><w:t>{no}</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>{nis}</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>{nama}</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>{jenis_kelamin}</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>{status}</w:t></w:r></w:p></w:tc>
      </w:tr>
      {/siswa_list}
    </w:tbl>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p><w:r><w:t>Total Siswa: {total_siswa}</w:t></w:r></w:p>
  </w:body>
</w:document>`

    const zip = new (await import("pizzip")).default()
    zip.file("word/document.xml", templateContent)
    zip.file(
      "[Content_Types].xml",
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`,
    )
    zip.file(
      "_rels/.rels",
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`,
    )

    const templateBuffer = zip.generate({ type: "nodebuffer" })

    // Prepare template data
    const templateData = {
      nama_kelas: kelas.nama_kelas,
      tahun_ajaran: tahunAjaran,
      siswa_list: siswaList,
      total_siswa: siswaList.length,
    }

    // Generate document
    const documentBuffer = await DocxService.generateReport(templateBuffer, templateData)

    return new NextResponse(documentBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="daftar_siswa_${kelas.nama_kelas.replace(/\s+/g, "_")}_${tahunAjaran.replace("/", "-")}.docx"`,
      },
    })
  } catch (error) {
    console.error("Error generating class list:", error)
    return NextResponse.json({ error: "Failed to generate class list" }, { status: 500 })
  }
}
