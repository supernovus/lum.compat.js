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

### `@lumjs/compat/v4`

The `v4` compatibility namespace. Includes all `v4` modules in one simple object.

| Property        | Description                                               |
| --------------- | --------------------------------------------------------- |
| `descriptors`   | The `v4/descriptors` module.                              |
| `DESC`          | The `v4/descriptors.DESC` factory object.                 |
| `prop()`        | The `v4/prop` module.                                     |
| `deprecated()`  | The `v4/deprecated` module.                               |
| `LoadTracker`   | The `v4/loadtracker` module.                              |
| `Promise`       | The `v4/promise` module.                                  |
| `obj`           | The `v4/object-helpers` module.                           |

## Official URLs

This library can be found in two places:

 * [Github](https://github.com/supernovus/lum.compat.js)
 * [NPM](https://www.npmjs.com/package/@lumjs/compat)

## Author

Timothy Totten <2010@totten.ca>

## License

[MIT](https://spdx.org/licenses/MIT.html)
