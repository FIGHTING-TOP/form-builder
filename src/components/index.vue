<template>
  <div>
    <Modal v-model="showModal1"
           width="50%"
           footer-hide
           :closable="false"
           :title="'先要选择一个表'"
           :mask-closable="false">
      <Select v-model="tableName" @on-change="handleTableNameChange">
        <Option v-for="(item,index) in tableList" :value="item.tableName" :key="index">{{ item.tableDesc }}</Option>
      </Select>
    </Modal>
    <h1>
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
                  <span class="label_item" :class="{odd:index%2===0}"
                        v-for="(element,index) in form_list"
                        :key="index">{{element.obj.label}}</span>
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
                <renders @handleRemoveEle="removeEle" @handleConfEle="confEle"
                         @changeVisibility="changeVisibility" :nameList="nameList"
                         v-for="(element,index) in sortable_items" :key="index"
                         :index="index" :ele="element.ele" :obj="element.obj || {}"
                         :data="formData" @handleChangeVal="val => handleChangeVal(val,element)"
                         :sortableItem="sortable_items" :config-icon="true">
                </renders>
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
               width="75%"
               :title="'配置' + modalFormData.modalTitle + '属性'"
               :mask-closable="false">
          <Form class="form_content" :label-width="80" :model="modalFormData" ref="modalFormData">
            <FormItem label="字段名称：">
              <Select v-model="modalFormData.name">
                <Option v-for="(item,index) in nameList" :value="item.fieldName" :key="index">{{ item.fieldDesc }}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="数据字典：" v-if="showOptions()">
              <options v-for="(element,index) in modalFormData.items" :key="index"
                       :index="index" :obj="modalFormData || {}" :ele="element"
                       :data="formData" @handleChangeVal="val => handleChangeVal(val,element)">
              </options>
            </FormItem>
            <FormItem label="占位符：" v-if="typeof modalFormData.placeholder != 'undefined'">
              <i-input v-model="modalFormData.placeholder" placeholder="请输入placeholder"></i-input>
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
              <myTable :obj="modalFormData || {}" :data="formData"></myTable>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text" @click="handleCancel">取消</Button>
            <Button type="primary" @click="handleOk">确定</Button>
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
                showModal1: true,
                showModal: false,
                // 深拷贝对象，防止默认空对象被更改
                modalFormData: {},
                formData: {},
            };
        },
        methods: {
            validateForm() {
                let arr = [];
                for (let i = 0; i < this.sortable_items.length; i++) {
                    if (this.sortable_items[i].obj.name == null || this.sortable_items[i].obj.name === '') {
                        alert('字段名称不能为空');
                        return false;
                    }
                    arr.push(this.sortable_items[i].obj.name)
                }
                let map = new Map();
                for(let i = 0;i<arr.length;i++){
                    if(map[arr[i]]){
                        alert('不能有重复的字段表单');
                        return false;
                    }
                    map[arr[i]] = true;
                }
                if (!this.tableName) {
                    alert('先要选择一个表');
                    return false;
                }
            },
            showOptions() {
                let type = this.modalFormData.type;
                return type === 'select' || type === 'radio' || type === 'checkbox'
            },
            handlePreview() {
                this.validateForm();
                sessionStorage.setItem('template_form', JSON.stringify(this.sortable_items));
                this.$router.push({path: `/preview/${this.tableName}`});
            },
            handleSubmit() {
                this.validateForm();
                this.$post(`rest/template/saveTemplateHtml/${this.tableName}`, this.submitObj).then(d => {
                    this.$Message.success('Success!');
                });
            },
            // 清空克隆表单
            handleReset() {
                this.sortable_items = [];
            },
            // modal内数据字典选项发生改变触发事件
            handleTableNameChange(val) {
                this.$post(`rest/template/queryTemplateHtml/${val}`).then(d => {
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
                this.$post(`rest/template/queryAllFields/${val}`).then(d => {
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
            // modal点击确定执行事件
            handleOk() {
                const index = this.modalFormData.listIndex;
                if (this.modalFormData.type === 'radio' || this.modalFormData.type === 'checkbox') {
                    let flag;
                    this.modalFormData.items.map((v) => {
                        if (flag) return false;
                        v.label_content.map(item => {
                            if (item.type === 'property' && !item.value.trim()) {
                                flag = true;
                                return false;
                            }
                        })
                    });
                    if (flag) {
                        alert('选项内容不能为空');
                        return false
                    }
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
            // 更改当前渲染字段是否显示
            changeVisibility(index, visibility) {
                this.$set(this.sortable_items[index].obj, 'visibility', visibility);
            }
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
        created() {
            // /static/label.json
            this.$http.post('/rest/template/queryAllTables').then(res => {
                this.tableList = res.data.data;
            });
        }
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

  .ivu-modal .label_item {
    width: 120px;
    padding: 6px;
    margin-right: 20px;
  }

  .ivu-form-item .option span{
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
