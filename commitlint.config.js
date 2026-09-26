export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'perf', 'chore', 'revert', 'docs', 'style', 'refactor', 'test', 'build', 'ci', 'wip']],
    // Known scopes, custom ones are still allowed
    'scope-enum': [1, 'always', ['back-to-top', 'comments-bbcode', 'homepage-redirect', 'torrent-preview', 'view-modes', 'related-torrents', 'history', 'core']],
  },
};
