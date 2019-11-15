# 基于Vue实现自定义表单控件

> 新项目需要用到工作流设定 + 自定义表单控件，这里列出了自定义表单控件的代码实现,可实现自定义表单控件,可拖拽排序，自定义属性

## TODO

- 1、标题 是纯文本，不需要匹配数据库字段                                              ✔
- 2、地址选择 应包括名称和编码                                                       ✔
- 3、radio 、checkbox  的 每个选择项都要能设置 value  name  比如 0 男/1 女            ✔
- 4、单选、多选 排斥处理 （无 与 别的选项，选择需互斥，包括填写的输入框都置为空）         ✔
- 5、选择字段， 字段的中文名称可编辑                                                  ✔

- radio 、checkbox内部 文本框 也要加判断限制（比如 文本长度，正则验证）                 ✔
- 文本框 可追加描述
- 文本验证：中英文混合验证
- table的输入框 可能是日期选择                                                       ✔
- table 的输入框也需要加验证

## 运行使用

``` bash

npm install
npm start

```

### 文件目录

```
.
├── README.md
├── build
├── config
├── dist
├── index.html
├── package.json
├── src
│   ├── App.vue
│   ├── assets
│   ├── components
│   │   ├── custom_form             //自定义表单组件
│   │   │   ├── FormList.js         //表单列表    
│   │   │   ├── ItemIcon.js         //表单图标配置
│   │   │   ├── Render.js           //表单列表渲染
│   │   │   ├── components          //表单公用组件
│   │   │   │   └── Uploads         //上传组件
│   │   │   │       └── upload.vue
│   │   │   ├── config              //配置文件
│   │   │   │   ├── area.js         //地区配置
│   │   │   │   └── trigger.js      //表单验证触发事件
│   │   │   ├── control             //表单控件列表
│   │   │       ├── Address.js      //地区选择
│   │   │       ├── Cascader.js     //多级联动
│   │   │       ├── CheckBox.js     //多选框
│   │   │       ├── DatePicker.js   //时间选择器
│   │   │       ├── Hr.js           //hr标签
│   │   │       ├── Input.js        //输入框
│   │   │       ├── P.js            //p标签
│   │   │       ├── Radio.js        //单选框
│   │   │       ├── Select.js       //下拉选择框
│   │   │       ├── Text.js         //文本域
│   │   │       ├── Title.js        //标题
│   │   │       └── Uploads.js      //上传控件
│   │   │   └── index.js            //控件注册
│   │   ├── index.vue               //自定义表单页面
│   │   └── render.vue              //表单渲染,数据回填页面
│   ├── main.js                     //入口文件
│   └── router                      //路由配置
│       └── index.js
└── static                          //静态数据模版
    ├── label.1.json
    ├── label.12.json
    ├── label.14.json
    ├── label.17.json
    ├── label.19.json
    ├── label.3.json
    ├── label.5.json
    ├── label.8.json
    └── label.json
```

相关插件：
- [Vue.Draggable](https://github.com/SortableJS/Vue.Draggable)
- [Vue.js](https://vuejs.org/)
- [iView](https://www.iviewui.com/docs/guide/install)

### 更多参考
- https://github.com/mrabit/vue-formbuilder
- http://112.74.43.150/
- http://dobtco.github.io/formbuilder/
