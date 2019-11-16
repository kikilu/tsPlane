<template>
    <div>
        <sub-title :sub-title="'参数列表'" :is-refresh="false"></sub-title>
        <div class="body">
            <div class="filter-wrap">
                <div class="flex h-center between">
                    <div>
                        <span class="font-14 gray">
                            <i class="el-icon-search"></i>
                            筛选查询
                        </span>
                    </div>
                    <div class="search-wrap">
                        <span class="font-14 gray" @click="showSearch" v-show="!visibleSearch">
                            <i class="el-icon-arrow-down"></i>
                            打开筛选
                        </span>
                        <span class="font-14 gray" @click="showSearch" v-show="visibleSearch">
                            <i class="el-icon-arrow-up"></i>
                            收起筛选
                        </span>
                        <el-button class="search" @click="search">查询结果</el-button>
                    </div>
                </div>
                <div class="flex h-center" v-show="visibleSearch">
                    <span class="font-14 gray">输入搜索：</span>
                    <el-input
                            v-model="paramsName"
                            placeholder="关键字/参数名称"
                            @keyup.enter.native="search"
                            @clear="search"
                            class="search-input"
                            clearable
                    ></el-input>
                    <span class="font-14 gray">商品类型：</span>
                    <el-input
                            v-model="styleName"
                            placeholder="关键字/商品类型"
                            @keyup.enter.native="search"
                            @clear="search"
                            clearable
                            class="search-input"
                    ></el-input>
                </div>
            </div>
            <div class="box-title flex between h-center">
                <span class="font-20">数据列表</span>
                <div class="flex h-center">
                    <el-button @click="back">返回</el-button>
                    <el-button @click="$router.push('/goods/type/addParams')">添加参数</el-button>
                </div>
            </div>
            <el-table
                    ref="table"
                    class="mall-table"
                    v-loading="loading"
                    @selection-change="tableSelection"
                    :data="tableData"
                    :header-cell-style="headerStyle"
                    :cell-style="tdStyle"
                    >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="编号" width="80">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="参数名称">
                    <template slot-scope="scope">{{ scope.row.paramName }}</template>
                </el-table-column>
                <el-table-column label="商品类型" width="120">
                    <template slot-scope="scope">{{ scope.row.styleName }}</template>
                </el-table-column>
                <el-table-column label="参数录入方式" width="120">
                    <template slot-scope="scope">{{ scope.row.paramSelect || getPropSelect }}</template>
                </el-table-column>
                <el-table-column label="可选值列表">
                    <template slot-scope="scope">{{ scope.row.paramList }}</template>
                </el-table-column>
                <el-table-column label="排序" width="120">
                    <template slot-scope="scope">{{ scope.row.paramSort }}</template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span
                                class="table-btn"
                                @click="$router.push('/goods/type/addParams?id=' + scope.row.id)"
                        >编辑</span>
                        <span class="table-btn" @click="remove([scope.row.id])">删除</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination
                    @confirmBatch="confirmBatch"
                    @handleChangeAll="handleChangeAll"
                    @next="next"
                    :options-list="optionsList"
                    :total="total"
                    :page-size="pageSize"
                    ref="pagination"
            ></pagination>
        </div>
    </div>
</template>

<script>
    import subTitle from "../../components/subTitle";
    import pagination from "../../components/pagination";
    import mixin from "../../util/mixin"
    import filters from "../../util/filters";

    export default {
        name: "params",
        mixins: [mixin],
        filters: filters,
        components: {
          subTitle,
          pagination
        },
        data() {
            return {
                tableData: [],
                optionsList: {
                    delete: "删除"
                },
                checkItemId: [],
                paramsName: '',
                styleName: ''
            };
        },
        mounted() {
            this.getList("merchantGoodsParam/merchant_goods_property_list_page", {
                styleId: this.$route.params.id
            });
        },
        methods: {
            //移除信息，id必须为数组
            remove(id) {
                this.$confirm("确认删除吗?").then(() => {
                    this.$http.post("merchantGoodsParam/delete_batch", id).then(() => {
                        this.getList("merchantGoodsParam/merchant_goods_property_list_page", {styleId: this.$route.params.id});
                        this.$msgSuc("删除成功");
                    }, err => {
                        this.$msgErr(err.msg);
                    });
                });
            },
            search() {
                this.getList("merchantGoodsParam/merchant_goods_property_list_page", {
                    styleId: this.$route.params.id
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
        .mall-table:last-child {
            margin-right: 0;
        }
    }
    .search-input {
        width: 200px;
        margin: 0 15px;
    }

</style>
