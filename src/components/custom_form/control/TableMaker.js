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
                  _self.obj.tableContent[x][y].push('')
                  _self.obj.tableContent = Object.assign({}, {}, _self.obj.tableContent)
                }
              }
            }, ['添加']),
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
          return h(
            'div', {class: 'tableInputItem'},
            [
              h('input', {
                attrs: {'data-index': i},
                domProps: {
                  type: 'text',
                  value: v,
                  oninput(e) {
                    _self.obj.tableContent[x][y][e.target.dataset.index] = e.target.value;
                  }
                }
              }),
            ].concat(buttonGroup)
          )
        }
        return (v
          ? h('span', {}, v)
          : h('div', {class: 'tableInputItem'},
            [
              h('input', {
                attrs: {'data-index': i},
                domProps: {
                  type: 'text',
                  value: v,
                  oninput(e) {
                    _self.obj.tableContent[x][y][e.target.dataset.index] = e.target.value;
                  }
                }
              }),
            ]
          ))
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
    0: [[''], [''], ['']],
    1: [[''], [''], ['']]
  }
};
