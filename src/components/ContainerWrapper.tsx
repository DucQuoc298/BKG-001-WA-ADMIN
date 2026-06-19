import PropTypes from 'prop-types';
import React from 'react';
// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Container from '@mui/material/Container';
// project imports
import { ToolBarLocal } from 'components/ToolBar';
import { ToolBarLocalProps } from './ToolBar/ToolBarLocal';
import { SxProps } from '@mui/material';

// ==============================|| CONTAINER WRAPPER ||============================== //
interface ContainerWrapperProps {
  children: React.ReactNode;
  rest?: any;
  toolbarLocalProps?: ToolBarLocalProps;
  sx?: SxProps
}
export default function ContainerWrapper({ children, toolbarLocalProps, sx, ...rest }: ContainerWrapperProps) {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <Container
      disableGutters={downMD}
      maxWidth={false}
      sx={{
        px: { xs: 0 },
        position: 'relative',
        width: '100%',
        m: 0,
        ...sx
      }}
      {...rest}
    >
      <ToolBarLocal {...toolbarLocalProps} />
      {children}
    </Container>
  );
}

ContainerWrapper.propTypes = { children: PropTypes.any, rest: PropTypes.any, toolbarLocalProps: PropTypes.any };
