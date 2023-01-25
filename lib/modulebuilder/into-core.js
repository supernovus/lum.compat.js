const core = require('@lumjs/core');

/**
 * A helper for building modules «Lazy»
 * 
 * @name module:@lumjs/core.ModuleBuilder
 * @see module:@lumjs/core/modulebuilder
 * @deprecated
 */
core.lazy(core, 'ModuleBuilder', () => require('./index'), E);

/**
 * Return a set of functions for building a module.
 * 
 * @alias module:@lumjs/core.buildModule
 * @see module:@lumjs/core/modulebuilder.build 
 * @deprecated
 */
core.buildModule = function(m,o) 
{ 
  return core.ModuleBuilder.build(m,o); 
}

/**
 * Create a new `ModuleBuilder` instance.
 * 
 * @alias module:@lumjs/core.newBuilder
 * @see module:@lumjs/core/modulebuilder.new
 * @deprecated
 */
core.newBuilder = function(m, o)
{
  return core.ModuleBuilder.new(m,o);
}
