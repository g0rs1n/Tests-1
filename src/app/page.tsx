"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TStorageTabs } from '@/utils/types'

export default function Home() {

  const router = useRouter()

  useEffect(() => {
    const storageTabs = localStorage.getItem("tabs")

    if (storageTabs) {
      const parsedTabs:TStorageTabs[] = JSON.parse(storageTabs)
      const lastActiveTab = parsedTabs.find(tab => tab.lastActive)

      if (lastActiveTab) {
        router.push(`/${lastActiveTab.url}`)
      } else {

        const firstTab = parsedTabs[0]
        if (firstTab) {
          firstTab.lastActive = true
          localStorage.setItem("tabs", JSON.stringify(parsedTabs))
          router.push(`/${firstTab.url}`)
        }

      }
    }
  },[router])

  return null

}
