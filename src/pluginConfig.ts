import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-foehn-chart',
    version: '0.0.1',
    title: 'Pressure Difference Charts Alps',
    icon: '⛰️',
    description: 'Displays Foehn diagrams for various cross sections.',
    author: 'Heidi modified IL',
    repository: 'https://github.com/wetterheidi/windy-plugin-foehn-cross-section',
    desktopUI: 'rhpane',
    mobileUI: 'fullscreen',
    routerPath: '/foehn-chart',
    desktopWidth: 800,
};

export default config;
