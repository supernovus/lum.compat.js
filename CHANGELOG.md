# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Plans
- The `main` branch is being used for an upcoming `2.0.0` release.
- The new version will be released alongside `@lumjs/core:2.0.0`.
- Will add new compatibility helpers to make major upgrades less painful.
### Added
- A `v1.x` branch using the same commit as the `v1.4.0` tag.
### Removed
- All of the `v1.x` compatibility sub-modules:
  - `v4` → attempted compatibility with my old-style JS library set.
  - `modulebuilder` → a badly designed helper for making node.js modules.
### Changed
- Cleaned up README to trim anything to do with the removed sub-modules.
### Fixed
- Added missing link references to this CHANGELOG.

## [1.4.0] - 2023-01-06
### Changed
- Made the `v4` set not use any `ModuleBuilder` features anymore.
- Moved `ModuleBuilder` from core into the `modulebuilder` namespace.

## [1.3.1] - 2022-10-18
### Fixed
- The `v4/loadtracker` was trying to call a function from the old `Lum` global.
  I replaced it with a new `opts.self` constructor parameter that gets assigned to
  the `this.$self` property.
### Changed
- Bumped `@lumjs/core` to `1.7.1`
- Using some of the new `ModuleBuilder` shortcuts.

## [1.3.0] - 2022-10-13
### Changed
- Bumped `@lumjs/core` to `1.6.1`.
- Rewrote `v4/index` to use `core.buildModule()` and lazy-loading.

## [1.2.0] - 2022-09-12
### Changed
- Updated almost all of the DocBlocks for better documentation.
- Updated README for similar reasons.
- Changed `v4/meta` into a top-level `v4` that includes all sub-modules.
- Bumped `@lumjs/core` dependency version to latest.
### Fixed
- Fixed a bug in the *default* module.

## [1.1.0] - 2022-08-11
### Changed
- Moved all *v4* stuff into a new `v4` sub-module.
- Kept `compat/v4-meta` as an alias to `compat/v4/meta`.
### Added
- `v4/deprecated` 
- `v4/loadtracker`
- `v4/object-helpers`
- `v4/promise`

## [1.0.0] - 2022-07-29
### Added
- Initial release.

[Unreleased]: https://github.com/supernovus/lum.compat.js/compare/v1.4.0...HEAD
[1.4.0]: https://github.com/supernovus/lum.compat.js/compare/v1.3.1...v1.4.0
[1.3.1]: https://github.com/supernovus/lum.compat.js/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/supernovus/lum.compat.js/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/supernovus/lum.compat.js/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/supernovus/lum.compat.js/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/supernovus/lum.compat.js/releases/tag/v1.0.0

