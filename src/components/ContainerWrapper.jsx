import PropTypes from 'prop-types';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

// ==============================|| CONTAINER WRAPPER ||============================== //

export default function ContainerWrapper({ children, ...rest }) {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <Container 
      disableGutters={downMD} 
      maxWidth={"auto"}
        sx={{
          px: { xs: 0 },
          position: 'relative',
          width: '100%',
          m: 0
        }}
      {...rest}
    >
      {children}
    </Container>
  );
}

ContainerWrapper.propTypes = { children: PropTypes.any, rest: PropTypes.any };
