<template>
  <div>
    <Modal v-model="showModal1"
           width="50%"
           footer-hide
           :title="'先要选择一个表'"
           :mask-closable="false">
      <Select v-model="tableName" @on-change="handleTableNameChange">
        <Option v-for="(item,index) in tableList" :value="item.tableName" :key="index">{{ item.tableDesc }}</Option>
      </Select>
    </Modal>
    <h1 v-if="typeof $route.params.addNew == 'undefined'">
      当前表：<span v-for="(item,index) in tableList" v-if="tableName===item.tableName"
                :key="index">{{item.tableDesc}}</span>
      <button @click="(showModal1=true)">切换表</button>
    </h1>
    <div class="container">
      <i-row>
        <i-col span="3" class="sortable_container">
          <div style="width: 150px;position: fixed;">
            <Form :label-width="100" class="b-a">
              <draggable :clone="cloneData" :list="form_list" :options="dragOptions1">
                <transition-group class="form-list-group" type="transition" :name="'flip-list'" tag="div">
                  <template v-for="(element,index) in form_list">
                      <span class="label_item" :key="index" :class="{odd:index%2===0}">{{element.obj.label}}</span>
                  </template>
                </transition-group>
              </draggable>
            </Form>
          </div>
        </i-col>
        <i-col span="21" class="sortable_items" push="3">
          <Form ref="formValidate" class="b-a" :label-width="100" :model="formData" @submit.native.prevent>
            <!--          <Alert style="margin: 15px 15px 0;" type="warning" show-icon>未绑定数据字典控件无效</Alert>-->
            <draggable :list="sortable_items" :options="dragOptions2">
              <transition-group class="form-list-group" type="transition" :name="'flip-list'" tag="div">
                <template v-for="(element,index) in sortable_items">
                  <renders @handleRemoveEle="removeEle" @handleConfEle="confEle"
                          :key="index"
                          :index="index" :ele="element.ele" :obj="element.obj || {}"
                          :data="formData" @handleChangeVal="val => handleChangeVal(val,element)"
                          :sortableItem="sortable_items" :config-icon="true">
                  </renders>
                </template>
              </transition-group>
            </draggable>
            <FormItem>
              <Button type="primary" @click="handlePreview()">预览</Button>
              <Button type="success" @click="handleSubmit()" style="margin-left: 8px">保存</Button>
              <Button type="warning" @click="handleReset()" style="margin-left: 8px">重置</Button>
            </FormItem>
          </Form>
        </i-col>
        <Modal v-model="showModal"
               width="100%"
               :title="'配置' + modalFormData.modalTitle + '属性'"
               :mask-closable="false">
          <Form class="form_content" :label-width="80" :model="modalFormData" ref="modalFormData">
            <FormItem label="字段名称：" v-if="showOptions(0)">
              <Select v-model="modalFormData.name" @on-change="saveNameDesc">
                <Option v-for="(item,index) in nameList" :value="item.fieldName" :key="index">
                  {{ item.fieldDesc }}
                </Option>
              </Select>
              <i-input v-model="modalFormData.label" placeholder="请输入字段名称"></i-input>
            </FormItem>
            <!--            title,p内容-->
            <FormItem label="内容：" v-if="!showOptions(0)">
              <i-input v-model="modalFormData.label" placeholder="请输入内容"></i-input>
            </FormItem>
            <FormItem label="数据字典：" v-if="showOptions(1)">
              <options v-for="(element,index) in modalFormData.items" :key="index"
                       :index="index" :obj="modalFormData || {}" :ele="element"
                       @switchModal="switchModal"
                       :data="formData" @handleChangeVal="val => handleChangeVal(val,element)">
              </options>
            </FormItem>
            <FormItem label="每个选项独占一行：" v-if="showOptions(1)">
              <Checkbox v-model="modalFormData.bigOption">是</Checkbox>
            </FormItem>
            <FormItem label="占位符：" v-if="typeof modalFormData.placeholder != 'undefined'">
              <i-input v-model="modalFormData.placeholder" placeholder="请输入placeholder"></i-input>
            </FormItem>
            <FormItem label="单位：" v-if="typeof modalFormData.append != 'undefined'">
              <i-input v-model="modalFormData.append" placeholder="请输入单位"></i-input>
            </FormItem>
            <FormItem label="最大长度：" v-if="typeof modalFormData.maxLength != 'undefined'">
              <InputNumber v-model="modalFormData.maxLength" placeholder="请输入文本限制最大长度">
              </InputNumber>
            </FormItem>
            <FormItem label="最大限制：" v-if="typeof modalFormData.maxSize != 'undefined'">
              <InputNumber :formatter="value => `${value}kb`" :parser="value => value.replace('kb', '')"
                           v-model="modalFormData.maxSize" placeholder="请输入上传文件最大限制">
              </InputNumber>
            </FormItem>
            <FormItem label="上边距：" v-if="typeof modalFormData.marginTop != 'undefined'">
              <InputNumber :formatter="value => `${value}px`" :parser="value => value.replace('px', '')"
                           v-model="modalFormData.marginTop" placeholder="请输入标签上边距">
              </InputNumber>
            </FormItem>
            <FormItem label="下边距：" v-if="typeof modalFormData.marginBottom != 'undefined'">
              <InputNumber :formatter="value => `${value}px`" :parser="value => value.replace('px', '')"
                           v-model="modalFormData.marginBottom" placeholder="请输入标签下边距">
              </InputNumber>
            </FormItem>
            <FormItem label="详细地址：" v-if="typeof modalFormData.details_address != 'undefined'">
              <Checkbox v-model="modalFormData.details_address">是否需要详细地址</Checkbox>
            </FormItem>
            <FormItem label="是否必填：" v-if="typeof modalFormData.require != 'undefined'">
              <Checkbox v-model="modalFormData.require">必填</Checkbox>
            </FormItem>
            <FormItem label="校验规则：" v-if="typeof modalFormData.rules != 'undefined'">
              <Select v-model="modalFormData.myRule">
                <Option v-for="(item,key,index) in modalFormData.rules" :value="key" :key="index">{{ item.name }}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="校验错误：" v-if="typeof modalFormData.ruleError != 'undefined'">
              <i-input v-model="modalFormData.ruleError" placeholder="请输入校验错误提示"></i-input>
            </FormItem>
            <FormItem label="是否多选："
                      v-if="typeof modalFormData.multiple != 'undefined' && modalFormData.type != 'address'">
              <Checkbox v-model="modalFormData.multiple">多选</Checkbox>
            </FormItem>
            <FormItem label="是否互斥："
                      v-if="typeof modalFormData.hasMutex != 'undefined'">
              <Checkbox v-model="modalFormData.hasMutex">含有互斥</Checkbox>
              <span style="margin-left: 10px" v-if="modalFormData.hasMutex">
                互斥项为第<input type="text" v-model="modalFormData.mutexIndex" style="width:50px">项
                （从 1 开始算）
              </span>
            </FormItem>
            <FormItem label="时间格式：" v-if="typeof modalFormData.format != 'undefined'">
              <RadioGroup v-model="modalFormData.format">
                <Radio label="yyyy年MM月dd日"></Radio>
                <Radio label="yyyy-MM-dd HH:mm"></Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="行内元素：" v-if="typeof modalFormData.inlineBlock != 'undefined'">
              <Checkbox v-model="modalFormData.inlineBlock">是</Checkbox>
            </FormItem>
            <FormItem label="显示行数：" v-if="typeof modalFormData.maxRows != 'undefined'">
              <Slider v-model="modalFormData.maxRows" :min="2" :max="10"></Slider>
            </FormItem>
            <FormItem label="标题大小：" v-if="typeof modalFormData.level != 'undefined'">
              <InputNumber :max="6" :min="1" v-model="modalFormData.level"></InputNumber>
            </FormItem>
            <FormItem label="表格：" v-if="modalFormData.type === 'table'">
              <myTable :obj="modalFormData || {}" :data="formData" @switchModal="switchModal"></myTable>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text" @click="handleCancel">取消</Button>
            <Button type="primary" @click="handleOk">确定</Button>
          </div>
        </Modal>
        <Modal v-model="commentsConfigModal"
               width="50%"
               :title="'配置项'"
               :mask-closable="false">
          <Form class="form_content" :label-width="80" :model="commentsVerificationData">
            <FormItem label="校验规则：" v-if="commentsVerificationData.myRule">
              <Select v-model="commentsVerificationData.myRule">
                <Option v-for="(item,key,index) in commentsVerificationData.rules" :value="key" :key="index">
                  {{ item.name }}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="最大长度：" v-if="commentsVerificationData.maxLength">
              <InputNumber v-model="commentsVerificationData.maxLength" placeholder="请输入文本限制最大长度">
              </InputNumber>
            </FormItem>
            <FormItem label="占位符：" v-if="commentsVerificationData.placeholder">
              <i-input v-model="commentsVerificationData.placeholder" placeholder="请输入文本框的占位符">
              </i-input>
            </FormItem>
            <FormItem label="选项内容：" v-if="commentsVerificationData.options">
              <div v-for="(item,index) in commentsVerificationData.options" :key="index">
                <input class="label_value" type="text"
                       v-model="commentsVerificationData.options[index].label_value"
                       placeholder="选项的值" style="width: 60px;">
                <i-input v-model="commentsVerificationData.options[index].label_name"
                         placeholder="选项内容">
                </i-input>
              </div>
              <Button @click="addSelectOption">添加</Button>
              <Button @click="removeSelectOption">删除</Button>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text" @click="switchModal">取消</Button>
            <Button type="primary" @click="modal2Ok">确定</Button>
          </div>
        </Modal>
      </i-row>
    </div>
  </div>
