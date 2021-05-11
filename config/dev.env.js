'use strict'

const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URL: '"http://127.0.0.1:8000"',
  SERVER_FILES_URL: '"http://127.0.0.1:8000/uploads/"',
})
