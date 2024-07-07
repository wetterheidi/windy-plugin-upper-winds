import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-foehn-chart',
    version: '0.0.1',
    title: 'Pressure Difference Charts Alps',
    icon: '⛰️',
    description: 'Displays pressure difference diagrams for various cross sections.',
    author: 'HS',
    repository: 'https://github.com/wetterheidi/windy-plugin-foehn-cross-section',
    desktopUI: 'rhpane',
    mobileUI: 'fullscreen',
    routerPath: '/foehn-chart-alps',
    desktopWidth: 800,
    private: true,
};

export default config;
