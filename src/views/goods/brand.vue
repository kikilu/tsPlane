<template>
    <div>
        <sub-title :sub-title="'商品品牌'" :is-refresh="false"></sub-title>
        <div class="body">
            <div class="filter-wrap">
                <div class="flex h-center between">
                    <span class="font-14 gray">
                        <i class="el-icon-search"></i>
                        筛选查询
                    </span>
                    <div class="search-wrap">
                        <span class="font-14 gray" @click="showSearch" v-show="!visibleSearch">
                            <i class="el-icon-arrow-down"></i>
                            打开筛选
                        </span>
                        <span class="font-14 gray" @click="showSearch" v-show="visibleSearch">
                            <i class="el-icon-arrow-up"></i>
                            收起筛选
                        </span>
                        <el-button @click="search">查询结果</el-button>
                    </div>
                </div>
                <div class="flex h-center" v-show="visibleSearch">
                    <span class="font-14 gray">输入搜索:</span>
                    <el-input
                            v-model="name"
                            placeholder="品牌名称/关键字"
                            @keyup.enter.native="search"
                            clearable
                            @clear="search"
                            class="search-input"
                    ></el-input>
                </div>
            </div>
            <div class="box-title flex between h-center">
                <span class="font-20">数据列表</span>
                <el-button @click="$router.push('/goods/brand/addBrand')">添加品牌</el-button>
            </div>
            <el-table class="mall-table" ref="table" :data="tableData" v-loading="loading" @selection-change="tableSelection" :header-cell-style="headerStyle" :cell-style="tdStyle">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="编号">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="品牌名称">
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column label="品牌首字母">
                    <template slot-scope="scope">{{ scope.row.firstChar }}</template>
                </el-table-column>
                <el-table-column label="排序">
                    <template slot-scope="scope">{{ scope.row.sorting }}</template>
                </el-table-column>
                <el-table-column label="是否显示">
                    <template slot-scope="scope">
                        <el-switch
                                v-model="scope.row.isShow"
                                @change="handleShow($event, scope.row)"
                                active-color="#5BC0BF"
                                :active-value="1"
                                inactive-color="#ff4949"
                                :inactive-value="0"
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="相关">
                    <template slot-scope="scope">{{ "商品:" + scope.row.goodsTotal }}</template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span class="table-btn" @click="$router.push('/goods/brand/addBrand?id=' + scope.row.id)">编辑</span>
                        <span class="table-btn" @click="remove([scope.row.id])">删除</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination
                    @handleChangeAll="handleChangeAll"
                    @confirmBatch="confirmBatch"
                    @next="next"
                    :options-list="optionsList"
                    :page-size="pageSize"
                    :total="total"
                    ref="pagination"
            ></pagination>
        </div>
    </div>
</template>

<script>
    import subTitle from "../../components/subTitle";
    import pagination from "../../components/pagination";
    import mixin from "../../util/mixin"

    export default {
        name: "brand",
        components: {
            subTitle,
            pagination
        },
        mixins: [mixin],
        data() {
            return {
                tableData: [],
                name: "",
                isShow: true,
                checkItemId: [],
                optionsList: {
                    delete: "删除",
                    show: "显示品牌",
                    hide: "隐藏品牌"
                }
            };
        },
        methods: {
            getList() {
                this.$http.post("merchant_goods_brand/query_for_page", {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    name: this.name
                }).then(res => {
                    this.tableData = res.list;
                    this.total = res.totalCount;
                }).finally(() => {
                    this.loading = false;
                });
            },
            // 删除被选中项
            remove(id) {
                this.$confirm("确认删除吗").then(() => {
                    this.$http.post("merchant_goods_brand/delete_batch", id).then(() => {
                        this.getList();
                        this.$msgSuc("删除成功");
                    }, err => {
                        this.$msgErr(err.msg);
                    })
                })
            },
            // 隐藏被选中项
            batchShow(checkItemId, type) {
                console.log(checkItemId);
                console.log(type);
                this.$http.post("merchant_goods_brand/hidden_batch", {
                    type: type,
                    ids: checkItemId
                }).then(() => {
                    this.getList();
                    this.$msgSuc("操作成功");
                }, err => {
                    this.$msgErr(err.msg);
                });
            },
            handleShow($event, row) {
                console.log("$event: " + $event);
                console.log(row);
                let form = {
                    id: row.id,
                    name: row.name,
                    logo: row.logo,
                    areaLogo: row.areaLogo,
                    story: row.story,
                    isShow: $event,
                    sorting: row.sorting,
                    firstChar: row.firstChar
                };
                this.$http.post("merchant_goods_brand/update", form).then(() => {
                    this.$msgSuc("操作成功");
                }, err => {
                    this.$msgErr(err.msg);
                })
            }
        },
        mounted() {
            this.getList();
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
        .el-button {
            margin-left: 20px;
        }
    }
    .search-input {
        width: 200px;
        margin: 0 15px;
    }
    .box-title {
        padding-right: 20px;
    }

</style>
