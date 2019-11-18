import optionsItem, {formOptions} from "../widgets/optionItem";

export default (_self, h) => {
  let options = [];
  _self.obj.items.map((v, i) => {
    options.push(h("input", {
      domProps: {
        type: 'checkbox',
        checked: _self.hasChecked(v.label_value),
        onclick: () => {
          if (!_self.hasChecked(v.label_value)) {
            // option根据mutexIndex互斥，mutexIndex从1开始
            if (_self.obj.hasMutex) {
              if (_self.obj.mutexIndex - 1 === i) {
                _self.obj.value = [v.label_value]
              } else {
                let idx = _self.obj.value.indexOf(_self.obj.items[_self.obj.mutexIndex-1].label_value);
                if(idx>=0) _self.obj.value.splice(idx, 1);
                _self.obj.value.push(v.label_value)
              }
            } else {
              _self.obj.value.push(v.label_value)
            }
          } else {
            _self.obj.value.splice(_self.obj.value.indexOf(v.label_value), 1)
          }

          // 清空未选的option备注内容
          _self.obj.items.map(val => {
            if (_self.obj.value.indexOf(val.label_value) < 0) {
              val.label_content.map((it) => {
                if (it.type === 'comments' || it.type === 'date') {
                  it.value = ''
                }
              })
            }
          })

        }
      }
    }));
    v.label_content.map((it) => {
      options.push(formOptions(it, h))
    })
  });
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
  hasMutex: false,
  // 每个选项独占一行
  bigOption: false
}
