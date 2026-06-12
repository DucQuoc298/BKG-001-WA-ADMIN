// project import
import { icons } from './icons';
import { IFormKey, MainNameRoutes } from 'types';
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
      url: MainNameRoutes.HOME,
      icon: icons.Home,
      breadcrumbs: false
    },
    {
      id: IFormKey.INVOICE,
      title: IFormKey.INVOICE,
      type: 'item',
      url: '/invoice',
      icon: icons.Invoice,
      breadcrumbs: false
    },
    {
      id: IFormKey.BILL,
      title: IFormKey.BILL,
      type: 'item',
      url: '/bill',
      icon: icons.Bill,
      breadcrumbs: false
    },
    {
      id: 'COMPONENTS',
      title: 'COMPONENTS',
      type: 'item',
      url: MainNameRoutes.COMPONENTS,
      icon: icons.Components,
      breadcrumbs: false
    },
  ]
};

export default menuItems;
