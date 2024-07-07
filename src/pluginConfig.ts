import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-contrails',
    version: '0.0.1',
    icon: '🪂',
    title: 'Upper winds',
    description: 'Show upper winds, temperature and humidity at a given position',
    author: 'Heidi Schmid',
    repository: 'https://github.com/IoanaLogafatu/windy-plugin-contrails',
    desktopUI: 'rhpane',
    mobileUI: 'fullscreen',
    routerPath: '/contrails',
    listenToSingleclick: true,
    addToContextmenu: true,
    private: true
};

export default config;
