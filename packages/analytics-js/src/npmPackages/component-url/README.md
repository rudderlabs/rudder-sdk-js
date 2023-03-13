# url

url parser.

## Example

```js
var url = require('url');
url.parse('http://example.com:3000/store/shoes?sort=desc');
```

yields:

```js
{
  hash: ""
  host: "example.com:3000"
  port: 3000,
  hostname: "example.com"
  href: "http://example.com:3000/store/shoes?sort=desc"
  pathname: "/store/shoes"
  protocol: "http:"
  query: "sort=desc"
  search: "?sort=desc"
}
```

## API

### url.parse(string)

Parse the given url `string`.

### url.isAbsolute(string)

Check if the given url `string` is absolute (has a scheme specified).

### url.isRelative(string)

Check if the given url `string` is relative.

### url.isCrossDomain(string)

Check if the given url `string` is cross-domain.

## Note

This url "parser" uses an `<a>` tag, this means that when
a relative url is given, such as "/foo", it becomes relative
to the current domain / path, because the browser resolves it
as it normally would.
