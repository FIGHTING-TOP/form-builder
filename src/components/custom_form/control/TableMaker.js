export default (_self, h, isEdit) => {
  let rows = [];
  for (let x in _self.obj.tableContent) {
    let sRow = [];
    for (let y in _self.obj.tableContent[x]) {
      let sTd = [];
      let buttonGroup;
      const tableInputItem = v => {
        if(isEdit){
          buttonGroup = [
            h('button',{
              domProps: {
                onclick:()=>{
                  if (_self.obj.tableContent[x][y] instanceof Array) {
                    _self.obj.tableContent[x][y].push('')
                    _self.obj.tableContent = Object.assign({},{},_self.obj.tableContent)
                  }else{
                    _self.obj.tableContent[x][y] = [_self.obj.tableContent[x][y],''];
                    _self.obj.tableContent = Object.assign({},{},_self.obj.tableContent)
                  }
                }
              }
            },['添加']),
            h('button',{},['删除'])
          ];
        }
        return h(
          'div', {class: 'tableInputItem'},
          [
            h('input', {
              domProps: {
                type: 'text',
                value: v
              }
            }),
          ].concat(buttonGroup)
        )
      };
      if (_self.obj.tableContent[x][y] instanceof Array) {
        _self.obj.tableContent[x][y].map(v => {
          sTd.push(tableInputItem(v))
        })
      }else{
        sTd.push(tableInputItem(_self.obj.tableContent[x][y]))
      }
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
    0: ['', '', ''],
    1: ['', '', '']
  }
}
