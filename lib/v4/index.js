/**
 * Lum.js v4 compatibility set.
 * @module @lumjs/compat/v4
 */

/**
 * @see module:@lumjs/compat/v4/descriptors
 */
exports.descriptors = require('./descriptors');

/**
 * @see module:@lumjs/compat/v4/descriptors.DESC
 */
exports.DESC = exports.descriptors.DESC;

/**
 * @see module:@lumjs/compat/v4/prop
 */
exports.prop = require('./prop');

/**
 * @see module:@lumjs/compat/v4/deprecated
 */
exports.deprecated = require('./deprecated');

/**
 * @see module:@lumjs/compat/v4/loadtracker
 */
exports.LoadTracker = require('./loadtracker');

/**
 * @see module:@lumjs/compat/v4/promise
 */
exports.Promise = require('./promise');

/**
 * @see module:@lumjs/compat/v4/object-helpers
 */
exports.obj = require('./object-helpers');
