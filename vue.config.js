const webpack = require('webpack')

module.exports = {
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://api.botcms.siworks.org/',
        ws: true,
        changeOrigin: true,
      },
    },
  },
}
