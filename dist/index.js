
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./tokenlists.cjs.production.min.js')
} else {
  module.exports = require('./tokenlists.cjs.development.js')
}
