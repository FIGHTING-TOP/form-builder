import {inputConf} from "./Input";

const textItem = {
  type: 'text',
  value: '',
  placeholder: '请输入'
};

const inputItem = {
  type: 'input',
  value: '',
  maxLength: 10,
  rules: inputConf.rules,
  myRule: 'noLimit',
  placeholder: '请输入'
};

const dateItem = {
  type: 'date',
  value: '',
  format: "yyyy年MM月dd日",
  placeholder: '请选择日期'
};


export default (_self, h, isEdit) => {
  let rows = [];
  for (let x in _self.obj.tableContent) {
    let sRow = [];
    for (let y in _self.obj.tableContent[x]) {
      let sTd = [];
      const tableInputItem = (v, i) => {
        if (isEdit) {
          let buttonGroup = [
            h('button', {
              domProps: {
                onclick: () => {
                  _self.obj.tableContent[x][y].push(textItem);
                  _self.obj.tableContent = Object.assign({}, {}, _self.obj.tableContent)
                }
              }
            }, ['添加文本']),
            h('button', {
              domProps: {
                onclick: () => {
                  _self.obj.tableContent[x][y].push(inputItem);
                  _self.obj.tableContent = Object.assign({}, {}, _self.obj.tableContent)
                }
              }
            }, ['加输入框']),
            h('button', {
              domProps: {
                onclick: () => {
                  _self.obj.tableContent[x][y].push(dateItem);
                  _self.obj.tableContent = Object.assign({}, {}, _self.obj.tableContent)
                }
              }
            }, ['添加时间']),
            h('button', {
              attrs: {'data-index': i},
              domProps: {
                onclick: (e) => {
                  if (_self.obj.tableContent[x][y] instanceof Array) {
                    if (_self.obj.tableContent[x][y].length > 1) {
                      _self.obj.tableContent[x][y].splice(e.target.dataset.index, 1);
                      _self.obj.tableContent = Object.assign({}, {}, _self.obj.tableContent)
                    } else {
                      _self.$Modal.warning({
                        title: '注意',
                        content: '最少要有一个输入框'
                      });
                    }
                  } else {
                    _self.$Modal.warning({
                      title: '注意',
                      content: '最少要有一个输入框'
                    });
                  }
                }
              }
            }, ['删除'])
          ];
          if (v.type === 'input') {
            return h(
              'div', {class: 'tableInputItem'},
              [
                h('input', {
                  attrs: {'data-index': i},
                  domProps: {
                    type: 'text',
                    value: v.value,
                    oninput(e) {
                      _self.obj.tableContent[x][y][e.target.dataset.index].value = e.target.value;
                    }
                  }
                }),
                h('button', {
                  domProps: {
                    onclick: () => {
                      _self.$emit('switchModal', {locationX: x, locationY: y, innerIndex: i})
                    }
                  }
                }, ['设置校验'])
              ].concat(buttonGroup)
            )
          } else if (v.type === "text") {
            return h(
              'div', {class: 'tableInputItem'},
              [
                h('input', {
                  attrs: {'data-index': i},
                  domProps: {
                    type: 'text',
                    value: v.value,
                    oninput(e) {
                      _self.obj.tableContent[x][y][e.target.dataset.index].value = e.target.value;
                    }
                  }
                }),
              ].concat(buttonGroup)
            )
          }
        } else {
          if (v.type === 'input') {
            return h('div', {class: 'tableInputItem'},
              [
                h('input', {
                  attrs: {'data-index': i},
                  domProps: {
                    type: 'text',
                    value: v.value,
                    oninput(e) {
                      _self.obj.tableContent[x][y][e.target.dataset.index].value = e.target.value;
                    }
                  }
                }),
              ]
            )
          } else if (v.type === 'text') {
            return h('span', {}, v.value)
          }
        }
        return h('DatePicker', {
          props: {
            placeholder: v.placeholder,
            type: (!v.format || v.format == 'yyyy年MM月dd日') ? 'date' : 'datetime',
            format: v.format || 'yyyy年MM月dd日',
            value: v.value
          },
          on: {
            "on-change"(arr) {
              v.value = arr;
            }
          }
        })
      };
      _self.obj.tableContent[x][y].map((v, i) => {
        sTd.push(tableInputItem(v, i))
      });
      sRow.push(h('td', {}, sTd))
    }
    rows.push(h('tr', {}, sRow))
  }
  return [
    h(
      'table', {class: 'dataTable'},
      [h('tbody', {}, rows)]
    )
  ]
}


export const tableConf = {
  type: 'table',
  config: true,
  label: '表格',
  tableContent: {
    0: [[textItem], [textItem], [textItem]],
    1: [[inputItem], [inputItem], [inputItem]]
  }
};
