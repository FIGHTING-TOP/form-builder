export default [
  {
    "label_value": "1",
    "label_content": [
      {
        type: 'property',
        value: '选项1'
      }
    ]
  }
]

export const optionsItemTypes = [
  {
    type: 'property',
    value: '选项1',
    btnText: '追加选项内容'
  },
  {
    type: 'comments',
    value: '',
    btnText: '追加备注'
  },
  {
    type: 'date',
    value: '',
    btnText: '追加时间'
  }
];

const property = (it, h, isEdit) => {
  if (isEdit) {
    return h("input", {
      domProps: {
        type: 'text',
        value: it.value,
        typeName: it.type,
        onclick(e) {
          console.log(e.target.value)
        }
      }
    })
  } else {
    return h("span", {
        domProps: {},
      },
      it.value
    )
  }
};
const comments = (it, h, isEdit) => {
  if (isEdit) {
    return h("input", {
      domProps: {
        type: 'text',
        value: it.value,
        typeName: it.type,
        onclick(e) {
          console.log(e.target.value)
        }
      }
    })
  } else {
    return h("input", {
      domProps: {
        type: 'text',
        typeName: it.type,
        onclick(e) {
          console.log(e.target.value)
        }
      }
    })
  }
};
const date = (it, h, isEdit) => {
  if (isEdit) {
    return h('DatePicker', {
      props: {
        placeholder: it.placeholder || (it.name ? "" : "请选择日期"),
        type: (!it.format || it.format == 'yyyy年MM月dd日') ? 'date' : 'datetime',
        format: it.format || 'yyyy年MM月dd日',
        value: it.value
      },
      on: {
        "on-change"(arr) {

        }
      }
    })
  } else {
    return h('DatePicker', {
      props: {
        placeholder: it.placeholder || (it.name ? "" : "请选择日期"),
        type: (!it.format || it.format == 'yyyy年MM月dd日') ? 'date' : 'datetime',
        format: it.format || 'yyyy年MM月dd日',
        value: it.value
      },
      on: {
        "on-change"(arr) {

        }
      }
    })
  }
};

export const optionsItems = (it, h, isEdit) => {
  let handler = {
    property,
    comments,
    date
  }
  return handler[it.type](it, h, isEdit)
};
