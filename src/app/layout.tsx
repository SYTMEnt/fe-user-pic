
import './globals.css'
import { Inter } from 'next/font/google';
import React from "react";
import { ThemeProvider } from "@/components/theme-provider"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ModeToggle from '@/components/themeButton/Theme';
import Header from '@/components/Navbar/Header';
const inter = Inter({weight:['100','200','300','400','500','600','700','800','900'], subsets: ['latin'] })
export const metadata = {
  title: 'Pred2Win Admin',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel='shortcut icon' href='/images/p2wlogo.png' />
        <meta property="og:image" content="/images/p2wlogo.png" />
        {/* <Script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="422761f5-05df-44a6-9a5b-07e63483f7bf" data-blockingmode="auto" type="text/javascript"></Script> */}
      </head>
      {/*  
      bg-gradient-to-r from-gray-800 via-gray-900 to-gray-950*/}
      {/* <body className={inter.className + "  flex flex-col min-h-screen relative  h-screen bg-gradient-to-r from-zinc-100 via-indigo-100 to-cyan-50 dark:from-zinc-950 dark:via-indigo-900 dark:to-zinc-900"}> */}
      <body className={inter.className + "  flex flex-col min-h-screen relative  h-screen "}>
      <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
        <div className="  max-w-[1600px] xl:mx-auto">
       <div className='sticky top-0 h-full'>
        <Header/>
        </div>
        </div>
        <div className='mt-20'>

          {children}
        </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
