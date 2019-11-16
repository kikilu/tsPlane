<template>
    <div>
        <sub-title :sub-title="'商品类型'" :is-refresh="false"></sub-title>
        <div class="body">
            <div class="box-title flex between h-center">
                <span class="font-20">数据列表</span>
                <div class="flex h-center">
                    <el-button @click="dialogVisible = true; isAdd = true">添加类型</el-button>
                </div>
            </div>
            <el-table
                    class="mall-table"
                    v-loading="loading"
                    :data="tableData"
                    :header-cell-style="headerStyle"
                    :cell-style="tdStyle"
                    >
                <el-table-column label="编号">
                    <template slot-scope="scope">{{scope.row.id}}</template>
                </el-table-column>
                <el-table-column label="类型名称">
                    <template slot-scope="scope">{{scope.row.styleName}}</template>
                </el-table-column>
                <el-table-column label="属性数量">
                    <template slot-scope="scope">{{scope.row.propertyNum}}</template>
                </el-table-column>
                <el-table-column label="参数数量">
                    <template slot-scope="scope">{{scope.row.paramNum}}</template>
                </el-table-column>
                <el-table-column label="设置">
                    <template slot-scope="scope">
                        <span class="table-btn" @click="$router.push('/goods/type/prop/' + scope.row.id)">属性列表</span>
                        <span class="table-btn" @click="$router.push('/goods/type/params/' + scope.row.id)">参数列表</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :is-batch="false" @next="next" :total="total" :page-size="pageSize"></pagination>
            <el-dialog
                    title="添加类型"
                    :visible.sync="dialogVisible"
                    :append-to-body="true"
                    :pageSize="pageSize"
            >
                <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="form" :rules="rules">
                    <el-form-item label="类型名称：" prop="styleName">
                        <el-input v-model="ruleForm.styleName"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import subTitle from "../../components/subTitle";
    import pagination from "../../components/pagination";
    import mixin from "../../util/mixin";
    export default {
        name: "type",
        mixins: [mixin],
        components: {
            subTitle,
            pagination
        },
        data() {
            return {
                tableData: [],
                dialogVisible: false,
                ruleForm: {
                    styleName: ""
                },
                rules: {
                    styleName: [
                        {required: true, message: "请输入类型名称", trigger: "blur"},
                        {max: 20, message: "长度必须小于20个字符", trigger: "blur"}
                    ]
                }
            };
        },
        mounted() {
            this.getList();
        },
        methods: {
            getList() {
                this.loading = true;
                this.$http.post("merchantGoodsStyle/merchant_goods_style_list_page", {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize
                }).then(res => {
                    this.total = res.totalCount;
                    this.tableData = res.list;
                }).finally(() => {
                    this.loading = false;
                });
            },
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        if (this.isAdd) {
                            this.addEdit("merchantGoodsStyle/merchant_goods_type_add");
                        } else {
                            this.addEdit("merchantGoodsStyle/merchant_goods_type_update");
                        }
                    } else {
                        return false;
                    }
                });
            },
            edit(data) {
                this.isAdd = false;
                this.dialogVisible = true;
                this.ruleForm.id = data.id;
                this.ruleForm.styleName = data.styleName;
            },
            addEdit(url) {
                this.$http.post(url, this.ruleForm).then(() => {
                    this.$msgSuc("操作成功");
                    this.getList();
                    this.dialogVisible = false;
                }, err => {
                    this.$msgErr(err.msg);
                });
            },
            remove(id) {
                this.$confirm("确认删除吗？").then(() => {
                    this.$http.post("merchantGoodsStyle/merchant_goods_type_delete", {
                        id: id
                    }).then(() => {
                        this.getList();
                        this.$msgSuc("删除成功");
                    }, err => {
                        this.$msgErr(err.msg);
                    });
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "~@/assets/css/common";
    .filter-wrap {
        border: $border;
        margin-bottom: 24px;
        > div {
            padding: 0 22px;
            height: 56px;
            &:last-child {
                background-color: $bgColor;
            }
        }
        .search {
            margin-left: 20px;
            margin-right: 0;
        }
    }
    .box-title {
        padding-right: 20px;
        .search-input {
            width: 150px;
            margin-left: 20px;
        }
        .mall-btn {
            margin-right: 0;
        }
    }
    .search-input {
        width: 200px;
        margin: 0 15px;
    }
</style>
