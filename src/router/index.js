import Vue from 'vue'
import Router from 'vue-router'
import editTable from '@/components/editTable'
import render from '@/components/render'
import preview from '@/components/preview'
import index from '@/components/index'

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      meta: {
        title: '管理表'
      }
    },
    {
      path: '/editTable/:tableName/:addNew?',
      name: 'editTable',
      component: editTable,
      meta: {
        title: '编辑表单'
      }
    },
    {
      path: '/render/:tableName',
      name: 'render',
      component: render,
      meta: {
        title: '填写表单'
      }
    },
    {
      path: '/preview/:tableName',
      name: 'preview',
      component: preview,
      meta: {
        title: '预览表单'
      }
    },
  ]
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) document.title = to.meta.title;
  next()
});

export default router
