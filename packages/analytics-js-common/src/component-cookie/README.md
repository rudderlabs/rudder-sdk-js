# cookie

Cookie component.

## Example

```js
// set
cookie('name', 'tobi');
cookie('name', 'tobi', { path: '/' });
cookie('name', 'tobi', { maxage: 60000 }); // in milliseconds
cookie('species', 'ferret');

// get
var name = cookie('name');
// => "tobi"

var cookies = cookie();
// => { name: "tobi", species: "ferret" }

// clear
cookie('name', null);
```
