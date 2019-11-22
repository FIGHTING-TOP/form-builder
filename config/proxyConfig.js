module.exports = {
  proxy: {
    '/hxk': { //将www.exaple.com印射为/apis
      target: 'http://192.168.1.100:9081', // 接口域名
      // target: 'http://192.168.30.166:9081', // 接口域名
      changeOrigin: true, //是否跨域
      pathRewrite: {
        '^/hxk': '/hxk' //需要rewrite的,
      }
    }
  }
}
