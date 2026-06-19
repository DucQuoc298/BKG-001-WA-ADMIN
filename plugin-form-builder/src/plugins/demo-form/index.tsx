import { definePlugin } from '../../types';

export const createPluginComponent = definePlugin(({ react: React, sdk }) => {
    const { MainCard, Paper, Typography } = sdk.components;


    function DemoFormPlugin() {

        return (
            <Paper sx={{ p: 3, m: 3, borderRadius: 2 }} variant="outlined">
                <Typography variant="h5" sx={{ mt: 0 }}>
                    Runtime Plugin Demo (MUI from Host)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Plugin dang dung cac component MUI duoc host truyen vao de giu giao dien dong nhat.
                </Typography>
                
                <MainCard title="Host Custom Components" sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Day la MainCard va Dialog duoc lay truc tiep tu host qua sdk.components.
                    </Typography>
                </MainCard>
                
            </Paper>
        );
    }

    return DemoFormPlugin;
});
