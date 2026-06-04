// project import
import { DashboardOutlined } from '@mui/icons-material';
import dashboard from './dashboard';
import pages from './page';

// ==============================|| MENU ITEMS ||============================== //
const icons = {
  DashboardOutlined
};

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
      url: '/dashboard/default',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'dashboards',
      title: 'Dashboards',
      type: 'collapse',
      url: '/dashboard/default',
      icon: icons.DashboardOutlined,
      breadcrumbs: false,
      children: [
        {
          id: '1',
          title: 'Analytics',
          type: 'item',
          url: '/dashboard/analytics',
          breadcrumbs: false,
        },
        {
          id: '2',
          title: 'Analytics',
          type: 'item',
          url: '/dashboard/analytics',
          breadcrumbs: false,
        },
        {
          id: '3',
          title: 'Analytics',
          type: 'item',
          url: '/dashboard/analytics',
          breadcrumbs: false
        },
        {
          id: '4',
          title: 'Analytics',
          type: 'item',
          url: '/dashboard/analytics',
          breadcrumbs: false
        },
      ]
    },
    {
      id: 'dashboardsss',
      title: 'Dashboardssss',
      type: 'collapse',
      url: '/dashboard/default',
      icon: icons.DashboardOutlined,
      breadcrumbs: false,
      children: [
        {
          id: '6',
          title: '34',
          type: 'item',
          url: '/dashboard/analytics',
          breadcrumbs: false,
        },
        {
          id: '7',
          title: 'Analyt34ics',
          type: 'item',
          url: '/dashboard/analytics',
          breadcrumbs: false,
        },
        {
          id: '8',
          title: 'Analytics',
          type: 'item',
          url: '/dashboard/analytics',
          breadcrumbs: false
        },
        {
          id: '9',
          title: 'Analytics',
          type: 'item',
          url: '/dashboard/analytics',
          breadcrumbs: false
        },
      ]
    }
  ]
};

export default menuItems;
