'use client';
import Loader from "@/components/Loading/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CircleEllipsis } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";


const getUser = async (url: string) => {
  const token = localStorage.getItem('token')
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`
    }
  })
  const data = await res.json()
  return data
}



export default function Home() {
  const router = useRouter()

  const userDetails = useSWR(`${process.env.NEXT_PUBLIC_BE_URL}/user`, getUser)
  const avatarList = useSWR(`${process.env.NEXT_PUBLIC_BE_URL}/user/avatarList`, getUser)
 
  const [displayName,setDisplayName] = useState('')
  const  [changedisplayName,setChangeDisplayName] = useState(false)
  const [pic,setPic] = useState('')
  const  [changepic,setChangePic] = useState(false)
  const  [useMe,setUseMe] = useState(false)
  const [loadingDN, setLoadingDN] = useState(false)
  const [loadingPic, setLoadingPic] = useState(false)

  const syncPictures = async (userId: string, pic:string) => {
    setLoadingPic(true)
    console.log("userId",userId,"pic",pic)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BE_URL}/user/updateNameNPic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          { "userId": userId,
             "pic": pic 
          }
          )
      });
      if (res.ok) {
        const data = await res.text();
        setLoadingPic(false)
        setPic(pic)
        setUseMe(false)
        setChangePic(false)
        userDetails.mutate()
      } else {
        console.error('Error syncing pictures');
        setLoadingPic(false)
      }
    } catch (error) {
      console.error('Error syncing pictures:', error);
      setLoadingPic(false)
    }
  }

  const checkDisplayName = async (userId:string) => {
    setLoadingDN(true)
    console.log("userId",displayName)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BE_URL}/checkDisplayName?displayName=${displayName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        if(data.userNameExist) {
          setLoadingDN(false)
          alert(`Display ${displayName} name exists. Try some other`)
        }
        else {
          const responseData = await fetch(`${process.env.NEXT_PUBLIC_BE_URL}/user/updateNameNPic`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(
              { "userId": userId,
                 "displayName": displayName 
              }
              )
          });
          if (responseData.ok) {
            const data = await responseData.text();
            setLoadingDN(false)
            setChangeDisplayName(false)
            userDetails.mutate()
          } else {
            setLoadingDN(false)
            console.error('Error setting display name');
          }
        }
      } else {
        setLoadingDN(false)
        console.error('Error setting display name');
      }
    } catch (error) {
      setLoadingDN(false)
      console.error('Error setting display name', error);
    }
  }
  
  try {
    const ISSERVER = typeof window === "undefined";
    if (!ISSERVER) {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/auth/login")
      }
    }
    console.log(userDetails.data)
    console.log(avatarList.data)
    
    return (
      userDetails.isLoading ? <Loader /> :
        userDetails.error ? <div>Failed to load {JSON.stringify(userDetails.error)}</div> :
          userDetails.data &&
          <main className="p-8">
            <div className="flex flex-col items-center justify-center gap-8">
              <div className="flex items-center justify-center gap-8">
                <p className="text-sm text-muted-foreground">Display Name</p>
                {
                  changedisplayName ? 
                  <Input
                                id="displayName"
                                name="displayName"
                                required
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                            />
                  :
                  <p>{userDetails.data.displayName}</p>
                }
                {
                  changedisplayName ? 
                  <>
                 
                    <Button className="" onClick={() => checkDisplayName(userDetails.data.memberId)}>
                    {loadingDN?<CircleEllipsis/>:"Submit"}
                      </Button>
                 
                  
                  <Button className="" onClick={() => setChangeDisplayName(false)}>Cancel</Button>
                  </>
                
                  :
                  <Button className="" onClick={() => {setDisplayName(userDetails.data.displayName);setChangeDisplayName(true)}}>Change Me</Button>
                }
                
              </div>
              <div className="flex items-center justify-center gap-8">
                <p className="text-sm text-muted-foreground">Display Picture</p>
                <img src={userDetails.data.pic} alt="" className="h-20 w-20" />
                  <Button className="" onClick={() => {setPic(userDetails.data.pic);setChangePic(true)}}>Change Me</Button>
                  {
                    changepic?
                    <Button className="" onClick={() => {setUseMe(false);setChangePic(false)}}>Cancel</Button>
                    :null
                  }
                 
              </div>
              {
                  changepic ? 
                  <div className="bg-muted p-8">
                  <h1 className="text-center font-semibold"> Scroll me</h1>
                  <div className="flex flex-wrap items-center justify-center gap-4  m-4 w-2/3 h-80 mx-auto overflow-y-auto">
                    {
                      avatarList.data.map((avatar:string, index:number) => (
                        <div className={pic===avatar?"bg-muted p-4 border m-4":"p-4 border"} key={index}>
                        <img src={avatar} alt="" className={pic===avatar?"w-40 h-40 mb-2": "w-20 h-20 mb-2"}/>
                        <div className="flex flex-col items-center justify-center gap-2">
                        <Button onClick={() => {setPic(avatar);setUseMe(true)}}>use Me</Button>
                       
                        {
                          useMe && pic===avatar?
                          <Button onClick={() => syncPictures(userDetails.data.memberId,avatar)}>
                            {loadingPic?<CircleEllipsis/>:"Submit"}
                            </Button>: null
                        }
                        </div>
                        </div>
                      ))
                    }

                  </div>
                  </div>
                  : null
              }
            </div>
          </main>

    );
  } catch (e: any) {
    return (
      <div>
        <Loader />
      </div>
    )
  }

}
