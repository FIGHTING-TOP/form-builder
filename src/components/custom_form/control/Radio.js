import optionsItem, {formOptions} from "../widgets/optionItem";

export default (_self, h) => {
  let options = [];
  _self.obj.items.map(v => {
    options.push(h("input", {
      domProps: {
        type: 'radio',
        checked: _self.hasChecked(v.label_value),
        onclick: () => {
          _self.obj.value = v.label_value
        }
      }
    }));
    v.label_content.map((it) => {
      options.push(formOptions(it,h))
    })
  });
  return [
    h("div", {
      class: 'option'
    }, options)
  ];
};

export let radioConf = {
  // 对应数据库内类型
  type: 'radio',
  // 是否可配置
  config: true,
  // 控件左侧label内容
  label: '单选框',
  // 是否显示行内元素
  inlineBlock: false,
  // 是否必填
  require: true,
  // 绑定的值
  value: '',
  // 选项内数据
  items: optionsItem,
  // 表单name
  name: '',
  // 验证错误提示信息
  ruleError: '请选择',
  // 是否关联字段
  relation: false,
  // 关联字段name
  relation_name: '',
  // 关联字段value
  relation_value: '',
  // 是否被渲染
  visibility: true
}