</template>
<script>
  import draggable from "vuedraggable";
  import form_list from "./custom_form/FormList";

  export default {
    components: {
      draggable
    },
    data() {
      return {
        tableList: [{tableName: '', tableDesc: ''},],
        tableName: '',
        nameList: [{fieldName: '', fieldDesc: ''}],
        form_list: form_list,
        sortable_items: [],
        showModal1: false,
        showModal: false,
        commentsConfigModal: false,
        // 正则配置弹窗区分是哪一个的配置
        whoseConfig: '',
        // 正则配置的索引
        commentsIndex: {},
        // 深拷贝对象，防止默认空对象被更改
        modalFormData: {},
        // 单选和多选选项中的备注检验配置
        commentsVerificationData: {},
        formData: {},
      };
    },
    created() {
      this.tableName = this.$route.params.tableName;
      this.tableNameChange(this.tableName);
      // /static/label.json
      this.$post(`/rest/template/queryAllTables`).then(d => {
        this.tableList = d;
      });
    },
    methods: {
      addSelectOption(){
        this.commentsVerificationData.options.push({
          label_value: this.commentsVerificationData.options.length+1,
          label_name: "选项"+(this.commentsVerificationData.options.length+1)
        })
      },
      removeSelectOption(){
        if(this.commentsVerificationData.options.length>1){
          this.commentsVerificationData.options.pop()
        }
      },
      switchModal(o) {
        // 选项的配置
        if (o && o['itemIndex'] >= 0 && o['optionIndex'] >= 0) {
          this.whoseConfig = 'option';
          this.commentsIndex = o;
          let x1 = o['itemIndex'];
          let x2 = o['optionIndex'];
          this.commentsVerificationData = this.modalFormData.items[x1]['label_content'][x2]
          // 表格的配置
        } else if (o && o['locationX'] >= 0 && o['locationY'] >= 0) {
          this.whoseConfig = 'table';
          this.commentsIndex = o;
          this.commentsVerificationData = this.modalFormData.tableContent[o['locationX']][o['locationY']][o['innerIndex']]
        }
        this.commentsConfigModal = !this.commentsConfigModal
      },
      saveNameDesc(v) {
        this.nameList.map((val) => {
          if (val.fieldName === v) {
            this.modalFormData.label = val.fieldDesc
          }
        })
      },
      validateForm() {
        let arr = [];
        for (let i = 0; i < this.sortable_items.length; i++) {
          if (this.sortable_items[i].ele === 'title' || this.sortable_items[i].ele === 'hr' || this.sortable_items[i].ele === 'p') {
            arr.push(this.sortable_items[i].ele + i)
          } else {
            if (this.sortable_items[i].obj.name == null || this.sortable_items[i].obj.name === '') {
              this.$Modal.error({
                title: '错误',
                content: '字段名称不能为空'
              });
              return false;
            }
            arr.push(this.sortable_items[i].obj.name)
          }
        }
        let map = new Map();
        for (let i = 0; i < arr.length; i++) {
          if (map[arr[i]]) {
            this.$Modal.error({
              title: '错误',
              content: '不能有重复的字段表单'
            });
            return false;
          }
          map[arr[i]] = true;
        }
        if (!this.tableName) {
          this.$Modal.error({
            title: '错误',
            content: '先要选择一个表'
          });
          return false;
        }
        return true
      },
      showOptions(i) {
        let type = this.modalFormData.type;
        if (i === 0) {
          return !(type === 'title' || type === 'hr' || type === 'p')
        } else {
          return type === 'radio' || type === 'checkbox'
        }
      },
      handlePreview() {
        if (this.validateForm()) {
          sessionStorage.setItem('template_form', JSON.stringify(this.sortable_items));
          this.$router.push({path: `/preview/${this.tableName}`});
        }
      },
      handleSubmit() {
        if (this.validateForm()) {
          this.$post(`/rest/template/saveTemplateHtml/${this.tableName}`, this.submitObj).then(d => {
            this.$Message.success('Success!');
          });
        }
      },
      // 清空克隆表单
      handleReset() {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确定要重置该表单吗？</p>',
          onOk: () => {
            this.sortable_items = [];
          }
        });
      },
      // modal内数据字典选项发生改变触发事件
      handleTableNameChange(val) {
        this.$router.replace({path: `/editForm/${val}`});
        this.tableNameChange(val)
      },
      tableNameChange(val) {
        this.$post(`/rest/template/queryTemplateHtml/${val}`).then(d => {
          let m = [];
          for (let x in d) {
            if (x) {
              let o = d[x];
              m[d[x].index] = o
            }
          }
          this.sortable_items = m;
          this.showModal1 = false;
        });
        this.$post(`/rest/template/queryAllFields/${val}`).then(d => {
          this.nameList = d;
        });
      },
      // 控件回填数据
      handleChangeVal(val, element) {
        this.$set(this.formData, element.obj.name, val);
      },
      // https://github.com/SortableJS/Vue.Draggable#clone
      // 克隆,深拷贝对象
      cloneData(original) {
        // 添加一个modal标题
        original.obj.modalTitle = original.obj.label || "";
        // 深拷贝对象，防止默认空对象被更改
        return JSON.parse(JSON.stringify(original));
      },
      modal2Ok() {
        // if (this.commentsVerificationData.myRule && this.commentsVerificationData.maxLength > 0) {
        if (this.whoseConfig === 'option') {
          let x1 = this.commentsIndex['itemIndex'];
          let x2 = this.commentsIndex['optionIndex'];
          this.modalFormData.items[x1]['label_content'][x2] = this.commentsVerificationData
        } else if (this.whoseConfig === 'table') {
          let x = this.commentsIndex['locationX'];
          let y = this.commentsIndex['locationY'];
          let i = this.commentsIndex['innerIndex'];
          this.modalFormData.tableContent[x][y][i] = this.commentsVerificationData
        }
        this.switchModal()
        // } else {
        //   this.$Modal.error({
        //     title: '错误',
        //     content: '填写不完整'
        //   });
        //   return false
        // }
      },
      // modal点击确定执行事件
      handleOk() {
        const index = this.modalFormData.listIndex;
        if (this.modalFormData.type === 'radio' || this.modalFormData.type === 'checkbox') {
          let flag;
          this.modalFormData.items.map((v) => {
            if (flag) return false;
            if (!v.label_value) {
              flag = true;
              return false;
            }
            v.label_content.map(item => {
              if (item.type === 'property' && !item.value.trim()) {
                flag = true;
                return false;
              }
            })
          });
          if (flag) {
            this.$Modal.error({
              title: '错误',
              content: '选项内容和选项的值不能为空'
            });
            return false
          }
        }
        // title、p的验证
        if (!this.showOptions(0)) {
          if (this.modalFormData.label.trim() === '') {
            this.$Modal.error({
              title: '错误',
              content: '内容不能为空'
            });
            return false
          }
        }
        // 含有互斥的验证
        if (this.modalFormData.hasMutex && !this.modalFormData.mutexIndex) {
          this.$Modal.error({
            title: '错误',
            content: '互斥索引不正确'
          });
          return false;
        }
        // 验证字段名称
        if (!this.modalFormData.label.match(/[a-zA-Z\u4e00-\u9fa5]/g)) {
          this.$Modal.error({
            title: '失败',
            content: '字段名称含有非法字符'
          });
          return false;
        }

        this.sortable_items[index].obj = Object.assign({},
          this.sortable_items[index].obj,
          this.modalFormData
        );
        this.handleCancel();
      },
      // modal点击取消执行事件，清空当前modal内容
      handleCancel() {
        this.showModal = false;
        setTimeout(_ => {
          this.modalFormData = {};
        }, 500)
      },
      // 显示modal,配置被克隆控件
      confEle(index) {
        const list_temp = Object.assign({}, this.sortable_items[index]);
        for (let i in list_temp.obj) {
          this.modalFormData[i] = list_temp.obj[i];
        }
        // 配置项中未找到color，删除modalFormData中自带color属性
        if (!list_temp.obj['color']) delete this.modalFormData.color;
        // 设置被配置控件的index，便于完成配置找到相应对象赋值
        this.modalFormData.listIndex = index;
        // Vue 不能检测到对象属性的添加或删除
        this.modalFormData = Object.assign({}, this.modalFormData);
        this.showModal = true;
      },
      // 删除克隆控件
      removeEle(index) {
        let name = this.sortable_items[index].obj.name;
        this.sortable_items.splice(index, 1);
        if (!name) return;
        for (let i in this.sortable_items) {
          // 当relation为true并且关联字段被确认
          if (this.sortable_items[i].obj.relation && this.sortable_items[i].obj.relation_name === name) {
            this.$set(this.sortable_items[i].obj, "relation", false);
            this.$set(this.sortable_items[i].obj, "relation_name", "");
            this.$set(this.sortable_items[i].obj, "relation_value", "");
            break;
          }
        }
      },
      // // 更改当前渲染字段是否显示
      // changeVisibility(index, visibility) {
      //     this.$set(this.sortable_items[index].obj, 'visibility', visibility);
      // }
    },
    watch: {
      showModal(val) {
        if (!val) {
          this.handleCancel();
        }
      }
    },
    computed: {
      submitObj() {
        let o = {};
        for (let i in this.sortable_items) {
          if (!this.sortable_items[i].obj.name) {
            this.sortable_items[i].obj.name = `${this.sortable_items[i].ele}@${i}`
          }
          o[this.sortable_items[i].obj.name] = Object.assign({}, this.sortable_items[i], {index: i});
        }
        return o;
      },
      // 拖拽表单1
      dragOptions1() {
        return {
          animation: 0,
          ghostClass: "ghost",
          // 分组
          group: {
            name: "shared",
            pull: "clone",
            revertClone: false
          },
          // 禁止拖动排序
          sort: false
        };
      },
      // 拖拽表单2
      dragOptions2() {
        return {
          animation: 0,
          ghostClass: "ghost",
          group: {
            // 只允许放置shared的控件,禁止pull
            put: ["shared"]
          }
        };
      },
    },
  };
