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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Download, FileSpreadsheet } from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"

interface ExcelImportDialogProps {
  type: "siswa" | "guru" | "kelas"
  onImportSuccess?: () => void
}

export function ExcelImportDialog({ type, onImportSuccess }: ExcelImportDialogProps) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const { toast } = useToast()

  const handleDownloadTemplate = async () => {
    setDownloading(true)
    try {
      const response = await fetch(`/api/excel/template/${type}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `template_${type}_${new Date().toISOString().split("T")[0]}.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Template berhasil diunduh",
          description: "Silakan isi template dan upload kembali",
        })
      } else {
        throw new Error("Failed to download template")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengunduh template",
        variant: "destructive",
      })
    } finally {
      setDownloading(false)
    }
  }

  const handleImport = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Pilih file Excel terlebih dahulu",
        variant: "destructive",
      })
      return
    }

    setImporting(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`/api/excel/import/${type}`, {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Import berhasil",
          description: `${result.imported} data berhasil diimport`,
        })
        setOpen(false)
        setFile(null)
        onImportSuccess?.()
      } else {
        toast({
          title: "Import gagal",
          description: result.details || result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat import data",
        variant: "destructive",
      })
    } finally {
      setImporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Import Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Data {type.charAt(0).toUpperCase() + type.slice(1)}</DialogTitle>
          <DialogDescription>Upload file Excel untuk mengimport data {type} secara massal</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>1. Download Template Excel</Label>
            <Button
              variant="outline"
              onClick={handleDownloadTemplate}
              disabled={downloading}
              className="w-full bg-transparent"
            >
              <Download className="mr-2 h-4 w-4" />
              {downloading ? "Mengunduh..." : "Download Template"}
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excel-file">2. Upload File Excel</Label>
            <Input
              id="excel-file"
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file && (
              <div className="flex items-center text-sm text-muted-foreground">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                {file.name}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button onClick={handleImport} disabled={!file || importing}>
            {importing ? "Mengimport..." : "Import Data"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
