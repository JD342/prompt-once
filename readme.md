# [prompt-once][npm]

[![License][license-image]][license-url]

Prompts user for a string value once, caches it in a file, returns that value for every subsequent invocation.

## Example

![Preview][preview-image]

_index.js:_

```js
const promptOnce = require('prompt-once');

promptOnce('value.txt', 'Type in the value').then(d => {
    console.log('result:', d);
});
```

## API

##### `promptOnce(cacheFile, valueName)`

 * `cacheFile` (string): location of the cache file.
 * `valueName` (string): name of value that will be displayed in the terminal when prompting the user.
 * Returns a [thenable][promise-resolve] event emitter. It promises the retrieval of the string value. `value` event
   notifies the value retrieval, `error` event notifies any error that occurs during retrieval or when
   caching the value after its retrieval, 'cache' event notifies successful caching.

## History

- 1.0.0 - 17 June 2019: Initial release

## License

[MIT][license-url]

[promise-resolve]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve
[preview-image]: preview.webp
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: LICENSE
[npm]: https://www.npmjs.com/package/prompt-once