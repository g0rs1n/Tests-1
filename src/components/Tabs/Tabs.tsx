"use client"

import styles from './page.module.scss'
import { useState, useEffect, useRef } from 'react'
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
import { ITabsInitial, TStorageTabs, IPinnedTabsInitial } from '@/utils/types'
import TabItem from './TabItem/TabItem'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'

type Ttabs = IPinnedTabsInitial[]

export default function Tabs () {

    const [tabs, setTabs] = useState<Ttabs>([])
    const [activeMenuTabId, setActiveMenuTabId] = useState<string | null>(null)
    const pinMenuRef = useRef<Record<string, HTMLDivElement | null>>({})
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const storageTabs = localStorage.getItem("tabs")
        if (storageTabs) {
            const savedTabs:TStorageTabs[] = JSON.parse(storageTabs)
            const combinedTabs = savedTabs.map(({id, isPinned}) => {
                const base = tabsInitial.find(t => t.id === id)
                return base ? {...base,isPinned} : null
            })
            .filter((tab): tab is IPinnedTabsInitial => tab !== null)
            const pinnedTabs = combinedTabs.filter(t => t?.isPinned)
            const unpinnedTabs = combinedTabs.filter(t => !t?.isPinned)
            setTabs([...pinnedTabs, ...unpinnedTabs])
        }
        if (!storageTabs) {
            const initialTabs = tabsInitial.map(tab => ({...tab, isPinned: false}))  
            localStorage
                .setItem("tabs", JSON.stringify(initialTabs))
            setTabs(initialTabs)
        }
    },[])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (activeMenuTabId && pinMenuRef.current[activeMenuTabId]){
                const pinRef = pinMenuRef.current[activeMenuTabId]
                if (pinRef && !pinRef.contains(e.target as Node)){
                    setActiveMenuTabId(null)
                }
            }
        }
        document.addEventListener("click", handleClickOutside)
        return () => document.removeEventListener("click", handleClickOutside)
    },[activeMenuTabId])

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event
        if (active.id !== over?.id) {
            setTabs((tabs) => {
                const oldIndex = tabs.findIndex((tab) => tab.id === active.id)
                const newIndex = tabs.findIndex((tab) => tab.id === over?.id)
                const newTabs = arrayMove(tabs, oldIndex, newIndex)
                localStorage.setItem("tabs", JSON.stringify(newTabs))
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
                router.push(`/${currentTab.url}`)
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
                            tabs?.map((tab) => (
                                <TabItem
                                    key={tab.id}
                                    tab={tab}
                                    tabs={tabs}
                                    setTabs={setTabs}
                                    redirectToTab={redirectToTab}
                                    tabMouseOnClick={tabMouseOnClick}
                                    isPinMenuVisible={activeMenuTabId === tab.id}
                                    setPinMenuRef={(ref) => {pinMenuRef.current[tab.id] = ref}}
                                />
                            ))
                        }  
                    </SortableContext>
                </DndContext>
            </div>
        </>
    )
}