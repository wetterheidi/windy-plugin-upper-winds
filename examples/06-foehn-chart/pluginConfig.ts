import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-foehn-chart',
    version: '1.0.1',
    title: 'Foehn Chart Heidi',
    icon: '⛰️',
    description: 'Displays Foehn diagram for Austria.',
    author: 'Heidi modified IL',
    repository: 'https://github.com/windycom/windy-plugin-template',
    desktopUI: 'rhpane',
    mobileUI: 'fullscreen',
    routerPath: '/foehn-chart',
    desktopWidth: 800,
};

export default config;
