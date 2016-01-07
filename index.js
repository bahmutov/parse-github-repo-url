var parse = require('url').parse

function isGithubLikeDomain(hostname) {
  var domains = [
    'github.com', 'api.github.com', 'codeload.github.com'
  ]
  if (domains.indexOf(hostname) !== -1) {
    return true
  }
  return /^gitlab\.[a-zA-Z]+\.com$/.test(hostname)
}

module.exports = function (string) {
  // user/repo#version
  var m = /^([\w-]+)\/([\w-.]+)((?:#|@).+)?$/.exec(string)
  if (m) return format(m)

  string = string.replace('//www.', '//')
  // normalize git@ and https:git@ urls
  string = string.replace(/^git@/, 'https://')
  string = string.replace(/^https:git@/, 'https://')
  string = string.replace('.com:', '.com/')

  if (!~string.indexOf('://')) {
    return false
  }
  var url = parse(string)

  if (!isGithubLikeDomain(url.hostname)) {
    return false
  }

  var path = url.pathname.replace(/\.git$/, '')

  // https://www.npmjs.org/doc/json.html#Git-URLs-as-Dependencies
  var m = /^\/([\w-]+)\/([\w-.]+)$/.exec(path)
  if (m) return m.slice(1, 3).concat((url.hash || '').slice(1))

  // archive link
  // https://developer.github.com/v3/repos/contents/#get-archive-link
  var m = /^\/repos\/([\w-]+)\/([\w-.]+)\/(?:tarball|zipball)(\/.+)?$/.exec(path)
  if (m) return format(m)

  // codeload link
  // https://developer.github.com/v3/repos/contents/#response-4
  var m = /^\/([\w-]+)\/([\w-.]+)\/(?:legacy\.(?:zip|tar\.gz))(\/.+)?$/.exec(path)
  if (m) return format(m)

  // tarball link
  // https://github.com/LearnBoost/socket.io-client/blob/master/package.json#L14
  var m = /^\/([\w-]+)\/([\w-.]+)\/archive\/(.+)\.tar\.gz?$/.exec(path)
  if (m) return m.slice(1, 4)

  return false
}

function format(m) {
  var version = (m[3] || '').slice(1)
  if (/^['"]/.test(version)) version = version.slice(1, -1)
  return [m[1], m[2], version]
}
