<template>
  <Form ref="formValidate" class="b-a" :label-width="100" :model="formData" @submit.native.prevent>
    <!--    <p>未绑定数据字典控件无效</p>-->
    <renders v-for="(element,index) in template_form" :key="index" :index="index"
             :ele="element.ele" :nameList="nameList"
             :obj="element.obj || {}" :data="formData" @handleChangeVal="val => handleChangeVal(val,element)"
             :value="formData[element.obj.name]" :sortableItem="template_form">
    </renders>
    <FormItem>
      <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
    </FormItem>
  </Form>
</template>
<script>
  export default {
    data() {
      return {
        template_form: [],
        nameList: [],
        formData: {}
      }
    },
    computed: {
      submitObj() {
        let o = {};
        for (let i in this.template_form) {
          o[this.template_form[i].obj.name] = Object.assign({}, this.template_form[i], {index: i});
        }
        return o;
      },
    },
    methods: {
      // 控件回填数据
      handleChangeVal(val, element) {
        this.$set(this.formData, element.obj.name, val);
        // this.formData[element.obj.name] = val;
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$post(`/hxk/rest/publichealth/saveOrUpdateUserInfo/${this.$route.params.tableName}`, this.submitObj).then(d => {
              this.$Message.success('Success!');
            });
          } else {
            this.$Message.error('Fail!');
          }
        })
      },
      // 更改当前渲染字段是否显示
      // changeVisibility(index, visibility) {
      //     this.$set(this.template_form[index].obj, 'visibility', visibility);
      // }
    },
    created() {
      this.$post(`/hxk/rest/template/queryAllFields/${this.$route.params.tableName}`).then(d => {
        this.nameList = d;
      });
      this.$post(`/hxk/rest/template/queryTemplateHtml/${this.$route.params.tableName}`).then(d => {
        let m = [];
        for (let x in d) {
          if (d[x] && d[x].index >= 0) {
            let o = d[x];
            m[d[x].index] = o
          }
        }
        this.template_form = m;
      });
    }
  }

</script>
<style>

</style>
