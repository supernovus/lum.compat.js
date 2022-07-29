# lum.compat.js

As the libraries grow over time, features can change a lot, and backwards
compatibility is not always easy to maintain.

This library serves two purposes. The first is to be like the corresponding
[lum/lum-compat](https://github.com/supernovus/lum.compat.php) PHP library, 
offering some generic compatibility functions.

The second is to be a repository for some older, deprecated functionality from
the [@lumjs/core](https://github.com/supernovus/lum.core.js) library.

By keeping some of the old sub-modules here as optional plugins, I can keep
legacy code up and running until I can rewrite it to no longer use those
features.

## Entry Points

To keep features simple and separated, there's a few different entry points
exported from this library.

### `@lumjs/compat` 

The main entrypoint is reserved for generic compatibility functions.

### `@lumjs/compat/v4-meta`

This entry-point adds several overly convoluted meta-programming features that
had been in the original `core` library in the legacy `v4` but during the 
early stages of the rewrite I decided were just bloat that could be done better.

| Core Property   | Description                                               |
| --------------- | --------------------------------------------------------- |
| `descriptors`   | A sub-module for creating magic Descriptor objects.       |
| `DESC`          | The primary API for the `descriptors` sub-module.         |
| `prop()`        | An `Object.defineProperty` wrapper using `descriptors`.   |

These were all features I overthought and overdesigned, and added layers of
complexity that were not required. The `prop()` function has been replaced by 
`core.def()` which has a cleaner and simpler API and doesn't require the evil
dark magic that was the `descriptors` module.

## Official URLs

This library can be found in two places:

 * [Github](https://github.com/supernovus/lum.compat.js)
 * [NPM](https://www.npmjs.com/package/@lumjs/compat)

## Author

Timothy Totten <2010@totten.ca>

## License

[MIT](https://spdx.org/licenses/MIT.html)
