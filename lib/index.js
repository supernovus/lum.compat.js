// Compatibility jank.

const semver = require('semver');
const PKGJSON = 'package.json';

// A super simplistic package info wrapper.
class Package
{
  constructor(pkg)
  { 
    this.file = pkg+'/'+PKGJSON;
    this.info = require(this.file);
    this.version = semver.parse(this.info.version);
  }

  satisfies(range, options)
  {
    return semver.satisfies(this.version, range, options);
  }

  static new(pkg)
  {
    return new Package(pkg);
  }
}

exports.Package = Package;
