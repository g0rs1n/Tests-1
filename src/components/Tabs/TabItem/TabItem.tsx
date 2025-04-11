
import { useEffect, useState } from "react"
import { ITabsInitial} from "@/utils/types"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Image from "next/image"
import styles from '../page.module.scss'

interface ITabItemProps {
    tab: ITabsInitial;
    handleDeleteButton: (tab: ITabsInitial) => void;
}

export default function TabItem (props:ITabItemProps) {

    const {tab, handleDeleteButton} = props
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
    },[])

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

    if (!isLoading) return null

    return (
        <>
            <div 
                ref={setNodeRef}
                style={style}
                className={styles.wrapperItemTab}
                {...attributes}
                {...listeners}
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
                    onClick={() => handleDeleteButton(tab)}
                />
            </div>
        </>
    )
}