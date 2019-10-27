<template>
    <div class="add">
        <sub-title :subTitle="isAdd ? '添加商品' : '编辑商品'"></sub-title>
        <div class="body">
<!--            头部导航条-->
            <el-steps :active="stepActive" align-center>
                <el-step title="选择商品分类"></el-step>
                <el-step title="填写商品信息"></el-step>
                <el-step title="填写商品属性"></el-step>
                <el-step title="选择商品关联"></el-step>
            </el-steps>
<!--            内容展示-->
            <div class="form-wrap flex" v-loading="loading">
<!--                选择商品分类-->
                <div v-if="stepActive == 0">
                    <div class="flex">
                        <div class="form-label">基本信息</div>
<!--                        选择一级分类-->
                        <div class="flex-1">
                            <div class="select-category flex h-center">
                                <div class="flex-1">
                                    <div class="title font-18 gray bold">选择一级分类</div>
                                    <ul class="category-list">
                                        <li
                                                class="ruleForm.typeId == item.id ? 'active' : ''"
                                                v-for="item in categoryList"
                                                @click="getCategory(item)"
                                        >
                                            <span>{{item.typeName}}</span>
                                            <i class="el-icon-arrow-right fr"></i>
                                        </li>
                                    </ul>
                                </div>
                                <img src="@/assets/icon-arrow.png" alt="">
                                <div class="flex-1">
                                    <div class="title font-18 gray bold">选择二级分类</div>
                                    <ul class="category-list" v-if="childCategoryList.length > 0">
                                        <li
                                                :class="ruleForm.childId == item.id ? 'active' : ''"
                                                @click="getChildCategory(item)"
                                                v-for="item in childCategoryList"
                                        >
                                            {{item.typeName}}
                                        </li>
                                    </ul>
                                    <div class="categoryList" v-if="childCategoryList == 0">
                                        <span class="empty">暂无分类</span>
                                    </div>
                                </div>
                            </div>
                            <p class="tips">您当前选择的商品类别是:
                                <span>{{categoryName || '未选择'}}</span>
                                <span v-show="childCategoryName"> > {{childCategoryName || '未选择'}}</span>
                            </p>
                            <el-button type="primary" @click="submit1">下一步,填写商品信息</el-button>
                        </div>
                    </div>
                </div>
                <div v-if="stepActive == 1"></div>
                <div v-if="stepActive == 2"></div>
                <div v-if="stepActive == 3"></div>
            </div>
        </div>
<!--        相册库弹窗-->
        <el-dialog></el-dialog>
    </div>
</template>

<script>
    import subTitle from "../../components/subTitle";
    import pagination from "../../components/pagination";
    import {quillEditor} from "vue-quill-editor";
    import mixin from "../../util/mixin";

    export default {
        name: "add",
        components: {
            subTitle,
            pagination,
            quillEditor
        },
        mixins: [mixin],
        data() {
            let validGoodsStock = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入商品库存'));
                } else if (value > 99999) {
                    callback(new Error('商品库存最大值为99999'));
                } else if (value < 0) {
                    callback(new Error("商品库存不能小于0"));
                } else {
                    callback();
                }
            };
            return {
                loading: false,
                categoryList: [],
                childCategoryList: [],
                categoryName: '',
                childCategoryName: '',
                typeId: '',
                childTypeId: '',
                brandList: [],
                dialogVisible: false,
                stepActive: 0,
                ruleForm: {
                    typeId: '',
                    childId: '',
                    goodsName: '',
                    goodsSubtitle: '',
                    brandId: '',
                    goodsSubtitle: '',
                    brandId: '',
                    goodsDesc: '',
                    goodsNo: '',
                    goodsPrice: '',
                    marketPrice: '',
                    goodsStock: '',
                    goodsWarning: '',
                    goodsUnit: '',
                    goodsWeight: '',
                    styleId: '',
                    merchantSpecification: [],
                    merchantGoodsTypePropertyList: [],
                    merchantParamDetailIds: {
                        merchantParamDetails: [],
                        mainMaterial: '',
                        paramObject: ''
                    },
                    goodsImg: '',
                    navId: '',
                    navChildId: '',
                },
                rules: {
                    goodsName: [
                        {require: true, message: "请输入商品名称", trigger: 'blur'},
                        {max: 20, message: "长度必须小于20个字符"}
                    ],
                    goodsSubtitle: [
                        {require: true, message: "请输入副标题", trigger: 'blur'},
                        {max: 20, message: "长度必须小于20个字符"}
                    ]
                },
                typeList: [],
                goodsTypeId: '',
                propList: [],
                checkProp: [],
                checkPropList: [],
                propSpecList: [],
                propHeader: [],
                propLoading: false,
                paramsList: [],
                imgList: [],
                goodsMobileImg: '',
                albumList: [],
                albumId: '',
                albumImgList: [],
            }
        },
        methods: {
            submit1() {

            },
            getChildCategory(item) {

            }
        }
    }
</script>

<style scoped lang="scss">
    @import "~@/assets/css/common.scss";
    .form-wrap {
        margin-top: 50px;
        > div {
            width: 100%;
        }
    }
</style>
