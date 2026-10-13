'use strict';

// node:test also emits TAP when imported directly. This runner avoids the
// child-process requirement of `node --test` in restricted environments.
require('./core.test.js');
require('./data.test.js');
require('./content-expansion.test.js');
require('./advanced.test.js');
require('./practice.test.js');
require('./grammar-refresh.test.js');
require('./pronoun-refresh.test.js');
require('./connections.test.js');
