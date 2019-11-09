<template>
    <div>
        <sub-title :subTitle="'商品回收站'" @refresh="search"></sub-title>
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
                    <span class="font-14 gray">输入搜索</span>
                    <el-input
                            v-model="goodsName"
                            @clear="search"
                            @keyup.enter.native="search"
                            clearable
                            class="search-input"
                            placeholder="商品名称/商品货号"></el-input>
                    <span class="font-14 gray">选择分类</span>
                    <el-select v-model="typeId" placeholder="请选择商品分类" clearable class="search-input">
                        <el-option
                                v-for="item in categoryList"
                                :key="item.id"
                                :label="item.typeName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                    <span class="font-14 gray">选择品牌</span>
                    <el-select v-model="brandId" placeholder="请选择商品品牌" clearable class="search-input">
                        <el-option
                                v-for="item in brandList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="box-title flex between h-center">
                <span class="font-20">数据列表</span>
                <div class="flex h-center"></div>
            </div>
            <el-table
                    class="mall-table"
                    :data="tableData"
                    v-loading="loading"
                    ref="table"
                    @selection-change="tableSelection"
                    :header-cell-style="headerStyle"
                    :cell-style="tdStyle"
                    >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="编号" width="100">
                    <template slot-scope="scope">{{scope.row.id}}</template>
                </el-table-column>
                <el-table-column label="商品图片" width="100">
                    <template slot-scope="scope">
                        <img :src="getGoodImg(scope.row.goodsImg)" alt="">
                    </template>
                </el-table-column>
                <el-table-column label="商品名称">
                    <template slot-scope="scope">{{scope.row.goodsName}}</template>
                </el-table-column>
                <el-table-column label="商品分类">
                    <template slot-scope="scope">{{scope.row.id}}</template>
                </el-table-column>
                <el-table-column label="价格">
                    <template slot-scope="scope">{{scope.row.goodsPrice}}</template>
                </el-table-column>
                <el-table-column label="货号">
                    <template slot-scope="scope">{{scope.row.goodsNo}}</template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span class="table-btn" @click="update(scope.row.id)">还原</span>
                        <span class="table-btn" @click="remove(scope.row.id)">删除</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination
                    @handleChangeAll="handleChangeAll"
                    :options-list="optionsList"
                    ref="pagination"
                    @confirmBatch="confirmBatch"
                    @next="next"
                    :total="total"
                    :page-size="pageSize"
            ></pagination>
        </div>
    </div>
</template>

<script>
    import subTitle from "../../components/subTitle";
    import pagination from "../../components/pagination"
    import mixin from "../../util/mixin"

    export default {
        name: "recycle",
        mixins: [mixin],
        components: {
            subTitle,
            pagination
        },
        data() {
            return {
                input: "",
                total: 0,
                pageSize1: 1,
                tableData: [],
                checkItemId: [],
                optionsList: {
                    delete: "删除",
                    restore: "还原"
                },
                typeId: "",
                categoryList: [],
                goodsName: "",
                brandList: [],
                brandId: ""
            };
        },
        mounted() {
            this.$http.post("merchantGoodsType/query_goods_type_tree").then(res => {
                this.categoryList = res;
            });
            this.$http.post("merchant_goods_brand/query_list").then(res => {
                this.brandList = res;
            });
            this.getList();
        },
        methods: {
            getList() {
                this.loading = true;
                this.$http.post("/merchantGoods/merchant_goods_recycling", {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    goodsName: this.goodsName,
                    typeId: this.typeId,
                    brandId: this.brandId
                }).then(res => {
                    console.log(res);
                    this.total = res.totalCount;
                    this.tableData = res.list;
                }).finally(() => {
                    this.loading = false;
                });
            },
            remove(id) {
                this.$confirm("确认删除吗？").then(() => {
                    this.$http.post("/merchantGoods/delete_batch_recycling", id).then(() => {
                        this.getList();
                        this.$msgSuc("删除成功");
                    }, err => {
                        this.$msgErr(err.msg);
                    });
                });
            },
            update(id) {
                this.$confirm("确认还原吗？").then(() => {
                    this.$http.post("/merchantGoods/merchant_goods_recycling_reduction", {
                        id: id
                    }).then(() => {
                        this.getList();
                        this.$msgSuc("还原成功");
                    });
                }, err => {
                    this.$msgErr(err.msg);
                });
            },
            restore(id) {
                this.$confirm("确认还原吗？").then(() => {
                    this.$http.post("merchantGoods/merchant_goods_batch_reduction", id).then(() => {
                        this.getList();
                        this.$msgSuc("还原成功");
                    });
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
        .search-input {
            width: 200px;
            margin: 0 15px;
        }
    }
    .box-title {
        padding-right: 20px;
        .search-input {
            width: 150px;
            margin-left: 20px;
        }
        .mall-table {
            margin-right: 0;
        }
    }
</style>
