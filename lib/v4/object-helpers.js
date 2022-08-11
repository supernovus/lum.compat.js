const core = require('@lumjs/core');
const {O,F,S,B,isObj} = core.types;
const {clone,copyProps} = core.obj;

/**
 * A way to handle Mixins/Traits.
 *
 * This is basically a magic wrapper around {@link Lum.obj.into} which we 
 * use instead of Object.assign() as we don't want to overwrite properties
 * by default.
 *
 * As it's designed to extend the class prototype and only the prototype,
 * it will see if anything passed to it is a function/class and if so, it
 * will automatically use the prototype of the function/class. If you want
 * to copy static class properties, use {@link Lum.obj.into} instead of this.
 *
 * @param {object|function} target - The target we are copying into.
 * @param {...*} sources - The source traits we want to mix in.
 *
 * @return {object|function}  The `target` will be returned.
 *
 * @alias module:@lumjs/compat/v4/object-helpers.mixin
 */
exports.mixin = function (target, ...inSources)
{
  var outSources = [];

  function unwrap (what)
  {
    if (typeof what === F && typeof what.prototype === O)
    {
      return what.prototype;
    }
    else if (isObj(what))
    {
      return what;
    }
    else
    {
      throw new Error("Invalid function/object passed to addTraits()");
    }
  }

  target = unwrap(target); // Ensure the target is an object.

  for (var s in inSources)
  {
    var source = inSources[s];
    if (typeof source === B || typeof source === S)
    { // A special option statement, push it directly.
      outSources.push(source);
    }
    else
    { // Anything else needs to be unwrapped.
      outSources.push(unwrap(source));
    }
  }

  return exports.into(target, outSources);
}

/**
 * Copy properties between objects. Can be used for mixins/traits.
 *
 * For each of the sources specified, this will call:
 *
 *  ```Lum.obj.copy(source, target, opts)```
 *
 * The current `opts` can be changed dynamically using special statements.
 * See below for details on the statements to make that work.
 * The default `opts` is `{default: true, overwrite: false}`
 *
 * @param  {object|function} target - The target we are copying into.
 * @param {...*} sources - The sources to copy from, and options.
 *
 * If a source is a boolean, it will reset the `opts.overwrite` property.
 *
 * If a source is the string 'default' we set the `opts` to:
 *   `{default: true, overwrite: opts.overwrite}`
 *
 * If a source is the string 'all' we set the `opts` to:
 *   `{all: true, overwrite: opts.overwrite}`
 *
 * If a source is an object with a property of `__copy_opts` which is `true`
 * then the `opts` will be set to the source itself.
 *
 * If a source is an object with a property of `__copy_opts` which is an
 * `object` then the `opts` will be set to the object, and the rest of
 * the properties from the source will be copied as usual.
 *
 * If the source is any other object or function, it will be considered a
 * valid source to copy into the `target`.
 *
 * Anything else will be invalid and will throw an Error.
 *
 * @return {object|function}  The `target` will be returned.
 *
 * @method Lum.obj.into
 */
exports.into = function (target, ...sources)
{
  let opts = {default: true, overwrite: false}; // default opts.

//    console.debug("Lum.obj.copyInto()", target, sources);

  for (let s in sources)
  {
    let source = sources[s];
    const stype = typeof source;
//      console.debug("source", source, stype);
    if (stype === B)
    {
      opts.overwrite = source;
    }
    else if (stype === S)
    {
      if (source === 'default')
      {
        opts = {default: true, overwrite: opts.overwrite};
      }
      else if (source === 'all')
      {
        opts = {all: true, overwrite: opts.overwrite};
      }
    }
    else if (stype === O || stype === F)
    {
//        console.debug("copying properties", source);
      if (source.__copy_opts === true)
      { // Source is copy options.
        opts = source;
        continue; // Nothing more to do here.
      }
      else if (isObj(source.__copy_opts))
      { // Copy options included in source.
        opts = source.__copy_opts;
        source = clone(source); // Make a copy of the source.
        delete(source.__copy_opts); // Remove the __copy_opts.
      }

      // Copy the properties.
      copyProps(source, target, opts);
    }
    else
    {
      throw new Error("Invalid function/object passed to copyInto()");
    }
  }

  return target;
}

/**
 * Clone a simple object, using the {@link Lum._.clone} function.
 *
 * By default it uses `Lum._.CLONE.JSON` mode for cloning, but this can
 * be adjusted as desired by passing a `cloneOpts.mode` option.
 *
 * Can also clone extended properties that aren't serialized in JSON.
 *
 * @param {object} object The object or function to clone.
 *
 * @param {object} [copyProperties] Use {@link Lum.copyProperties} as well.
 *
 *   If copyProperties is defined, and is a non-false value, then we'll
 *   call {@link Lum.obj.copy} after cloning to copy 'special' properties.
 *
 * @param {object} [cloneOpts] Options to send to {@link Lum._clone}
 *
 *   This can be any options supported by the {@link Lum._.clone} function.
 *
 * @return {object}  A clone of the object.
 *
 */
exports.clone = function(object, copyProperties, cloneOpts)
{
  if (!isObj(cloneOpts))
  {
    cloneOpts = {mode: clone.MODE.JSON};
  }

  if (copyProperties)
  {
    cloneOpts.copy = copyProperties;
  }

  //console.debug("Lum.obj.clone", object, copyProperties, cloneOpts);

  return clone(object, cloneOpts);
}

