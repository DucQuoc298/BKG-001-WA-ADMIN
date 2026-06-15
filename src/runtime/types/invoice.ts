import { ComponentType } from 'react';
import {
  RuntimeSharedComponents,
  defineAppRuntime,
  defineFormRuntime,
} from '.';
import demoFormRuntime from './default';
import { Box } from '@mui/material';

export interface InvoiceFormAppRuntime extends RuntimeSharedComponents {
  components: {
    Box: ComponentType<any>;
  }
}

const runtime = defineAppRuntime<InvoiceFormAppRuntime>({
  http: demoFormRuntime.runtime.http,
  broadcast: demoFormRuntime.runtime.broadcast,
  components: {
    Box: Box,
    ContainerWrapper: demoFormRuntime.runtime.components.ContainerWrapper,
    MainCard: demoFormRuntime.runtime.components.MainCard,
    Typography: demoFormRuntime.runtime.components.Typography,
  }
});

export default defineFormRuntime('invoice', runtime);