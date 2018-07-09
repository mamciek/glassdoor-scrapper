const fs = require('fs')
const util = require('util')
const logger = require('./logger.js')

const readFile = util.promisify(fs.readFile)

const load = async (filename) => {
  try {
    logger.info('Loading auth file: %s', filename)
    const json = await readFile(filename)
    return JSON.parse(json)
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.error(`Auth file '${filename}' does not exist. Please create one`)
      process.exit(1)
    }
    throw e
  }
}

module.exports = {
  load
}
