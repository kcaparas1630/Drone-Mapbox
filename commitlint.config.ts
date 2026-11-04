// Commitlint rules: Conventional Commits with an FSD slice or tooling area as the required scope (011).
const COMMIT_SCOPES = [
  'app',
  'map-page',
  'map-view',
  'hud',
  'search-bar',
  'fire-popup',
  'route-banner',
  'joystick',
  'control-drone',
  'fly-to-place',
  'pause-resume-route',
  'select-fire',
  'drone',
  'route',
  'fire',
  'terrain',
  'map-camera',
  'shared',
  'eslint',
  'scripts',
  'ci',
  'deps',
  'e2e',
  'docs',
  'adr',
  'conventions',
];

const ERROR = 2;

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [ERROR, 'always', COMMIT_SCOPES],
    'scope-empty': [ERROR, 'never'],
  },
};
