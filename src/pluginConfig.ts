import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-mff-winds',
    version: '0.0.1',
    icon: '⚔',
    title: 'MFF winds',
    description: 'Show MFF winds, temperature and humidity at a given position',
    author: 'wetterheidi',
    repository: 'https://github.com/wetterheidi/windy-plugin-mff-winds.git',
    desktopUI: 'rhpane',
    mobileUI: 'fullscreen',
    routerPath: '/mff-winds',
    desktopWidth: 500,
    listenToSingleclick: true,
    addToContextmenu: true,  
    private: true
};

export default config;
