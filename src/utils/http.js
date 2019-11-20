import axios from 'axios';

// axios.defaults.baseURL = '/apis';

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
      this.$Modal.error({
        title: '错误',
        content: r.data.msg
      });
      throw new Error()
    }
  } catch (e) {
    throw e;
  }
};

export const $http = axios;
