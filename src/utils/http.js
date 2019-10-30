import axios from 'axios';


// axios.defaults.baseURL = '/apis';

export const $get = (url) => {
  return new Promise((resolve, reject)=>{
    axios.get(url).then((r)=>{
      if (r.data.resultCode == 0) {
        resolve(r.data.data)
      } else {
        alert(r.data.msg)
      }
    }).catch((err)=>{
      console.log(err)
    });
  })
};

export const $post = async (url,params={}) => {
  try{
    let r = await axios.post(url,params);
    if (r.data && r.data.resultCode == 0) {
      return r.data.data
    } else {
      alert(r.data.msg);
    }
  }catch(e){
    console.log(e)
  }
};

export const $http = axios;
