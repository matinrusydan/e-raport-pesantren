import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/auth/login")
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Pesantren</h1>
          <p className="text-muted-foreground">Selamat datang, {profile?.full_name || data.user.email}</p>
        </div>
        <form action={handleSignOut}>
          <Button variant="outline" type="submit">
            Keluar
          </Button>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Data Siswa</CardTitle>
            <CardDescription>Kelola data siswa pesantren</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/dashboard/siswa">Kelola Siswa</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Guru</CardTitle>
            <CardDescription>Kelola data guru dan staff</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/dashboard/guru">Kelola Guru</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nilai & Raport</CardTitle>
            <CardDescription>Kelola nilai dan cetak raport</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Kelola Nilai</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kehadiran</CardTitle>
            <CardDescription>Monitor kehadiran siswa</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Kelola Kehadiran</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kamar & Asrama</CardTitle>
            <CardDescription>Kelola penempatan kamar siswa</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Kelola Kamar</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Laporan</CardTitle>
            <CardDescription>Generate laporan dan statistik</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Lihat Laporan</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
