<template>
  <div id="app">
    <div class="layout">
      <Layout>
        <Header>
          <Menu mode="horizontal" theme="dark" active-name="1" @on-select="clickMenu">
            <div class="layout-logo"></div>
            <div class="layout-nav">
              <MenuItem name="1" v-if="$route.name !== 'index'">
                <Icon type="ios-keypad"></Icon>
                管理表
              </MenuItem>
<!--              <MenuItem name="2" v-if="$route.name!='editTable'">-->
<!--                <Icon type="ios-navigate"></Icon>-->
<!--                新增表-->
<!--              </MenuItem>-->
            </div>
          </Menu>
        </Header>
        <Content :style="{padding: '0'}">
<!--          <Breadcrumb :style="{margin: '20px 0'}">-->
<!--            <BreadcrumbItem>Home</BreadcrumbItem>-->
<!--            <BreadcrumbItem>Components</BreadcrumbItem>-->
<!--            <BreadcrumbItem>Layout</BreadcrumbItem>-->
<!--          </Breadcrumb>-->
          <Card>
            <div style="min-height: 660px;">
              <router-view></router-view>
            </div>
          </Card>

        </Content>
        <Footer class="layout-footer-center">2019-2020 &copy; Healthinkang</Footer>
      </Layout>
    </div>
  </div>
</template>
<script>
    export default {
        name: 'app',
        methods: {
            clickMenu(n) {
                if (n == 1) {
                    if (this.$route.name === 'index') {
                        return false
                    }
                    this.$router.push({name: 'index'})
                }
            }
        }
    }
</script>
<style lang="scss">
  body {
    min-height: 100%;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;

    .layout {
      border: 1px solid #d7dde4;
      background: #f5f7f9;
      position: relative;
      border-radius: 4px;
      overflow: hidden;
    }

    .layout-logo {
      width: 180px;
      height: 61px;
      background: url("./assets/img/logo.png");
      background-size: 100% 100%;
      border-radius: 3px;
      float: left;
    }

    .layout-nav {
      /*width: 420px;*/
      float: right;
      margin: 0 auto;
      margin-right: 20px;
    }

    .layout-footer-center {
      text-align: center;
    }

    .container {
      padding-right: 15px;
      padding-left: 15px;
      margin-right: auto;
      margin-left: auto;
    }

    .ivu-col-span-12 {
      display: block;
      padding-left: 15px;
      padding-right: 15px;
      width: 50%;
    }
  }


</style>
