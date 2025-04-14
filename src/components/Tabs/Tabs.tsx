"use client"

import styles from './page.module.scss'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
    DndContext, 
    DragEndEvent, 
    PointerSensor, 
    useSensor, 
    useSensors 
} from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import { tabsInitial } from '@/db/db'
import { ITabsInitial, TStorageTabs } from '@/utils/types'
import TabItem from './TabItem/TabItem'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'

type Ttabs = ITabsInitial[]

export default function Tabs () {

    const [pinned, setPinned] = useState<Ttabs>([])
    const [tabs, setTabs] = useState<Ttabs>(tabsInitial)
    const [activeMenuTabId, setActiveMenuTabId] = useState<string | null>(null)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const storageTabs = localStorage.getItem("tabs")
        if (storageTabs) {
            const savedTabs:TStorageTabs[] = JSON.parse(storageTabs)
            const sortedTabs = savedTabs.map((tab) => {
                const baseTab = tabsInitial.find(item => item.id === tab.id)
                if (!baseTab) return null
                return {...baseTab}
            })
            .filter(Boolean) as Ttabs
            setTabs(sortedTabs)
        }
        if (!storageTabs) {   
            localStorage
                .setItem("tabs", JSON.stringify(tabsInitial.map(tab => ({
                    id: tab.id,
                    url: tab.url,
                    pinned: false,
                    lastActive: false,
                }))))
        }
    },[])

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event
        if (active.id !== over?.id) {
            setTabs((tabs) => {
                const oldIndex = tabs.findIndex((tab) => tab.id === active.id)
                const newIndex = tabs.findIndex((tab) => tab.id === over?.id)
                const newTabs = arrayMove(tabs, oldIndex, newIndex)

                const storageTabs = localStorage.getItem("tabs")
                let savedStateMap: Record<string, {pinned: boolean; lastActive: boolean}> = {}
                if (storageTabs) {
                    const parsedTabs: TStorageTabs[] = JSON.parse(storageTabs)
                    savedStateMap = parsedTabs.reduce((acc, tab) => {
                        acc[tab.id] = {
                            pinned: tab.pinned,
                            lastActive: tab.lastActive,
                        }
                        return acc
                    }, {} as Record<string, {pinned: boolean; lastActive: boolean}>)
                }
                const updatedStorage = newTabs.map((tab) => ({
                    id: tab.id,
                    url: tab.url,
                    pinned: savedStateMap[tab.id]?.pinned ?? false,
                    lastActive: savedStateMap[tab.id]?.lastActive ?? false,
                }))
                localStorage.setItem("tabs", JSON.stringify(updatedStorage))
                return newTabs
            })
        }
    }

    const tabMouseOnClick = (e: React.MouseEvent, tab: ITabsInitial) => {
        e.preventDefault()
        if (e.button === 2) {
            setActiveMenuTabId(prev => prev === tab.id ? null : tab.id)
        } else if (e.button === 0) {
            redirectToTab(tab.url)
            setActiveMenuTabId(null)
        }
    }

    const redirectToTab = (url: string) => {
        const currentTab = tabs.find(tab => tab.url === url)
        if (currentTab) {
            if (pathname === `/${url}`){
                router.refresh()
            } else {
                const storageTabs = localStorage.getItem("tabs")
                if (storageTabs) {
                    const parsedTabs:TStorageTabs[] = JSON.parse(storageTabs)
                    const updatedTabs = parsedTabs
                        .map((tab) => ({
                            ...tab,
                            url: tabs.find(item => item.id === tab.id)?.url || '',
                            lastActive: tab.id === currentTab.id
                        }))
                    localStorage.setItem("tabs", JSON.stringify(updatedTabs))
                }
                router.push(`/${url}`)
            }
        }
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3,
            }
        })
    )

    return (
        <>
            <div className={styles.wrapper}>
                <DndContext 
                        sensors={sensors}
                        modifiers={[restrictToHorizontalAxis]} 
                        onDragEnd={handleDragEnd}>
                    <SortableContext
                        items={tabs.map((tab) => tab.id)}
                    >
                        {
                            tabs.map((tab) => (
                                <TabItem
                                    key={tab.id}
                                    tab={tab}
                                    tabs={tabs}
                                    setTabs={setTabs}
                                    redirectToTab={redirectToTab}
                                    tabMouseOnClick={tabMouseOnClick}
                                    isPinMenuVisible={activeMenuTabId === tab.id}
                                />
                            ))
                        }  
                    </SortableContext>
                </DndContext>
            </div>
        </>
    )
}