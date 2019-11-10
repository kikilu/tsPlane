<template>
    <div>
        <sub-title :sub-title="'商品分类'" :is-refresh="false"></sub-title>
        <div class="body">
            <div class="box-title flex between h-center">
                <span class="font-20">数据列表</span>
                <div class="flex h-center">
                    <el-button v-if="second" @click="getList()">返回</el-button>
                    <el-button @click="$router.push('category/addCategory')">添加分类</el-button>
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
                <el-table-column label="分类名称">
                    <template slot-scope="scope">{{scope.row.typeName}}</template>
                </el-table-column>
                <el-table-column label="级别">
                    <template slot-scope="scope">{{scope.row.parentId == '0' ? '一级' : '二级'}}</template>
                </el-table-column>
                <el-table-column label="商品数量">
                    <template slot-scope="scope">{{scope.row.goodsNum}}</template>
                </el-table-column>
                <el-table-column label="数量单位">
                    <template slot-scope="scope">{{scope.row.goodsUnit}}</template>
                </el-table-column>
                <el-table-column label="是否显示">
                    <template slot-scope="scope">
                        <el-switch
                                @change="handleShow($event, scope.row)"
                                v-model="scope.row.showStatus"
                                :active-value="0"
                                :inactive-value="1"
                                active-color="#5bc0bf"
                                inactive-color="#dedede"
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="排序">
                    <template slot-scope="scope">{{scope.row.goodsSort}}</template>
                </el-table-column>
                <el-table-column label="设置" width="260">
                    <template slot-scope="scope">
                        <span class="table-btn" @click="shiftGoods(scope.row.id)">转移商品</span>
                        <span
                                class="table-btn"
                                v-if="scope.row.parentId == 0"
                                @click="$router.push('/goods/category/addCategory?parentId=' + scope.row.id)"
                        >
                            新增下级
                        </span>
                        <span
                                class="table-btn"
                                v-if="scope.row.parentId == 0"
                                @click="getList(scope.row.id)"
                        >查看下级</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span
                                class="table-btn"
                                @click="$router.push('category/addCategory?id=' + scope.row.id)"
                        >编辑</span>
                        <span class="table-btn" @click="remove(scope.row.id)">删除</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :is-batch="false" @next="next" :total="total" :page-size="pageSize"></pagination>
            <el-dialog
                    title="转移商品"
                    :visible.sync="dialogVisible"
                    :append-to-body="true">
                <div class="flex">
                    <div class="flex-1">
                        <p>原商品分类：</p>
                        <el-select v-model="originaId" placeholder="请选择商品分类" class="search-input">
                            <el-option
                                    v-for="item in addCategoryList"
                                    :key="item.id"
                                    :label="item.typeName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="flex-1">
                        <p>目标商品分类：</p>
                        <el-select v-model="lastId" placeholder="请选择商品分类" class="search-input">
                            <el-option
                                    v-for="item in addCategoryList"
                                    :key="item.id"
                                    :label="item.typeName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="updateCategoryGoods">确定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import mixin from "../../util/mixin";
    import subTitle from "../../components/subTitle";
    import pagination from "../../components/pagination";

    export default {
        name: "category",
        mixins: [mixin],
        components: {
            subTitle,
            pagination
        },
        data() {
            return {
                tableData: [],
                dialogVisible: false,
                second: false,
                originaId: "",
                lastId: "",
                addCategoryList: []
            };
        },
        mounted() {
            this.getList();
            this.$http.post("merchantGoodsType/merchant_goods_type_list").then(res => {
                this.addCategoryList = res;
            });
        },
        methods: {
            getList(id) {
                var parentId;
                if (id) {
                    parentId = id;
                    this.childCategoryId = id;
                    this.second = true;
                } else {
                    parentId = 0;
                    this.second = false;
                }
                this.loading = true;
                this.currentPage = 1;
                this.$http.post("merchantGoodsType/merchant_goods_type_list_page", {
                    parentId: parentId,
                    currentPage: this.currentPage,
                    pageSize: this.pageSize
                }).then(res => {
                    this.tableData = res.list;
                    this.total = res.totalCount;
                }).finally(() => {
                    this.loading = false;
                });
            },
            next() {
                if (this.second) {
                    this.getList(this.childCategoryId);
                } else {
                    this.getList();
                }
            },
            remove(id) {
                this.$confirm("确认删除吗？").then(() => {
                    this.$http.post("merchantGoodsType/merchant_goods_type_delete", {
                        id: id
                    }).then(() => {
                        this.$msgSuc("删除成功");
                        this.getList();
                    });
                });
            },
            handleShow($event, data) {
                console.log($event);
                console.log(data);
                let form = {
                    id: data.id,
                    typeName: data.typeName,
                    parentId: data.parentId,
                    goodsUnit: data.goodsUnit,
                    goodsSort: data.goodsSort,
                    showStatus: $event,
                    typeIcon: data.typeIcon
                };
                this.$http.post("merchantGoodsType/merchant_goods_type_update", form).then(() => {
                    this.$msgSuc("操作成功");
                }, err => {
                    this.$msgErr(err.msg);
                });
            },
            shiftGoods(id) {
                this.dialogVisible = true;
                this.orient = id;
            },
            updateCategoryGoods() {
                this.$http.post("merchantGoodsType/merchant_goods_type_transfer", {
                    originalId: this.originalId,
                    lastId: this.lastId
                }).then(() => {
                    this.$msgSuc("操作成功");
                    this.getList();
                    this.dialogVisible = false;
                }, err => {
                    this.$msgErr(err.msg);
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "~@/assets/css/common.scss";
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
        .mall-btn:last-child {
            margin-right: 0;
        }
    }
    .search-input {
        width: 200px;
        margin-top: 20px;
    }
</style>
