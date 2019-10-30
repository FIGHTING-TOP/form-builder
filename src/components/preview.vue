<template>
  <div>
    <preview v-for="(item, index) in template_form" :key="index" :ele="item.ele" :obj="item.obj"></preview>
  </div>
</template>
<script>
export default {
  data() {
    return {
      template_form: []
    }
  },
  created() {
    this.template_form = JSON.parse(sessionStorage.getItem('template_form') || '[]');
  }
}

</script>
