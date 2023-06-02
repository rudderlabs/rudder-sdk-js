# domain

Constructs possible levels from a url and attempts to set a cookie `"." + domain` for each, when it succeeds it returns the top level domain.

This only works on the domain itself, since it attempts to set a cookie.

## API

```js
var domain = require('top-domain');

assert('google.com' == domain('http://www.google.com'));
assert('google.co.uk' == domain('http://www.google.co.uk'));
assert('google.co.uk' == domain('http://google.co.uk'));
assert('github.com' == domain('http://gist.github.com/calvinfo/some_file'));
assert('' == domain('http://localhost:3000'));
assert('google.com' == domain('https://google.com:443/stuff'));
assert('' == domain('http://dev:3000'));
assert('' == domain('0.0.0.0'));
assert('' == domain('127.0.0.1'));
```
