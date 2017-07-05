import { StorageItem } from './local-storage';
import {EnabledFeature} from './enabled-features';
import { Guid } from "app/shared/Utilities/Guid";

export interface StorageItem{
    id : string;
}

export interface StoredSubscriptions extends StorageItem{
    subscriptions : string[];
}

export interface QuickstartSettings extends StorageItem{
    disabled : boolean;
}

export interface TabSettings extends StorageItem{
    dynamicTabId : string;
} 
export interface TabMessage extends StorageItem{
    id: string;
    verb: string;
    data: any;
}
