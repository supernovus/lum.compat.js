/**
 * Lum.js v4 compatibility set.
 * 
 * Now uses lazy-loading for all properties.
 * 
 * @module @lumjs/compat/v4
 */

const {lazy} = require('@lumjs/core/types');

const E = lazy.def.e;

/**
 * @name module:@lumjs/compat/v4.descriptors
 * @see module:@lumjs/compat/v4/descriptors
 */
lazy(exports, 'descriptors', () => require('./descriptors'), E);

/**
 * @name module:@lumjs/compat/v4.DESC
 * @see module:@lumjs/compat/v4/descriptors.DESC
 */
lazy(exports, 'DESC', () => exports.descriptors.DESC, E);

/**
 * @name module:@lumjs/compat/v4.prop
 * @see module:@lumjs/compat/v4/prop
 */
lazy(exports, 'prop', () => require('./prop'), E);

/**
 * @name module:@lumjs/compat/v4.deprecated
 * @see module:@lumjs/compat/v4/deprecated
 */
lazy(exports, 'deprecated', () => require('./deprecated'), E);

/**
 * @name module:@lumjs/compat/v4.LoadTracker
 * @see module:@lumjs/compat/v4/loadtracker
 */
lazy(exports, 'LoadTracker', () => require('./loadtracker'), E);

/**
 * @name module:@lumjs/compat/v4.Promise
 * @see module:@lumjs/compat/v4/promise
 */
lazy(exports, 'Promise', () => require('./promise'), E);

/**
 * @name module:@lumjs/compat/v4.obj
 * @see module:@lumjs/compat/v4/object-helpers
 */
lazy(exports, 'obj', () => require('./object-helpers'), E);
