// project import
import { icons } from './icons';

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
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.Dashboard,
      breadcrumbs: false
    },
    {
      id: 'home',
      title: 'Home',
      type: 'item',
      url: '/home',
      icon: icons.Home,
      breadcrumbs: false
    },
  ]
};

export default menuItems;
