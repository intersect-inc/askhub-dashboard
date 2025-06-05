/* eslint-disable quotes */
const path = require('path')

module.exports = {
  '*.{js,ts,tsx}': (absolutePaths) => {
    const cwd = process.cwd()
    const relativePaths = absolutePaths
      .map((file) => path.relative(cwd, file))
      .join(' ')
    return [
      "bash -c 'tsc --noEmit'",
      `eslint ${relativePaths} --max-warnings 0`,
    ]
  },
}
