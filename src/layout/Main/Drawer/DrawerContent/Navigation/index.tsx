// material-ui
import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';
// project import
import NavGroup from './NavGroup';
import menuItem, { ISideBarMenuItem } from '../../../../../menu-items';
import { getRuntimePluginManifest } from 'runtime/services/runtime';
import { icons } from '../../../../../menu-items/icons';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

export default function Navigation() {
  const [menuItemsList, setMenuItemsList] = useState<ISideBarMenuItem[]>(menuItem.children || []);

  useEffect(() => {
    let active = true;

    const loadSidebarPlugins = async () => {
      try {
        const { plugins } = await getRuntimePluginManifest();
        if (!active) return;

        // Lọc các plugin được kích hoạt và muốn hiển thị ở sidebar
        const sidebarPlugins = plugins.filter(
          (plugin) => plugin.enabled !== false && plugin.sidebar === true
        );

        if (sidebarPlugins.length === 0) return;

        // Map thông tin plugin sang định dạng ISideBarMenuItem
        const dynamicItems: ISideBarMenuItem[] = sidebarPlugins.map((plugin) => {
          // Chuẩn hóa tên icon để map với icons object (ví dụ "invoice" -> "Invoice")
          const iconKey = plugin.icon
            ? (plugin.icon.charAt(0).toUpperCase() + plugin.icon.slice(1)) as keyof typeof icons
            : 'Dashboard';
          const IconComponent = icons[iconKey] || icons.Dashboard;

          return {
            id: plugin.id,
            title: plugin.name,
            type: 'item',
            url: plugin.routePath,
            icon: IconComponent,
            breadcrumbs: false,
          };
        });

        // Kết hợp menu tĩnh và menu động từ plugin
        setMenuItemsList([...(menuItem.children || []), ...dynamicItems]);
      } catch (error) {
        console.error('Failed to load dynamic sidebar items:', error);
      }
    };

    loadSidebarPlugins();

    return () => {
      active = false;
    };
  }, []);

  return (
    <Box sx={{ pt: 2 }}>
      <NavGroup item={menuItemsList} />
    </Box>
  );
}
