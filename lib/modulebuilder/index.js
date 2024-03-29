
const 
{
  S,F,B,
  isObj,needObj,needType,
  def,lazy
} = require('@lumjs/core/types');

const clone = require('@lumjs/core/obj').duplicateOne;

// Methods we want to export in the functional API.
const BUILD_METHODS = ['has', 'can', 'from', 'set'];

// Fallback locale
const DLOC = 'en-US';

/**
 * A class to make building modules easier.
 * 
 * Basically wraps calls to `require()`, `def()`, `lazy()`,
 * and assignments to `module.exports` into a simple set of methods.
 * 
 * @exports module:@lumjs/compat/modulebuilder
 */
class ModuleBuilder
{
  /**
   * Build a new ModuleBuilder instance.
   * 
   * @param {object} targetModule - The `module` context variable.
   * @param {object} [opts] - Options to change some default settings.
   * @param {boolean} [opts.configurable=false] Default `configurable` value.
   * @param {boolean} [opts.enumerable=true] Default `enumerable` value.
   * @param {boolean} [opts.writable=false] Default `writable` value.
   * 
   * @param {number} [opts.nested=NESTED_ERROR] How to handle nested names.
   * 
   * If the `name` parameter in either the `has()` or `can()` method is passed 
   * as the path to a nested module with one or more `/` characters, 
   * this mode will determine how we derive the property name. 
   * 
   * For each mode, we'll use an example `name` of `./some/nested/path`.
   * 
   * - `ModuleBuilder.NESTED_ERROR` `[0]` (default mode)
   *   Throw an `Error` saying paths are unhandled.
   * - `ModuleBuilder.NESTED_FIRST` `[1]`
   *   Use the first (non-dot) path element, e.g. `some`
   * - `ModuleBuilder.NESTED_LAST` `[2]`
   *   Use the last path element, e.g. `path`
   * - `ModuleBuilder.NESTED_CAMEL` `[3]`
   *   Convert the name to camelCase, e.g. `someNestedPath`
   * 
   * It's always possible to set the `conf.module` parameter manually as well,
   * which avoids the need to generate a separate parameter name.
   * 
   * @param {(string|boolean)} [opts.withLocale=false] Use locales?
   * 
   * If this is a `string` it's the name of the locale (e.g. `en-US`).
   * 
   * If this is `true` we'll use the default locale as determined by
   * [getLocale()]{@link module:@lumjs/core/strings.getLocale}.
   * 
   * If this is `false` we won't use locales (unless the `NESTED_CAMEL`
   * mode is in use, in which case we'll use the default locale.)
   * 
   */
  constructor(targetModule, opts={})
  {
    needObj(opts, 'opts was not an object');
    needObj(targetModule, 'targetModule was not an object');
    needObj(targetModule.exports, 'targetModule.exports was not an object');
    needType(F, targetModule.require, 'targetModule.require was not a function');

    this.module = targetModule;

    this.configurable = opts.configurable ?? false;
    this.enumerable   = opts.enumerable   ?? true;
    this.writable     = opts.writable     ?? false;

    this.nested = opts.nested ?? ModuleBuilder.NESTED_ERROR;

    if (opts.withLocale)
    { // Initialize the strings here.
      this.withLocale(opts.locale);
    }
  }

  // Get a descriptor for a module export.
  requireDescriptor(name, conf={})
  {
    if (typeof conf === S)
    { // A quick shortcut for setting module name.
      conf = {module: conf};
    }
    else if (conf === true)
    { // Use the lowercase name as the module.
      conf = {module: this.$lc(name)};
    }
    else if (typeof conf.getter === F || typeof conf.setter === F)
    { // It's an accessor-style descriptor already.
      return conf;
    }

    let value = conf.value;
    
    if (value === undefined)
    {
      if (typeof conf.module === S)
        name = conf.module; 
      if (!name.startsWith('./'))
        name = './'+name;

      value = this.module.require(name);

      if (value && conf.prop && value[conf.prop] !== undefined)
      { 
        value = value[conf.prop];
      }
    }

    const configurable = conf.configurable ?? this.configurable;
    const enumerable   = conf.enumerable   ?? this.enumerable;
    const writable     = conf.writable     ?? this.writable;

    return {configurable, enumerable, writable, value};
  }

