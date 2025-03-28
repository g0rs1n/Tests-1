'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import styles from './index.module.scss'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ITab } from '@/utils/types'

const initialTabs: ITab[] = [
    {id: "1", title: "Dashboard", url: "/dashboard", isPinned: false},
    {id: "2", title: "Banking", url: "banking", isPinned: false},
    {id: "3", title: "Administration", url: "/administration", isPinned: false},
    {id: "4", title: "Accounting", url: "/accounting", isPinned: false},
    {id: "5", title: "Accounting", url: "/accounting", isPinned: false},
    {id: "6", title: "Accounting", url: "/accounting", isPinned: false},
    {id: "7", title: "Accounting", url: "/accounting", isPinned: false},
    {id: "8", title: "Accounting", url: "/accounting", isPinned: false},
    {id: "9", title: "Accounting", url: "/accounting", isPinned: false},
    {id: "10", title: "Accounting", url: "/accounting", isPinned: false},
]

export default function Tabs () {
    const loadTabsFromStorage = () => {
        const savedTabs = localStorage.getItem('tabs');
        return savedTabs ? JSON.parse(savedTabs) : initialTabs;
    };

    const [tabs, setTabs] = useState<ITab[]>(loadTabsFromStorage())
    const [activeTab, setActiveTab] = useState(tabs[0])
    const [isDelete, setIsDelete] = useState(false)
    const [isPin, setIsPin] = useState(false)

    const handleDeleteIcon = () => {
        if (isPin) setIsPin(false)
        setIsDelete(!isDelete)
    }

    const handleSetPin = () => {
        if (isDelete) setIsDelete(false)
        setIsPin(!isPin)
    }

    useEffect(() => {
        localStorage.setItem('tabs', JSON.stringify(tabs));
    }, [tabs]); 

    const handlePinTab = (tab: ITab) => {
        setTabs(prevTabs => {
            const updatedTabs = prevTabs.map(t => 
                t.id === tab.id ? { ...t, isPinned: !t.isPinned } : t
            );
    
            const pinnedTabs = updatedTabs.filter(t => t.isPinned);
            const unpinnedTabs = updatedTabs.filter(t => !t.isPinned);
    
            return [...pinnedTabs, ...unpinnedTabs];
        });
    };

    const handleDeleteTab = (tab: ITab) => {
        setTabs(prevTabs => prevTabs.filter(t => t.id !== tab.id));
    };

    const handleTabClick = (tab: ITab) => {
        console.log(tab)
        setActiveTab(tab);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event

        if (active.id !== over?.id) {
            const oldIndex = tabs.findIndex((tab) => tab.id === active.id);
            const newIndex = tabs.findIndex((tab) => tab.id === over?.id);
      
            const updatedTabs = arrayMove(tabs, oldIndex, newIndex);
            setTabs(updatedTabs);
        }
    }

    return (
        <>
            <div className={styles.wrapper}>
                <DndContext onDragEnd={handleDragEnd}>
                    <div className={styles.tabs_wrapper}>
                        <SortableContext items={tabs.map(tab => tab.id)}>
                            {
                                tabs.map((tab) => (
                                    <TabsItem
                                        key={tab.id}
                                        tab={tab}
                                        onClick={handleTabClick}
                                        isActive={activeTab.id === tab.id}
                                        handleDeleteTab={handleDeleteTab}
                                        handlePinTab={handlePinTab}
                                        isDelete={isDelete}
                                        isPin={isPin}
                                    />
                                ))
                            }
                        </SortableContext>
                    </div>
                </DndContext>
                <div className={styles.edit}>
                    <Image 
                        onClick={handleDeleteIcon} 
                        className={styles.deleteItem} 
                        src='/delete.png' 
                        alt='delete' 
                        width={35} 
                        height={35}
                    />
                    <Image 
                        onClick={handleSetPin} 
                        className={styles.pinItem} 
                        src='/pin.png' 
                        alt='pin' 
                        width={35} 
                        height={35}
                    />
                </div>
            </div>
        </>
    )
}

interface ITabsItemProps {
    handlePinTab: (tab: ITab) => void;
    isPin: boolean;
    isDelete: boolean;
    tab: ITab; 
    onClick: (tab: ITab) => void; 
    isActive: boolean; 
    handleDeleteTab: (tab: ITab) => void;
}

function TabsItem ({tab, isPin, handlePinTab, onClick, isActive, handleDeleteTab,isDelete}:ITabsItemProps ) {

    const {
        setNodeRef, 
        transform, 
        transition, 
        attributes, 
        listeners 
    } = useSortable({
        id: tab.id, 
    });

    const handleClick = () => {
        console.log(tab)
        if (isDelete) return
        onClick(tab);
    };

    return (
        <>
            <div 
                {...attributes} 
                style={{
                    transform: CSS.Transform.toString(transform),
                    transition,
                }} 
                {...listeners} 
                className={styles.tabitem}
                ref={setNodeRef} 
                onClick={handleClick}
            >
                <p>
                    {tab.title}
                </p>
                {
                    isDelete ?
                    <div>
                        <Image 
                            className={styles.deleteIcon} 
                            onClick={() => handleDeleteTab(tab)} 
                            src='/remove.png' 
                            alt='remove' 
                            width={20} 
                            height={20}
                        /> 
                    </div> : null
                }
                {
                    isPin ?
                    <div>
                        <Image 
                            onClick={() => handlePinTab(tab)} 
                            className={styles.deleteIcon} 
                            src='/pin.png' 
                            alt='pin' 
                            width={20} 
                            height={20}
                        /> 
                    </div> : null
                }
            </div>
        </>
    )
}