import PropTypes from 'prop-types';
import React from 'react';
// material-ui
import List from '@mui/material/List';

// project import
import NavItem from '../NavItem';
import { useGetMenuMaster } from 'api/menu';
import { ISideBarMenuItem } from 'menu-items';
import NavCollapse from '../NavCollapse';

// ==============================|| NAVIGATION - LIST GROUP ||============================== //

export default function NavGroup({ item }: { item: ISideBarMenuItem[] | undefined }) {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened;

  const items = item?.map((menuItem) => {
    switch (menuItem.type) {
      case 'collapse':
        return <NavCollapse key={menuItem.id} item={menuItem} level={1} />;
      case 'item':
        return <NavItem key={menuItem.id} item={menuItem} level={1} />;
    }
  });

  return (
    <List
      sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}
    >
      {items}
    </List>
  );
}

NavGroup.propTypes = { item: PropTypes.array };
