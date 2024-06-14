'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";


const listTournaments = async (url: string) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })
  const data = await res.json()
  return data
}

const syncPictures = async (tournamentId: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BE_URL}/user/syncPic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tournamentId }) 
    });
    if (res.ok) {
      const data = await res.json();
      console.log(`Sync successful. ${data.count} pictures updated.`);
    } else {
      console.error('Error syncing pictures');
    }
  } catch (error) {
    console.error('Error syncing pictures:', error);
  } 
};

export default function Home() {
  const tournaments = useSWR(`${process.env.NEXT_PUBLIC_BE_URL}/tournament/tournamentList`, listTournaments)
  const router = useRouter()
  try {
    const ISSERVER = typeof window === "undefined";
    if (!ISSERVER){
      const token = localStorage.getItem("token")
      if(!token) {
        router.push("/auth/login")
      }
      else {
        router.push("/home")
      }
    }
    
    
    return (
      tournaments.error ? <div>Failed to load {JSON.stringify(tournaments.error)}</div> :
        tournaments.data &&
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <h1 className="text-6xl font-bold ">
            SYTM Admin Panel
          </h1>
          <section className="flex items-center gap-10">
            {
              tournaments.data && tournaments.data.map((tournament: any, index: number) => {
                return (
                  <Card key={index} className="border bg-muted text-muted-foreground h-48 w-80 flex flex-col items-center justify-center">
                    <CardHeader className="text-4xl">{tournament.tournamentName}</CardHeader>
                    <CardContent>
                      {/*<Image src={tournament.tournamentLogo} alt={""} width={500} height={500} />*/}
                      <Link href={`/admin/${tournament.tournamentId}`}>
                        <Button>Get Started</Button>
                      </Link>
                      <Button onClick={() => syncPictures(tournament.tournamentId)}> Sync Pictures </Button>
                    </CardContent>
                  </Card>
                )
              })
            }
          </section>
          <section className="flex items-center gap-10">
            <Card className="border bg-muted text-muted-foreground h-48 w-80 flex flex-col items-center justify-center">
              <CardHeader className="text-4xl">Member Zone</CardHeader>
              <CardContent>
                <Button onClick={() => router.push('/admin/user')}>Verify Members</Button>
              </CardContent>
            </Card>
          </section>
          <section className="flex items-center gap-10">
          <Card className="border bg-muted text-muted-foreground h-48 w-80 flex flex-col items-center justify-center">
              <CardHeader className="text-4xl">SYTM Bank</CardHeader>
              <CardContent>
                <Button  onClick={() => router.push('/admin/bank')}>View Accounts</Button>
              </CardContent>
            </Card>
          </section>
        </main> 
        
    );
  } catch (e: any) {
    return (
      <div>
        {e.toString()}
      </div>
    )
  }

}
