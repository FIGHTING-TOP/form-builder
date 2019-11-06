import trigger from './config/trigger';
import option, {optionItemBtn, formOptions} from "./widgets/optionItem";

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
            let obj = JSON.parse(JSON.stringify(option[0]));
            let i = 1;
            this.obj.items.map((v) => {
              if (v.label_value > i) i = v.label_value
            });
            obj.label_value = i + 1;
            this.$set(this.obj, 'items', this.obj.items.concat([obj]));
          }
        }
      }, ['添加']),
      h('button', {
        domProps: {
          onclick: () => {
            if (this.obj.items.length > 1) {
              this.obj.items.splice(this.index, 1);
            } else {
              this.$Modal.warning({
                title: '注意',
                content: '最少一个option'
              });
            }
          }
        }
      }, ['删除'])
    ];

    let checkGroupItem = [
      h("input", {
        domProps: {
          type: this.obj.type,
          checked: this.hasChecked(),
          onclick: (e) => {
            if (e.target.checked) {
              if (this.obj.type === 'radio') {
                this.obj.value = this.ele.label_value
              } else {
                this.obj.value.push(this.ele.label_value)
              }
            } else {
              this.obj.value.splice(this.obj.value.indexOf(this.ele.label_value), 1)
            }
          }
        }
      }),
    ];
    this.ele.label_content.map((it, i) => {
      checkGroupItem.push(formOptions(it, h, 1));
      checkGroupItem.push(h('button', {
        domProps: {
          onclick: () => {
            this.ele.label_content.splice(i, 1)
          }
        }
      }, ['删除']))
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
          optionItemBtn(this, h)
        ),
        h("div", {
            class: 'option'
          },
          checkGroupItem.concat(groupBtn)
        )
      ]
    );
  },
  methods:{
    hasChecked(v){
      if(this.obj.type==='radio'){
        return this.obj.value === this.ele.label_value
      }
      return this.obj.value&&this.obj.value.indexOf(this.ele.label_value)>=0
    }
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
