

export interface ITabsInitial {
    id: string;
    title: string;
    url: string;
}

export type TStorageTabs = {
    id: string;
    url: string;
    pinned: boolean;
    lastActive: boolean;
}