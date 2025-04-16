
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { ITabsInitial, TStorageTabs} from "@/utils/types"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Image from "next/image"
import styles from '../page.module.scss'

interface ITabItemProps {
    tab: ITabsInitial;
    tabs: ITabsInitial[];
    redirectToTab: (url: string) => void;
    setTabs: TSetTabs;
    tabMouseOnClick: (e: React.MouseEvent, tab: ITabsInitial) => void;
    isPinMenuVisible: boolean;
}

type TSetTabs = (setTabs: ((tabs: ITabsInitial[]) => ITabsInitial[])) => void;

export default function TabItem (props:ITabItemProps) {

    const {
        tab, 
        tabs, 
        setTabs, 
        isPinMenuVisible, 
        tabMouseOnClick
    } = props
    const [isLoading, setIsLoading] = useState(false)
    const [isActiveTab, setIsActiveTab] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        setIsActiveTab(pathname === `/${tab.url}`)
        setIsLoading(true)
    },[pathname, tab.url])

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: tab.id
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        backgroundColor: isDragging ? "#3a3a3a" : "#f1efef",
        color: isDragging ? "#f1efef" : "#3a3a3a",
    };

    const handleDeleteButton = (tab: ITabsInitial) => {
        const tabsIds = localStorage.getItem("tabs")
        if (tabsIds) {
            const parsedTabsIds: TStorageTabs[] = JSON.parse(tabsIds)
            const currentTabIndex = parsedTabsIds.findIndex(t => t.id === tab.id)
            const prevTabId = parsedTabsIds[currentTabIndex - 1]?.id 
                || parsedTabsIds[currentTabIndex + 1]?.id
            const newTab = tabs.find(t => t.id === prevTabId)?.url
            setTabs(tabs => {
                const newTabs = tabs.filter(item => item.id !== tab.id)
                localStorage
                    .setItem("tabs", JSON.stringify(newTabs.map(tab => ({
                        id: tab.id,
                        url: tab.url,
                    }))))
                return newTabs
            })
            newTab ? router.push(`/${newTab}`) : router.push("/")
        }
    }

    if (!isLoading) return null

    return (
        <>
            <div 
                ref={setNodeRef}
                style={style}
                className={`${styles.wrapperItemTab} ${isActiveTab ? styles.activeTab : ''}`}
                {...attributes}
                {...listeners}
                onMouseDown={(e) => tabMouseOnClick(e,tab)}
                onContextMenu={(e) => e.preventDefault()}
            >
                <p className={styles.TabItemTitle}>
                        {tab.title}
                </p>
                <Image
                    className={styles.TabItemDeleteIcon}
                    src={'/remove.png'}
                    width={15}
                    height={15}
                    alt="remove"
                    onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteButton(tab)
                    }}
                />
                {
                    isPinMenuVisible && (
                        <div 
                            className={styles.PinnedMenu}
                        >
                            <Image
                                className={styles.PinnedMenuIcon}
                                src={'/pin.png'}
                                width={19}
                                height={19}
                                alt="pinned"
                            />
                            <p className={styles.PinnedMenuTitle}>
                                Pin {tab.title}
                            </p>
                        </div>
                    )
                }
            </div>
        </>
    )
}