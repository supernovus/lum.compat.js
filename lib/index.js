/**
 * Compatibility jank.
 * @module @lumjs/compat
 */

const ESM = '__esModule';
const DEF = 'default';

/**
 * Make an exporter closure: `(key,value) => ...`;
 * 
 * Properties added with the closure are configurable and enumerable,
 * but not writable. It does NOT support accessors (getter/setter).
 * 
 * This is mostly just designed for use in the exportModule() function.
 * @param {(object|function)} obj - Target to export properties to.
 * @returns {function}
 */
function exporter(obj) {
  return (key, value) => Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    value,
  });
}

/**
 * Property name filtering or renaming function.
 * @callback module:@lumjs/compat~ExportUse
 * @param {string} prop - Property name in ES Module.
 * @returns {(string|false|undefined|null)} Property name for default export.
 */

/**
 * Export an ES Module type definition with some CommonJS compatibility.
 * 
 * This takes an ES Module that was loaded using `require()`, and will 
 * attempt to create a CommonJS export that adds (most) named exports 
 * as properties of the default export.
 * 
 * Example usage:
 * 
 * ```js
 * const { exportModule } = require('@lumjs/compat');
 * module.exports = exportModule(require('./index.mjs'));
 * ```
 * 
 * @param {object} mod - The ES Module object.
 * 
 * If this has a property named `default` that is either an `object`
 * or a `function` then it will have properties added to it for each
 * of the named exports (with a few exceptions configurable with options),
 * and then the default export will be returned.
 * 
 * NOTE: if the default export already has a property with an exported name,
 * that export will be skipped rather than overwriting the existing value.
 * 
 * If `mod.default` is NOT an object or function then the `mod` itself with
 * no modifications will be the return value from this function.
 * 
 * @param {object} [opts] Advanced options.
 * 
 * @param {(string|symbol|false)} [opts.esmName="__esModule"] ESM Object key.
 * 
 * If this is a string or symbol, it will be used as the name of a property
 * to add to the default export that will contain the full `mod` object.
 * 
 * Set this to `false` to disable this feature entirely.
 *
 * NOTE: unlike the named exports, this special property WILL overwrite an
 * existing property with the same name, so be sure it's something that won't
 * conflict. The default `__esModule` is meant to mask the boolean property
 * of the same name that Node adds to ES Modules loaded via require().
 * 
 * @param {boolean} [opts.skipDefault=true] Skip the `default` property?
 * 
 * If true (default) it skips adding the `default` property, which would
 * literally just be a link to itself and thus rather useless IMHO.
 * 
 * You can set this to false if you really want the self-reference,
 * or you could use `opts.map` to rename it to something else.
 * 
 * @param {module:@lumjs/compat~ExportUse} [opts.use] Advanced use only!
 * 
 * This will be called for every enumerable string-keyed property in `mod`.
 * The context (`this`) in non-closures will be the `opts` object.
 * 
 * It's return value will be used to determine the property name that
 * will be used on the default export for the associated named export.
 * 
 * - A `string` will be used as the property name on the default export.
 * - `undefined` or `null` is the same as returning the name unchanged.
 * - `false` may be used to skip adding that property entirely.
 * 
 * For the majority of packages this feature is likely unnecessary,
 * only use it if you have a really good reason to customize the exports!
 * 
 * @returns {(object|function)} Either `mod.default` or `mod` itself.
 * See above for details on how the return value is determined.
 */
function exportModule(mod, opts={}) {
  if (mod && typeof mod === 'object' && mod.default
    && (typeof mod.default === 'object' 
    ||  typeof mod.default === 'function')
  ) { // Has an object/function default export.
    let modef = mod.default;
    let esKey = opts.esmName ?? ESM;
    let noDef = opts.skipDefault ?? true;
    let use  = (typeof opts.use === 'function') ? opts.use : null;
    let addExport = exporter(modef);
    let props = Object.keys(mod);

    if (typeof esKey === 'string' || typeof esKey === 'symbol')
    { // Add a reference to the full module.
      addExport(esKey, mod);
    }

    for (let ep of props)
    {
      if (noDef && ep === DEF) continue;

      let dp = use ? (use.call(opts, ep) ?? ep) : ep;
      if (dp === false) continue;
      if (Object.hasOwn(modef, dp)) continue;

      let value = mod[ep];
      if (value === undefined) continue;

      addExport(dp, value);
    }

    return modef;
  }
  
  return mod;
}

module.exports = {exporter, exportModule}
