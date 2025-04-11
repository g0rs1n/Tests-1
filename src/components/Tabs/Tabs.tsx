"use client"

import styles from './page.module.scss'
import { useState, useEffect } from 'react'
import { 
    DndContext, 
    DragEndEvent, 
    PointerSensor, 
    useSensor, 
    useSensors 
} from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import { tabsInitial } from '@/db/db'
import { ITabsInitial } from '@/utils/types'
import TabItem from './TabItem/TabItem'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'

type Ttabs = ITabsInitial[]

export default function Tabs () {

    const [pinned, setPinned] = useState<Ttabs>([])
    const [tabs, setTabs] = useState<Ttabs>(tabsInitial)

    useEffect(() => {
        const savedTabs = localStorage.getItem("tabs")
        if (savedTabs) {
            const savedIds = JSON.parse(savedTabs)
            const sortedTabs = tabsInitial
                .filter(tab => savedIds.includes(tab.id))
                .sort((a,b) => savedIds.indexOf(a.id) - savedIds.indexOf(b.id))
            setTabs(sortedTabs)
        }
        if (!savedTabs) {
            localStorage.setItem("tabs", JSON.stringify(tabsInitial.map(tab => tab.id)))
        }
    },[])

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event
        if (active.id !== over?.id) {
            setTabs((tabs) => {
                const oldIndex = tabs.findIndex((tab) => tab.id === active.id)
                const newIndex = tabs.findIndex((tab) => tab.id === over?.id)
                const newTabs = arrayMove(tabs, oldIndex, newIndex)
                localStorage.setItem("tabs", JSON.stringify(newTabs.map(tab => tab.id)))
                return newTabs
            })
        }
    }

    const handleDeleteButton = (tab: ITabsInitial) => {
        setTabs(tabs => {
            const newTabs = tabs.filter(item => item.id !== tab.id)
            localStorage.setItem("tabs", JSON.stringify(newTabs.map(tab => tab.id)))
            return newTabs
        })
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
                                    handleDeleteButton={handleDeleteButton}
                                />
                            ))
                        }  
                    </SortableContext>
                </DndContext>
            </div>
        </>
    )
}