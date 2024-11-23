import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-upper-winds',
    version: '0.0.16',
    icon: '🪂',
    title: 'Upper winds',
    description: 'Show upper winds, temperature and humidity at a given position',
    author: 'Wetterheidi',
    repository: 'https://github.com/wetterheidi/windy-plugin-upper-winds.git',
    desktopUI: 'rhpane',
    mobileUI: 'fullscreen',
    routerPath: '/mff-winds',
    desktopWidth: 500,
    listenToSingleclick: true,
    addToContextmenu: true,
    private: false
};

export default config;
