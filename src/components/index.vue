<template>
  <Table border :columns="tHeadList" :data="tableData">
    <template slot-scope="{ row }" slot="index">
      <strong>{{ row.index }}</strong>
    </template>
    <template slot-scope="{ row, index }" slot="action">
      <Button type="primary" size="small" style="margin-right: 5px" @click="editTable(index)">编辑</Button>
<!--      <Button type="error" size="small" @click="remove(index)">删除</Button>-->
    </template>
  </Table>
</template>
<script>
    export default {
        data () {
            return {
                tHeadList: [
                    {
                        title: '序号',
                        width: 60,
                        align: 'center',
                        slot: 'index'
                    },
                    {
                        title: '表单名称',
                        key: 'tableName'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 150,
                        align: 'center'
                    }
                ],
                tableList: []
            }
        },
        computed: {
            tableData(){
                let list = [];
                this.tableList.map((v,i)=>{
                    list.push({
                        index: i,
                        tableName: v.tableDesc
                    })
                });
                return list
            }
        },
        created(){
            this.$post(`/hxk-biz/rest/template/queryAllTables`).then(d => {
                this.tableList = d;
            });
        },
        methods: {
            editTable (i) {
                this.$router.push({path: `/editTable/${this.tableList[i].tableName}`})
            },
            remove (i) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确定要删除该条吗？</p>',
                    onOk: () => {
                        this.$post(`/hxk-biz/rest/publicHealth/delCommon/${this.tableList[i].tableName}/{id}`).then(d => {
                            this.tableList.splice(i, 1);
                            this.$Message.info('Clicked ok');
                        });
                    }
                });
            }
        }
    }
</script>
