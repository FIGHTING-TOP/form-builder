export default (_self, h) => {
  return [
    h("Input", {
      props: {
        placeholder: _self.obj.placeholder || "这是一个输入框",
        maxlength: parseInt(_self.obj.maxLength) || 20,
        value: _self.obj.value || ""
      },
      on: {
        "on-change": function(val) {
          if (!_self.obj.name) {
            return false;
          }
          _self.obj.value = event.currentTarget.value;
          _self.$emit('handleChangeVal', val.currentTarget.value)
        }
      }
    })
  ];
};


export let inputConf = {
  // 对应数据库内类型
  type: 'input',
  // 是否可配置
  config: true,
  // 控件左侧label内容
  label: '输入框',
  // 占位符
  placeholder: '',
  // 是否显示行内元素
  inlineBlock: false,
  // 是否必填
  require: true,
  // 最大长度
  maxLength: 20,
  // 输入框值
  value: '',
  // 校验规则
  rules: {
    noLimit: {name:'不设置',rule:null},
    mobile: {name:'手机',rule:/^1[3-9][0-9]{9}$/},
    telephone: {name:'座机',rule:/^(0[\d]{2,3}-?)\d{6,8}(-?\d{3,4})?$/},
    number: {name:'纯数字',rule:/^[0-9]+$/},
    float1: {name:'浮点数限制(5,2)',rule:/^(([1-9]{1}[0-9]{0,4})|([1-9]{1}[0-9]{0,4}\.[0-9]{1,2})|(0\.[0-9]{1,2})|0)$/},
    float2: {name:'浮点数限制(4,2)',rule:/^(([1-9]{1}[0-9]{0,3})|([1-9]{1}[0-9]{0,3}\.[0-9]{1,2})|(0\.[0-9]{1,2})|0)$/},
    float3: {name:'浮点数限制(4,1)',rule:/^(([1-9]{1}[0-9]{0,3})|([1-9]{1}[0-9]{0,3}\.[0-9]{1})|(0\.[0-9]{1})|0)$/},
    float4: {name:'浮点数限制(3,1)',rule:/^(([1-9]{1}[0-9]{0,2})|([1-9]{1}[0-9]{0,2}\.[0-9]{1})|(0\.[0-9]{1})|0)$/},
    float5: {name:'浮点数限制(6,2)',rule:/^(([1-9]{1}[0-9]{0,5})|([1-9]{1}[0-9]{0,5}\.[0-9]{1,2})|(0\.[0-9]{1,2})|0)$/},
  },
  myRule: 'noLimit',
  // 表单name
  name: '',
  // 验证错误提示信息
  ruleError: '该字段不能为空',
  // 是否关联字段
  relation: false,
  // 关联字段name
  relation_name: '',
  // 关联字段value
  relation_value: '',
  // 是否被渲染
  visibility: true
};