  $lc(name)
  {
    return name.toLocaleLowerCase(this.locale ?? DLOC);
  }
 
  // Normalize a property name.
  $normalizeProperty(name)
  {
    if (name.startsWith('./'))
    { // Get rid of the prefix.
      name = name.substring(2);
    }

    if (name.includes('/'))
    { // Multiple paths found.
      const names = name.split('/');
      if (this.nested === ModuleBuilder.NESTED_FIRST)
      {
        name = names[0];
      }
      else if (this.nested === ModuleBuilder.NESTED_LAST)
      {
        name = names[names.length-1];
      }
      else if (this.nested === ModuleBuilder.NESTED_CAMEL)
      {
        name = this.$normalizeWithCamelCase(names);
      }
      else 
      {
        throw new Error("No valid nested path handling method was set");
      }
    }

    return name;
  }

  withLocale(loc)
  {
    if (this.strings === undefined)
    { // Load the strings library.
      this.strings = require('@lumjs/core/strings');
    }

    if (this.locale === undefined)
    { // Set the locale.
      if (typeof loc === S)
      { // Use an explicitly passed value.
        this.locale = loc;
      }
      else 
      { // Use the default locale.
        this.locale = this.strings.getLocale();
      }
    }
  }

  $normalizeWithCamelCase(names)
  {
    this.withLocale();
    let name = names.shift().toLocaleLowerCase(this.locale);
    for (const path in names)
    {
      name += this.strings.ucfirst(path, true, this.locale);
    }
    return name;
  }
  
  /**
   * Export a module directly.
   * 
   * @param {string} name - The property name to export.
   *
   * @param {(object|string|true)} [conf] Additional export configuration options.
   * 
   * If this is a `string` instead of an `object`, it's assumed to be the
   * `conf.module` value.
   * 
   * If this is `true` then the `conf` will be set with `module` being the
   * lowercase version of `name`.
   * 
   * @param {string} [conf.module=`./${name}`] The module to `require()`.
   * @param {string} [conf.prop] If set, we want an exported property
   * of this name from the loaded module.
   * 
   * If not set, the entire loaded module will be our exported value.
   * 
   * @param {boolean} [conf.configurable=this.configurable] 
   * Descriptor `configurable` value.
   * @param {boolean} [conf.enumerable=this.enumerable] 
   * Descriptor `enumerable` value.
   * @param {boolean} [conf.writable=this.writable] 
   * Descriptor `writable` value.
   * 
   * @param {*} [conf.value] An explicit value to set.
   * 
   * This skips the `require()` call entirely.
   * 
   * @returns {object} `this`
   */
  has(name, conf={})
  {
    const pname = this.$normalizeProperty(name);
    const desc = this.requireDescriptor(name, conf);
    def(this.module.exports, pname, desc);
    return this;
  }

  /**
   * Export a lazy-loaded module.
   * 
   * @param {string} name - The property name to export.
   * 
   * @param {object} [conf] Additional export configuration options.
   * 
   * In addition to all the options supported by 
   * [has()]{@link module:@lumjs/core/modules#has}
   * this also supports one further option.
   * 
   * @param {object} [conf.lazy] Advanced options for the `lazy()` call.
   * 
   * If not specified, sane defaults will be used, that ensures the
   * `enumerable` descriptor property for the lazy getter is set the
   * same as the final descriptor property once its loaded.
   * 
   * @returns {object} `this`
   */
  can(name, conf={})
  {
    const pname = this.$normalizeProperty(name);
    const enumerable = conf.enumerable ?? this.enumerable;
    const lazyOpts = isObj(conf.lazy) ? conf.lazy : {enumerable};
    const getter = () => this.requireDescriptor(name, conf);
    lazy(this.module.exports, pname, getter, lazyOpts);
    return this;
  }

