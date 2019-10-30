import axios from 'axios';


// axios.defaults.baseURL = '/apis';

export const $get = async (url) => {
  let r = await axios.get(url);
  if (r.data.resultCode == 0) {
    return new Promise((resolve, reject)=>{
      resolve(r.data.data)
    })
  } else {
    alert(r.data.msg)
  }
};

export const $post = async (url,params={}) => {
  let r = await axios.post(url,params);
  if (r.data.resultCode == 0) {
    return new Promise((resolve, reject)=>{
      resolve(r.data.data)
    })
  } else {
    alert(r.data.msg)
  }
};

export const $http = axios;
