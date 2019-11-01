module.exports = {
  proxy: {
    '/rest': { //将www.exaple.com印射为/apis
      // target: 'http://192.168.1.100:9081/hxk-biz', // 接口域名
      target: 'http://192.168.30.166:9081/hxk-biz', // 接口域名
      changeOrigin: true, //是否跨域
      pathRewrite: {
        '^/rest': '/rest' //需要rewrite的,
      }
    }
  }
}