  /**
   * Re-export some exported properties from a module.
   * 
   * By default this uses `has()` to define the exports, but that
   * can be changed using special parameter values.
   * 
   * @param {string} modname - The module to export the properties from.
   * @param  {...any} libs - What we're exporting.
   * 
   * If this is a `string` it is the name of an exported property we want to
   * re-export directly.
   * 
   * If this is `true`, all subsequent values will be exported using `can()`.
   * 
   * If this is `false`, all subsequent values will be exported using `has()`.
   * 
   * If this is an `object`, then it's considered the `conf` parameter for
   * the `has()` or `can()` methods. If the `conf` does not have a `module`
   * property, the `modname` will be assigned as the `module` property.
   * You cannot set the `prop` property, as it's overwritten for every 
   * exported property.
   * 
   * @returns {object} `this`
   */
  from(modname, ...libs)
  {
    let func = 'has';
    let curConf = {module: modname};
    for (const lib of libs)
    {
      if (isObj(lib))
      { // Change the current config.
        curConf = clone(lib);
        if (curConf.module === undefined)
        { // Make sure the module name is assigned.
          curConf.module = modname;
        }
      }
      else if (typeof lib === B)
      { // Change the function we're calling.
        func = lib ? 'can' : 'has';
      }
      else if (typeof lib === S)
      {
        const conf = clone(curConf);
        conf.prop = lib;
        this[func](lib, conf);
      }
      else 
      {
        throw new TypeError("libs must be strings, booleans, or objects");
      }
    }
    return this;
  }

  /**
   * Define an exported property in our module.
   * 
   * This is literally just a wrapper around the
   * [def()]{@link module:@lumjs/core/types.def} method,
   * that passes `this.module.exports` as the `obj` parameter.
   * 
   * @param {*} name - See `def()` for details.
   * @param {*} value - See `def()` for details.
   * @param {*} opts - See `def()` for details.
   * @returns {(object|function)} What is returned may vary:
   * 
   * If the `def()` returns a *bound* copy of itself, we'll return that
   * bound function directly.
   * 
   * In any other case, we return `this` ModuleBuilder instance.
   */
  set(name, value, opts)
  {
    const retval = def(this.module.exports, name, value, opts);
    if (typeof retval === F && isObj(retval.$this) && retval.$this.bound === retval)
    { // A bound copy was returned, we're going to return it directly.
      return retval;
    }
    return this;
  }

  /**
   * Create a functional API for the ModuleBuilder class.
   * 
   * Basically makes a new `ModuleBuilder` instance, then creates standalone 
   * closure functions that wrap the main instance methods.
   * 
   * These functions can be imported into a namespace directly.
   * They each have a special `builder` property which is a reference
   * to the underlying `ModuleBuilder` instance.
   * 
   * There's also a `builder` property in the exported function list,
   * as well as a copy of the `def()` method for quick exporting.
   * 
   * Example usage:
   * 
   * ```js
   * const {has,can,from,set} 
   *  = require('@lumjs/compat/modulebuilder').ModuleBuilder.build(module);
   * 
   * // exports.foo = require('./foo');
   * has('foo'); 
   * 
   * // exports.someNestedPath = require('./some/nested/path');
   * has('./some/nested/path'); 
   * 
   * ```
   * 
   * @param {object} targetModule - The `module` for the Builder instance.
   * @param {object} [opts] - Any options for the Builder instance.
   * @returns {object} An object containing the closure functions.
   */
  static build(targetModule, opts)
  {
    const builder = new this(targetModule, opts);
    const funcs = {builder, def};
    for (const name of BUILD_METHODS)
    {
      const func = function()
      {
        return builder[name](...arguments);
      }
      def(func, 'builder', builder);
      funcs[name] = func;
    }
    return funcs;
  }

  /**
   * A static alternative to `new ModuleBuilder()`;
   * 
   * @param {object} targetModule 
   * @param {object} [opts] 
   * @returns {object} The new `ModuleBuilder` instance.
   */
  static new(targetModule, opts)
  {
    return new this(targetModule, opts);
  }

}

def(ModuleBuilder, 'NESTED_ERROR', 0)
def(ModuleBuilder, 'NESTED_FIRST', 1);
def(ModuleBuilder, 'NESTED_LAST',  2);
def(ModuleBuilder, 'NESTED_CAMEL', 3);

module.exports = ModuleBuilder;
