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
//exports.descriptors = require('./descriptors');

/**
 * @name module:@lumjs/compat/v4.DESC
 * @see module:@lumjs/compat/v4/descriptors.DESC
 */
from('descriptors', true, 'DESC');
//exports.DESC = exports.descriptors.DESC;

/**
 * @name module:@lumjs/compat/v4.prop
 * @see module:@lumjs/compat/v4/prop
 */
can('prop');
//exports.prop = require('./prop');

/**
 * @name module:@lumjs/compat/v4.deprecated
 * @see module:@lumjs/compat/v4/deprecated
 */
can('deprecated');
//exports.deprecated = require('./deprecated');

/**
 * @name module:@lumjs/compat/v4.LoadTracker
 * @see module:@lumjs/compat/v4/loadtracker
 */
can('LoadTracker', {module: './loadtracker'});
//exports.LoadTracker = require('./loadtracker');

/**
 * @name module:@lumjs/compat/v4.Promise
 * @see module:@lumjs/compat/v4/promise
 */
can('Promise', {module: './promise'});
//exports.Promise = require('./promise');

/**
 * @name module:@lumjs/compat/v4.obj
 * @see module:@lumjs/compat/v4/object-helpers
 */
can('obj', {module: './object-helpers'});
//exports.obj = require('./object-helpers');
