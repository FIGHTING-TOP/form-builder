import trigger from './config/trigger';
import {optionsItems,optionsItemTypes} from "./config/optionsItem";

export default {
  name: 'options',
  render(h) {
    // 拥有绑定的值，需回填到控件
    this.$set(this.obj, 'value', typeof this.value !== "undefined" ? this.value : this.obj.value);

    // 已被绑定name,且require为必填,视为校验字段
    const validate = !!this.obj.name && !!this.obj.require;

    // 单个option的按钮,添加和删除
    const groupBtn = [
      h('button', {
        domProps: {
          onclick: () => {
            let o = this.obj.items.concat([this.obj.items[0]]);
            this.$set(this.obj, 'items', o);
          }
        }
      }, ['添加']),
      h('button', {
        domProps: {
          onclick: () => {
            if (this.obj.items.length > 1) {
              this.obj.items.splice(this.index, 1);
            } else {
              alert('最少一个option')
            }
          }
        }
      }, ['删除'])
    ];

    // 为单个option添加字段的按钮
    const optionBtn = [];
    optionsItemTypes.map((val)=>{
      return optionBtn.push(h('span',{class:"label_item"},val.btnText))
    });

    let checkGroup = [
      h("input", {
        domProps: {
          type: 'checkbox',
          checked: this.ele.label_value,
          onclick(e) {
            console.log(e.target.checked)
          }
        }
      }),
    ];
    this.ele.label_content.map((it) => {
      checkGroup.push(optionsItems(it, h, 1))
    });

    // 设置该控件标记为显示
    // this.$emit('changeVisibility', this.index, true);
    let FormItem = {
      class: {
        'items': true,
        'sortable-items-required': validate
      },
      props: {
        // 指定验证name
        prop: this.obj.name || 'temp',
        // 验证规则
        rules: {
          required: validate,
          message: this.obj.ruleError || '该项为必填项',
          trigger: trigger[this.obj.type],
          validator: (rule, value, callback) => {
            // 没有配置按钮并且允许验证
            if (validate && (Array.isArray(value) ? !value.length : !value)) {
              callback(new Error('该项为必填项'));
            } else {
              callback();
            }
          }
        },
      },
      style: {
        display: 'block',
        width: 'auto',
      }
    };
    return h(
      "FormItem", FormItem,
      [
        h('div', {
            class: 'btnGroup'
          },
          optionBtn
        ),
        h("CheckboxGroup", {
            props: {
              value: this.obj.value || []
            },
            on: {
              'on-change': (arr) => {
                if (!this.obj.name) {
                  return false;
                }
                this.obj.value = arr;
                this.$emit('handleChangeVal', arr)
              }
            }
          },
          checkGroup.concat(groupBtn)
        )
      ]
    );

  },
  props: {
    // 当前控件的配置
    obj: {
      type: Object,
      default() {
        return {};
      }
    },
    ele: {
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
    // 当前控件绑定的值 方便数据回填
    value: [String, Number, Array],
  }
}
