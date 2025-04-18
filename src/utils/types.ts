

export interface ITabsInitial {
    id: string;
    title: string;
    url: string;
}

export interface IPinnedTabsInitial extends ITabsInitial{
   isPinned: boolean;
}

export type TStorageTabs = {
    id: string;
    url: string;
    isPinned: boolean;
}