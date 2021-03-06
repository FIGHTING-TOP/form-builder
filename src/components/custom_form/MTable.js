import table from "./control/TableMaker";
import {rules} from './inputRegExpRules'

export default {
  name: 'myTable',
  render(h) {
    // 表格行和列的添加和删除按钮
    const buttonGroup = [
      h('button', {
        domProps: {
          onclick: () => {
            let rowContent = [];
            for (let y in this.obj.tableContent[0]) {
              rowContent.push([{
                type: 'input',
                value: '',
                maxLength: 10,
                rules,
                myRule: 'noLimit',
                placeholder: '请输入'
              }])
            }
            this.obj.tableContent[Object.keys(this.obj.tableContent).length] = rowContent;
            this.obj.tableContent = Object.assign({}, {}, this.obj.tableContent)
          }
        }
      }, ['加一行']),
      h('button', {
        domProps: {
          onclick: () => {
            let keys = Object.keys(this.obj.tableContent);
            if (keys.length > 1) {
              delete this.obj.tableContent[Math.max.apply(null, keys)];
              this.obj.tableContent = Object.assign({}, {}, this.obj.tableContent)
            } else {
              this.$Modal.warning({
                title: '注意',
                content: '最少一行'
              });
            }
          }
        }
      }, ['减一行']),
      h('button', {
        domProps: {
          onclick: () => {
            for (let x in this.obj.tableContent) {
              if(x==0){
                this.obj.tableContent[x].push([{
                  type: 'text',
                  value: '',
                  placeholder: '请输入'
                }])
              }else{
                this.obj.tableContent[x].push([{
                  type: 'input',
                  value: '',
                  maxLength: 10,
                  rules,
                  myRule: 'noLimit',
                  placeholder: '请输入'
                }])
              }
            }
            // this.$set(this.obj, 'items', o);
          }
        }
      }, ['加一列']),
      h('button', {
        domProps: {
          onclick: () => {
            if (this.obj.tableContent[0].length > 1) {
              for (let x in this.obj.tableContent) {
                this.obj.tableContent[x].pop()
              }
            } else {
              this.$Modal.warning({
                title: '注意',
                content: '最少一列'
              });
            }
          }
        }
      }, ['减一列']),
    ];
    return h(
      'div',
      {class: 'tableWrap'},
      buttonGroup.concat(table(this, h, 1))
    )
  },
  methods: {},
  props: {
    // 当前控件的配置
    obj: {
      type: Object,
      default() {
        return {};
      }
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
