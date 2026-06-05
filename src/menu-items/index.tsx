// project import
import { icons } from './icons';
import { IFormKey } from 'types';
// ==============================|| MENU ITEMS ||============================== //


export interface ISideBarMenuItem {
  id: string;
  title?: string;
  type: 'item' | 'collapse' | 'group';
  url?: string;
  icon?: any;
  children?: ISideBarMenuItem[];
  breadcrumbs?: boolean;
  caption?: string;
}

const menuItems : ISideBarMenuItem = {
  id: 'root',
  type: 'group',
  children: [
    {
      id: IFormKey.HOME,
      title: IFormKey.HOME,
      type: 'item',
      url: `/${IFormKey.HOME}`,
      icon: icons.Home,
      breadcrumbs: false
    },
    {
      id: IFormKey.INVOICE,
      title: IFormKey.INVOICE,
      type: 'item',
      url: `/${IFormKey.INVOICE}`,
      icon: icons.Invoice,
      breadcrumbs: false
    },
  ]
};

export default menuItems;
