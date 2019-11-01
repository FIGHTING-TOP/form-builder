import optionsItem, {formOptions} from "../widgets/optionItem";

export default (_self, h) => {
  let options = [];
  _self.obj.items.map(v => {
    options.push(h("input", {
      domProps: {
        type: 'checkbox',
        checked: _self.hasChecked(v.label_value),
        onclick: (e) => {
          if (e.target.checked) {
            // option的第一个选项内容以‘无’开头，则和其他option互斥
            if(_self.obj.hasMutex){
              if(v.label_content[0].type==='property'&&v.label_content[0].value.indexOf('无')===0){
                _self.obj.value = [v.label_value]
              }else{
                // 我们要求互斥的选项必须为第一个选项
                let i = _self.obj.value.indexOf('1');
                if(i>=0)_self.obj.value.splice(i,1);
                _self.obj.value.push(v.label_value)
              }
            }else{
              _self.obj.value.push(v.label_value)
            }
          } else {
            _self.obj.value.splice(_self.obj.value.indexOf(v.label_value), 1)
          }
        }
      }
    }))
      v.label_content.map((it) => {
        options.push(formOptions(it,h))
    })
  })
  return [
    h("div", {
      class: 'option'
    }, options)
  ];
};

export let checkBoxConf = {
  // 对应数据库内类型
  type: 'checkbox',
  // 是否可配置
  config: true,
  // 控件左侧label内容
  label: '多选框',
  // 是否显示行内元素
  inlineBlock: false,
  // 是否必填
  require: true,
  // 绑定的值
  value: [],
  // 选项内数据
  items: optionsItem,
  // 表单name
  name: '',
  // 验证错误提示信息
  ruleError: '该选项不能为空',
  // 是否关联字段
  relation: false,
  // 关联字段name
  relation_name: '',
  // 关联字段value
  relation_value: '',
  // 是否被渲染
  visibility: true,
  // 是否含有互斥
  hasMutex: false
}