</script>
<style lang="scss">
  $borderColor: #dddee1;
  .label_item {
    font-size: 13px;
    display: inline-block;
    width: 100%;
    background-color: #1abc9c;
    margin-bottom: 9px;
    box-sizing: border-box;
    padding: .563rem .844rem;
    color: #fff;
    text-align: center;
    text-decoration: none;
    line-height: 1.5;
    cursor: pointer;
    border-radius: .125rem;
    border: thin solid #19b394;
    border-bottom: 2px solid #16a085;
    user-select: none;
    /*&.odd{*/
    /*  margin-right: 3%;*/
    /*}*/
  }

  input[type=checkbox], input[type=radio] {
    margin-right: 6px;
  }

  .ivu-modal .label_item {
    width: 120px;
    padding: 6px;
    margin-right: 20px;
  }

  .ivu-form-item .option span {
    margin-right: 8px;
  }

  .ivu-modal .items * {
    cursor: auto
  }

  input[type=text] {
    border: 1px solid $borderColor;
    margin-right: 6px;

    &:last-child {
      margin-right: 0
    }
  }

  .dataTable {
    border-spacing: 0;
    border-bottom: 1px solid $borderColor;
    border-left: 1px solid $borderColor;

    tbody tr td {
      border-top: 1px solid $borderColor;
      border-right: 1px solid $borderColor;
      padding: 6px;
      margin: 0;
    }
  }


  .inline {
    display: inline-block;
  }

  .m-l-lg {
    margin-left: 30px
  }

  .wrapper {
    padding: 15px
  }

  .inline-block {
    display: inline-block;
  }

  .padder-sm {
    padding-right: 10px;
    padding-left: 10px
  }

  .b-a {
    border: 1px solid #ccc;
  }

  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }

  .form-list-group {
    min-height: 200px;
    padding: 20px !important;
  }

  /* 设置items下所有鼠标样式为 move */

  .items,
  .items * {
    cursor: move;
  }

  /* 配置按钮默认位置 */

  /* 例如P Hr Title按钮 */

  .items .item-icon {
    transition: all 2s ease;
    position: absolute;
    top: -18px;
    right: 0px;
    opacity: 0;
    max-height: 0;
    overflow: hidden;
  }

  /* form控件下配置按钮位置 */

  .ivu-form-item.items .item-icon {
    top: -25px;
  }

  /* 配置按钮样式 */

  .item-icon i {
    cursor: pointer !important;
    margin-right: 5px;
  }

  .items:hover .item-icon {
    transition: inherit;
    opacity: 1;
    max-height: 50px;
  }

  /* 提交按钮下方无 margin-bottom */

  .form_content .ivu-form-item:last-child {
    margin-bottom: 0;
  }


  /* 表单校验选项样式 */

  .ivu-form-item-required .ivu-form-item-label:before {
    content: '';
  }

  .items.sortable-items-required .ivu-form-item-label:before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed3f14;
  }
</style>
