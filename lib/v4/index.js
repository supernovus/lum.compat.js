/**
 * Lum.js v4 compatibility set.
 * 
 * Now uses lazy-loading for all properties.
 * 
 * @module @lumjs/compat/v4
 */

const {can,from} = require('@lumjs/core').buildModule(module);

/**
 * @name module:@lumjs/compat/v4.descriptors
 * @see module:@lumjs/compat/v4/descriptors
 */
can('descriptors');

/**
 * @name module:@lumjs/compat/v4.DESC
 * @see module:@lumjs/compat/v4/descriptors.DESC
 */
from('descriptors', true, 'DESC');

/**
 * @name module:@lumjs/compat/v4.prop
 * @see module:@lumjs/compat/v4/prop
 */
can('prop');

/**
 * @name module:@lumjs/compat/v4.deprecated
 * @see module:@lumjs/compat/v4/deprecated
 */
can('deprecated');

/**
 * @name module:@lumjs/compat/v4.LoadTracker
 * @see module:@lumjs/compat/v4/loadtracker
 */
can('LoadTracker', true);

/**
 * @name module:@lumjs/compat/v4.Promise
 * @see module:@lumjs/compat/v4/promise
 */
can('Promise', true);

/**
 * @name module:@lumjs/compat/v4.obj
 * @see module:@lumjs/compat/v4/object-helpers
 */
can('obj', './object-helpers');
