"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { FileText, Download } from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"

interface ReportGeneratorProps {
  type: "raport" | "student-profile" | "class-list"
  entityId: string
  entityName?: string
}

export function ReportGenerator({ type, entityId, entityName }: ReportGeneratorProps) {
  const [open, setOpen] = useState(false)
  const [semester, setSemester] = useState("1")
  const [tahunAjaran, setTahunAjaran] = useState("2024/2025")
  const [generating, setGenerating] = useState(false)
  const { toast } = useToast()

  const getReportTitle = () => {
    switch (type) {
      case "raport":
        return "Generate Raport"
      case "student-profile":
        return "Generate Profil Siswa"
      case "class-list":
        return "Generate Daftar Siswa"
      default:
        return "Generate Report"
    }
  }

  const getReportDescription = () => {
    switch (type) {
      case "raport":
        return "Generate raport siswa dalam format DOCX"
      case "student-profile":
        return "Generate profil lengkap siswa dalam format DOCX"
      case "class-list":
        return "Generate daftar siswa kelas dalam format DOCX"
      default:
        return "Generate laporan dalam format DOCX"
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      let url = ""
      const params = new URLSearchParams()

      if (type === "raport") {
        params.append("semester", semester)
        params.append("tahun_ajaran", tahunAjaran)
        url = `/api/reports/raport/${entityId}?${params.toString()}`
      } else if (type === "student-profile") {
        url = `/api/reports/student-profile/${entityId}`
      } else if (type === "class-list") {
        params.append("tahun_ajaran", tahunAjaran)
        url = `/api/reports/class-list/${entityId}?${params.toString()}`
      }

      const response = await fetch(url)

      if (response.ok) {
        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = downloadUrl

        // Get filename from response headers or create default
        const contentDisposition = response.headers.get("content-disposition")
        const filename =
          contentDisposition?.split("filename=")[1]?.replace(/"/g, "") ||
          `${type}_${entityName || entityId}_${Date.now()}.docx`

        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(downloadUrl)
        document.body.removeChild(a)

        toast({
          title: "Report berhasil dibuat",
          description: "File DOCX telah diunduh",
        })
        setOpen(false)
      } else {
        throw new Error("Failed to generate report")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal membuat report",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          {getReportTitle()}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getReportTitle()}</DialogTitle>
          <DialogDescription>{getReportDescription()}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {type === "raport" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="semester">Semester</Label>
                <Select value={semester} onValueChange={setSemester}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Semester 1</SelectItem>
                    <SelectItem value="2">Semester 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tahun_ajaran">Tahun Ajaran</Label>
                <Select value={tahunAjaran} onValueChange={setTahunAjaran}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tahun ajaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024/2025">2024/2025</SelectItem>
                    <SelectItem value="2023/2024">2023/2024</SelectItem>
                    <SelectItem value="2022/2023">2022/2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {type === "class-list" && (
            <div className="grid gap-2">
              <Label htmlFor="tahun_ajaran">Tahun Ajaran</Label>
              <Select value={tahunAjaran} onValueChange={setTahunAjaran}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tahun ajaran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024/2025">2024/2025</SelectItem>
                  <SelectItem value="2023/2024">2023/2024</SelectItem>
                  <SelectItem value="2022/2023">2022/2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button onClick={handleGenerate} disabled={generating}>
            <Download className="mr-2 h-4 w-4" />
            {generating ? "Generating..." : "Generate & Download"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
