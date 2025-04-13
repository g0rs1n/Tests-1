"use client"

import styles from './page.module.scss'
import { useParams } from 'next/navigation'

export default function TabsPage () {

    const params = useParams()
    const {slug} = params

    return (
        <>
            <div className={styles.wrapper}>
                <p>
                    Tabs {slug}
                </p>
            </div>
        </>
    )
}