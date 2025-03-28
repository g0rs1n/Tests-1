import { GetServerSideProps } from "next";
import styles from "./page.module.scss";
import { ITab } from "@/utils/types";
import Tabs from "@/components/Tabs/Tabs";

type THomePageProps = ITab[]

export const fetchTabs = async () => {
  const initialTabs: ITab[] = [
    {id: "1", title: "Dashboard", url: "/dashboard", isPinned: false},
    {id: "2", title: "Banking", url: "/banking", isPinned: false},
    {id: "3", title: "Administration", url: "/administration", isPinned: false},
    {id: "4", title: "Accounting", url: "/accounting", isPinned: false},
  ]
  return initialTabs
}

export default async function Home() {

  const initialTabs = await fetchTabs()

  return (
    <div className={styles.wrapper}>
      <Tabs/>
      <div className={styles.container_main}></div>
    </div>
  );
}
