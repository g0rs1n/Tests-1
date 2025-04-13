
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { ITabsInitial} from "@/utils/types"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Image from "next/image"
import styles from '../page.module.scss'

interface ITabItemProps {
    tab: ITabsInitial;
    tabs: ITabsInitial[];
    redirectToTab: (url: string) => void;
    setTabs: TSetTabs;
}

type TSetTabs = (setTabs: ((tabs: ITabsInitial[]) => ITabsInitial[])) => void;

export default function TabItem (props:ITabItemProps) {

    const {tab, tabs, setTabs, redirectToTab} = props
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
            const parsedTabsIds: string[] = JSON.parse(tabsIds)
            const currentTabIndex = parsedTabsIds.findIndex(id => id === tab.id)
            const prevTabId = parsedTabsIds[currentTabIndex - 1] 
                || parsedTabsIds[currentTabIndex + 1]
            const newTab = tabs.find(tab => tab.id === prevTabId)?.url
            setTabs(tabs => {
                const newTabs = tabs.filter(item => item.id !== tab.id)
                localStorage
                    .setItem("tabs", JSON.stringify(newTabs.map(tab => tab.id)))
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
                onClick={() => redirectToTab(tab.url)}
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
            </div>
        </>
    )
}