"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TStorageTabs } from '@/utils/types'

export default function Home() {

  const router = useRouter()

  useEffect(() => {
    const storageTabs = localStorage.getItem("tabs")

    if (storageTabs) {
      const parsedTabs: TStorageTabs[] = JSON.parse(storageTabs)
      const initialTabUrl = parsedTabs?.[0]?.url
      initialTabUrl ? router.push(`/${initialTabUrl}`) : router.push('/')
    }
  },[])

  return null

}
