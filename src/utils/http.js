import axios from 'axios';

// 测试环境打包
axios.defaults.baseURL = '/hxk-biz';
// 线上环境打包
// axios.defaults.baseURL = '/hxk';

export const $get = (url) => {
  return new Promise((resolve, reject) => {
    axios.get(url).then((r) => {
      if (r.data.resultCode == 0) {
        resolve(r.data.data)
      } else {
        reject(r.data.msg)
      }
    }).catch((err) => {
      reject(err)
    });
  })
};

export const $post = async function (url, params = {}) {
  try {
    let r = await axios.post(url, params);
    if (r.data && r.data.resultCode == 0) {
      return r.data.data
    } else {
      throw r.data;
    }
  } catch (e) {
    this.$Modal.error({
      title: '错误',
      content: e.msg || '接口异常'
    });
    throw e;
  }
};

export const $http = axios;
