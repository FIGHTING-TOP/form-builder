import render from "./Render";
import uploadCustom from './components/Uploads/upload';
import preview from './Preview';
import mTable from './MTable';
import options from './Options';

const customForm = {
  render,
  uploadCustom,
  preview,
  mTable,
  options
};

const install = function(Vue, opts = {}) {
  Vue.component(render.name, render);
  Vue.component(uploadCustom.name, uploadCustom);
  Vue.component(preview.name, preview);
  Vue.component(options.name, options);
  Vue.component(mTable.name, mTable);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default Object.assign(customForm, { install });
