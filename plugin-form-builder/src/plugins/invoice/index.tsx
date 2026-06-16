import { definePlugin } from '../../types';

export const createPluginComponent = definePlugin(({ react: React, sdk }) => {
    const { MainCard, ContainerWrapper, Typography, } = sdk.components;
    function DemoFormPlugin() {
      return (
        <ContainerWrapper>
          <MainCard >
            <Typography variant="h4" gutterBottom>
              Invoice Page
            </Typography>
            <Typography variant="body1">
              This is the invoice page content.
            </Typography>
          </MainCard>
        </ContainerWrapper>
      );
    }

    return DemoFormPlugin;
});
