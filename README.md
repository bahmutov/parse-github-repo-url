# Parse GitHub Repo URL

Parse all the stupid ways you could write a GitHub URL in your damn `package.json`.
Supports:

- `<user>/<repo#<commit>`
- `git://` and `.git` w/ `#commit` or `@version`
- `git@` and `https:git@`
- `www.github.com`
- All 5 different ways you could download a freaking tarball/zipball

[![Build status][ci-image] ][ci-url]

## API

### [user, repo, version] = parse(url)

`version` could be `false`y, a semantic version, a commit, or a branch, etc.

```js
var parse = require('parse-github-repo-url')
parse('component/emitter#1') // => ['component', 'emitter', '1']
```

See the tests for all the different types of supported URLs.

[ci-image]: https://travis-ci.org/repo-utils/parse-github-repo-url.png?branch=master
[ci-url]: https://travis-ci.org/repo-utils/parse-github-repo-url
