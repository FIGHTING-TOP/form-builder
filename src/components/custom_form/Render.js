import ItemIcon from './ItemIcon';
import input from './control/Input';
import input2 from './control/Input2';
import checkbox from './control/CheckBox';
import radio from './control/Radio';
import select from './control/Select';
import text from './control/Text';
import cascader from './control/Cascader';
import title from './control/Title';
import hr from './control/Hr';
import p from './control/P';
import uploads from './control/Uploads';
import datepicker from './control/DatePicker';
import address from './control/Address';
import table from './control/TableMaker';

import trigger from './config/trigger';

const form_item = {
  title,
  hr,
  p,
  input,
  input2,
  select,
  radio,
  checkbox,
  datepicker,
  cascader,
  address,
  uploads,
  text,
  table,
};

export default {
  name: 'renders',
  render(h) {
    var $this = this;
    // 获取当前控件渲染
    const arr = (form_item[this.ele.toLowerCase()] && form_item[this.ele.toLowerCase()](this, h)) || [];
    // 拥有绑定的值，需回填到控件
    this.$set(this.obj, 'value', typeof this.value !== "undefined" ? this.value : this.obj.value);
    // 显示配置按钮并且控件允许被配置
    const item_icon = this.configIcon && this.obj.config ? ItemIcon(this, h) : [];
    // 已被绑定name,且require为必填,视为校验字段
    const validate = !!this.obj.name && !!this.obj.require;
    // 非 Title Hr P 需要FormItem
    if (['title', 'hr', 'p'].indexOf((this.ele.toLowerCase())) < 0) {

      let FormItem = {
        class: {
          'items': true,
          'sortable-items-required': validate
        },
        props: {
          label: (this.obj.label || this.ele) + '：',
          // 指定验证name
          prop: this.obj.name || 'temp',
          // 验证规则
          rules: {
            required: validate,
            message: this.obj.ruleError || '该项为必填项',
            trigger: trigger[this.obj.type],
            validator: (rule, value, callback) => {
              // 没有配置按钮并且允许验证
              if (!this.configIcon && validate && (Array.isArray(value) ? !value.length : !value)) {
                callback(new Error('该项为必填项'));
              } else {
                callback();
              }
            }
          },
        },
        style: {
          // 是否显示行内元素
          display: this.obj.inlineBlock ? 'inline-block' : 'block',
          // 行内元素width为30%
          width: this.obj.inlineBlock ? '50%' : 'auto',
        }
      };
      return h(
        "FormItem", FormItem,
        arr.concat(item_icon)
      );
    } else {
      return h(
        "div", {
          style: {
            'position': 'relative'
          },
          class: 'items',
        },
        arr.concat(item_icon)
      );
    }
  },
  methods: {
    hasChecked(v) {
      if (this.obj.type === 'radio') {
        return this.obj.value === v
      } else if (this.obj.type === 'checkbox') {
        return this.obj.value.indexOf(v) >= 0
      }
    }
  },
  props: {
    // 当前控件的类型
    ele: {
      type: String,
      default: "input"
    },
    // 当前控件的配置
    obj: {
      type: Object,
      default() {
        return {};
      }
    },
    // 当前控件的index,config 和 delete 会用到
    index: {
      type: Number,
      default: 0
    },
    // 整个表单的数据
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    // 是否显示配置按钮
    configIcon: {
      type: Boolean,
      default: false
    },
    // 当前控件绑定的值 方便数据回填
    value: [String, Number, Array],
    // 当前被clone控件列表
    sortableItem: {
      type: Array,
      default() {
        return [];
      }
    },
  }
}
