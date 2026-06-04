import type { PluginUi, PluginReact } from '../types';

type ClickHandler = () => Promise<void>;

type ActionButtonsProps = {
    loading: boolean;
    callHostApi: ClickHandler;
    callExternalApi: ClickHandler;
};

export const createActionButtonsComponent = (React: PluginReact, ui: PluginUi) => {
    const { Button, Stack } = ui;

    function ActionButtons({ loading, callHostApi, callExternalApi }: ActionButtonsProps) {
        return (
            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                <Button onClick={callHostApi} disabled={loading} variant="contained" size="small">
                    {loading ? 'Loading...' : 'Call host API (getLicenceInfo)'}
                </Button>
                <Button onClick={callExternalApi} disabled={loading} variant="outlined" size="small">
                    {loading ? 'Loading...' : 'Call external API'}
                </Button>
            </Stack>
        );
    }

    return ActionButtons;
};
