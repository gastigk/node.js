const { fileURLToPath } = require('url');
const { dirname } = require('path');
const __filename_utils = fileURLToPath(import.meta.url);
const __dirname_utils = dirname(__filename_utils);

module.exports = { __dirname_utils };
