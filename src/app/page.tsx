import styles from "./page.module.scss";
import Tabs from "@/components/Tabs/Tabs";

export default function Home() {
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.wrapper_tabs}>
          <Tabs/>
        </div>
        <div className={styles.wrapper_main}>
          Main
        </div>
      </div>
    </>
  );
}
