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
                                    <div class="category-list" v-if="childCategoryList.length == 0">
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
                <div v-if="stepActive == 1">
                    <div class="flex">
                        <div>
                            <div class="form-label">基本信息</div>
                            <div class="form-label label2">库存规格</div>
                        </div>
                        <el-form
                                :model="ruleForm"
                                :rules="rules"
                                ref="ruleForm"
                                label-width="100px"
                                class="form-info"
                        >
                            <el-form-item label="商品分类:">
                                <span class="font-14 green bold" @click="stepActive = 0">{{categoryName}}</span>
                                <span
                                        class="font-14 green bold"
                                        v-show="childCategoryName"
                                >{{' > ' + childCategoryName}}</span>
                            </el-form-item>
                            <el-form-item label="商品名称:" prop="goodsName">
                                <el-input v-model="ruleForm.goodsName"></el-input>
                            </el-form-item>
                            <el-form-item label="副标题:" prop="goodsSubtitle">
                                <el-input v-model="ruleForm.goodsSubtitle"></el-input>
                            </el-form-item>
                            <el-form-item label="商品品牌:" prop="brandId">
                                <el-select v-model="ruleForm.brandId" placeholder="请选择品牌">
                                    <el-option :label="item.name" :value="String(item.id)" v-for="item in brandList"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="商品介绍:" prop="goodsDesc">
                                <el-input v-model="ruleForm.goodsDesc" type="textarea"></el-input>
                            </el-form-item>
                            <el-form-item label="商品货号:" prop="goodsNo">
                                <el-input v-model="ruleForm.goodsNo" type="number"></el-input>
                                <p class="form-tips">如果您不输入商品货号,系统将自动生成一个唯一的货号</p>
                            </el-form-item>
                            <el-form-item label="商品售价:" prop="goodsPrice">
                                <el-input v-model="ruleForm.goodsPrice" type="number"></el-input>
                            </el-form-item>
                            <el-form-item label="市场价:" prop="marketPrice">
                                <el-input v-model="ruleForm.marketPrice" type="number"></el-input>
                            </el-form-item>
                            <el-form-item label="商品库存:" prop="goodsStock">
                                <el-input v-model="ruleForm.goodsStock" type="number"></el-input>
                                <p class="form-tips">改设置只对单品有效, 当商品存在多规格货品是为不可编辑状态,库存数值取决于货品数量</p>
                            </el-form-item>
                            <el-form-item label="库存预警值:" prop="goodsWarning">
                                <el-input v-model="ruleForm.goodsWarning" type="number"></el-input>
                            </el-form-item>
                            <el-form-item label="计量单位:" prop="goodsUnit">
                                <el-input v-model="ruleForm.goodsUnit" type="number"></el-input>
                            </el-form-item>
                            <el-form-item label="商品重量:" prop="goodsWeight">
                                <el-input v-model="ruleForm.goodsWeight" type="number"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="stepActive = 0">上一步,选择商品分类</el-button>
                                <el-button type="primary" @click="submitForm('ruleForm')">下一步,填写商品属性</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div v-if="stepActive == 2">
                    <div class="form-item-3 flex">
                        <div class="form-label">商品属性</div>
                        <div class="flex-1">
                            <el-form class="form-prop" label-width="100px" v-loading="propLoading">
                                <el-form-item label="商品类型">
                                    <el-select v-model="ruleForm.styleId" placeholder="请选择商品类型" :disabled="!isAdd" @change="getProp">
                                        <el-option
                                                v-for="item in typeList"
                                                :key="item.id"
                                                :label="item.styleName"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="商品规格" v-if="propList.length > 0">
                                    <div class="prop-wrap">
                                        <el-checkbox-group v-model="checkProp" v-for="(item, index) in propList" :key="index">
                                            <div class="font-14 gray">{{ item.name }}</div>
                                            <el-checkbox v-for="prop in item.value" :label="item.name + prop" :key="prop.id">{{ prop }}</el-checkbox>
                                        </el-checkbox-group>
                                        <div>
                                            <el-button type="primary" size="small" v-if="isAdd" @click="addProps">添加</el-button>
                                        </div>
                                    </div>
                                </el-form-item>
                            </el-form>
                            <table class="goods-table" border="1" v-show="propSpecList.length > 0">
                                <thead>
                                <td v-for="item in propHeader"> {{ item }}</td>
                                <td>销售价格</td>
                                <td>商品库存</td>
                                <td>库存预警值</td>
                                </thead>
                                <tbody>
                                <tr v-for="item in propSpecList">
                                    <td v-for="val in item.nameValue"> {{ val.value }}</td>
                                    <td>
                                        <el-input v-model="item.goodsSalePrice" size="mini" type="number" :max="99999"></el-input>
                                    </td>
                                    <td>
                                        <el-input v-model="item.goodsStock" size="mini" type="number" :max="99999"></el-input>
                                    </td>
                                    <td>
                                        <el-input v-model="item.stockWarning" size="mini" type="number" :max="99999"></el-input>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="form-item-3 flex" v-loading="propLoading">
                        <div class="form-label">商品参数</div>
                        <div class="flex-1">
                            <table class="goods-table" border="1">
                                <thead>
                                <td>参数类型</td>
                                <td>录入参数</td>
                                </thead>
                                <tbody>
                                <tr v-for="(item, index) in paramsList">
                                    <td>{{ item.name || item.paramDetailName }}</td>
                                    <td>
                                        <el-select v-model="ruleForm.merchantParamDetailIds.merchantParamDetails[index].specificationsValue"
                                                   placeholder="请输入商品参数值">
                                            <el-option
                                                    v-for="val in item.list"
                                                    :label="val"
                                                    :value="val">
                                            </el-option>
                                        </el-select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>主材含量</td>
                                    <td>
                                        <el-input v-model="ruleForm.merchantParamDetailIds.paramsObject" size="mini"></el-input>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="form-item-3 flex">
                        <div class="form-label">商品相册</div>
                        <div class="flex-1">
                            <div class="flex">
                                <div class="upload-wrap" v-for="(item, index) in imgList" :key="index">
                                    <div class="img-wrap">
                                        <img :src="item" alt="">
                                        <i class="el-icon-picture" v-if="!item"></i>
                                    </div>
                                    <div class="flex h-center around">
                                        <span class="font-14 red" v-if="index == 0">商品主图</span>
                                        <span
                                                class="font-14 green table-btn"
                                                v-if="index != 0"
                                                @click="setMainPic(item, index)"
                                        >设为主图</span>
                                        <span class="font-14 green table-btn" @click="deleteImg(index)">删除图片</span>
                                    </div>
                                </div>
                            </div>
                            <div class="flex h-center">
                                <div class="upload-btn-wrap">
                                    <label for="upload">
                                        <el-button type="primary">上传图片</el-button>
                                    </label>
                                    <input type="file" id="upload" @change="uploadGoodImg" class="upload-input large" accept="image/jpeg, image/png">
                                </div>
                                <el-button type="primary" @click="dialogVisible = true">从图片库选择</el-button>
                            </div>
                            <p class="form-tips">最多可以上传5张图片，建议尺寸800*800px</p>
                        </div>
                    </div>
                    <div class="flex form-item-3">
                        <div class="form-label">商品详情</div>
                        <div class="flex-1">
                            <div class="editor">
                                <quill-editor
                                        v-model="ruleForm.goodsMobileImg"
                                        ref="myQuillEditor"
                                        :options="editorOption"
                                        class="editor"
                                ></quill-editor>
                            </div>
                        </div>
                    </div>
                </div>
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

    const toolbarOptions = [
        ["bold", "italic", "underline", "strike"], // toggled buttons
        ["blockquote", "code-block"],

        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }], // superscript/subscript
        [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
        [{ direction: "rtl" }], // text direction

        [{ size: ["small", false, "large", "huge"] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],
        ["link", "image", "video"],
        ["clean"] // remove formatting button
    ];

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
            let validGoodsWeight = (rule, value, callback) => {
                if (value < 0) {
                    callback(new Error("商品重量不能小于0"));
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
                stepActive: 2,
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
                    ],
                    brandId: [{require: true, message: "请选择品牌", trigger: 'change'}],
                    goodsDesc: [{require: true, message: "请输入商品介绍", trigger: "blur"}],
                    goodsPrice: [{require: true, message: "请输入商品售价", trigger: "blur"}],
                    goodsStock: [{require: true, validator: validGoodsStock, trigger: "blur"}],
                    goodsWarning: [{require: true, message: "请输入库存预警值", trigger: "blur"}],
                    goodsWeight: [{require: true, validator: validGoodsWeight, trigger: "blur"}]
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
                oldStyleId: "",
                oldPropList: [],
                oldCheckProp: [],
                oldPropHeader: [],
                oldCheckPropList: [],
                oldPropSpecList: [],
                oldMerchantParamDetailIds: {},
                headerList: [],
                childHeaderList: [],
                newFormData: {},
                quillUpdateImg: false,
                serverUtl: "https://ls.diandianyuyue.com",
                editorOption: {
                    placeholder: "",
                    theme: "snow",
                    modules: {
                        toolbar: {
                            container: toolbarOptions,
                            handlers: {
                                image: function (value) {
                                    if (value) {
                                        document.querySelector("#uploadEditor input").click();
                                    } else {
                                        this.quill.format("image", false);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        methods: {
            submit1() {
                this.stepActive = 1;
            },
            submitForm(val) {
                this.stepActive = 2;
            },
            getChildCategory(data) {
                this.ruleForm.childId = data.id;
                this.childCategoryName = data.typeName;
            },
            getCategory(data) {
                // console.log(data);
                // console.log(this.ruleForm);
                if (this.ruleForm.typeId != data.id) {
                    this.ruleForm.typeId = data.id;
                    this.ruleForm.childId = "";
                    this.childCategoryList = data.list;
                    this.categoryName = data.typeName;
                }
            },
            getProp() {

            },
            addProps() {

            }
        },
        mounted() {
            this.loading = true;
            this.$http.post("merchantGoodsType/query_goods_type_tree").then(res => {
                this.categoryList = res;
                // console.log(res);
                this.$http.post("merchant_goods_brand/query_list").then(res => {
                    this.brandList = res;
                    // console.log(res);
                    this.$http.post("merchantGoodsStyle/merchant_goods_style_list_page", {
                        currentPage: 1,
                        pageSize: 100
                    }).then(res => {
                        // console.log(res);
                        this.typeList = res.list;
                        this.$http.post("merchant_goods_galleries/query_for_page", {
                            currentPage: 1,
                            pageSize: 100
                        }).then(res => {
                            this.albumList = res.list;
                            this.$http.post("merchantNavigation/query_navigation_type_tree").then(res => {
                                this.headerList = res;
                                // console.log(this.$route);
                                if (this.$route.query.id) {
                                    this.isAdd = false;
                                    this.$http.post("merchantGoods/merchant_goods_by_id", {
                                        id: this.$route.query.id
                                    }).then(res => {
                                        this.categoryName = res.typeName;
                                        this.childCategoryName = res.childName;
                                        this.$set(this.ruleForm, "typeId", res.typeId); //直接设置this.ruleForm.typeId的值
                                        if (String(res.childId)) {
                                            this.$set(this.ruleForm, 'childId', res.childId); //直接设置this.ruleForm.childId的值
                                            this.categoryList.map(item => {
                                                if (item.id == res.typeId) {
                                                    this.childCategoryList = item.list;
                                                }
                                            });
                                        }
                                        this.$set(this.ruleForm, "goodsName", res.goodsName);
                                        this.$set(this.ruleForm, "goodsSubtitle", res.goodsSubtitle);
                                        this.$set(this.ruleForm, "brandId", res.brandId);
                                        this.$set(this.ruleForm, "goodsDesc", res.goodsDesc);
                                        this.$set(this.ruleForm, "goodsNo", res.goodsNo);
                                        this.$set(this.ruleForm, "goodsPrice", res.goodsPrice);
                                        this.$set(this.ruleForm, "marketPrice", res.marketPrice);
                                        this.$set(this.ruleForm, "goodsStock", res.goodsStock);
                                        this.$set(this.ruleForm, "goodsWarning", res.goodsWarning);
                                        this.$set(this.ruleForm, "goodsWeight", res.goodsWeight);
                                        this.$set(this.ruleForm, "goodsMobileImg", res.goodsMobileImg);
                                        this.$set(this.ruleForm, "merchantParamDetailIds", res.merchantParamDetailIds);
                                        this.$set(this.ruleForm, "styleId", res.styleId);
                                        this.$set(this.ruleForm, "navId", res.navId);
                                        this.$set(this.ruleForm, "navChildId", res.navChildId);
                                        if (String(res.navId)) {
                                            this.headerList.map(item => {
                                                if (item.id == res.navId) {
                                                    this.childHeaderList = item.list;
                                                }
                                            });
                                        }
                                        this.paramsList = res.merchantParamDetailIds.merchantParamDetails;
                                        this.propSpecList = res.merchantGoodsTypePropertyList;
                                        this.$http.post("merchantGoodsProperty/merchant_goods_property_list_page", {
                                            styleId: res.styleId,
                                            currentPage: 1,
                                            pageSize: 100
                                        }).then(data => {
                                            let list = [];
                                            data.list.map(item => {
                                                list.push({
                                                    name: item.propertyName,
                                                    value: item.propertyList.split(",")
                                                });
                                            });
                                            this.propList = list;
                                            this.checkPropList = res.map;
                                            let checkProp = [];
                                            let propHeader = [];
                                            this.checkPropList.map(item => {
                                                propHeader.push(item.name);
                                                item.value.map(prop => {
                                                    checkProp.push(item.name + prop);
                                                });
                                            });
                                            this.checkProp = checkProp;
                                            this.propHeader = propHeader;
                                            this.oldStyleId = res.styleId;
                                            this.oldPropList = list;
                                            this.oldCheckProp = checkProp;
                                            this.oldCheckPropList = res.map;
                                            this.oldPropHeader = propHeader;
                                            this.oldPropSpecList = res.merchantGoodsTypePropertyList;
                                            this.oldMerchantParamDetailIds = res.merchantParamDetailIds;
                                            if (res.goodsImg) {
                                                this.imgList = res.goodsImg.split(",");
                                            }
                                            this.loading = false;
                                        });
                                    });
                                }
                                this.loading = false;
                            });
                        });
                    });
                });
            });
        },
    }
</script>

<style scoped lang="scss">
    @import "~@/assets/css/common.scss";
    .form-wrap {
        margin-top: 50px;
        > div {
            width: 100%;
        }
        .form-label {
            width: 175px;
            height: 50px;
            line-height: 50px;
            color: #fff;
            padding: 0 20px;
            box-sizing: border-box;
            background-color: $green;
            position: relative;
            margin-right: 100px;
            &::after {
                content: "";
                display: block;
                position: absolute;
                top: 0;
                right: -50px;
                border: 25px solid transparent;
                border-left-color: $green;
            }
        }
        .select-category {
            margin-top: 40px;
            .title {
                height: 48px;
                line-height: 48px;
                border: $border;
                border-bottom-color: transparent;
                padding: 0 24px;
                box-sizing: border-box;
            }
            img {
                margin: 0 36px;
            }
            .flex-1 {
                max-width: 380px;
            }
            .category-list {
                height: 380px;
                position: relative;
                border: $border;
                box-sizing: border-box;
                overflow: auto;
                li {
                    height: 48px;
                    line-height: 48px;
                    color: $gray;
                    border-bottom: $border;
                    padding: 0 24px;
                    cursor: pointer;
                    i {
                        margin-top: 17px;
                    }
                }
                .active {
                    background-color: $green;
                    color: #ffffff;
                }
                .empty {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    color: $gray;
                }
            }
        }
        .tips {
            font-size: 14px;
            margin: 20px 0;
            span {
                color: $green;
            }
        }
        .form-tips {
            font-size: 12px;
            color: $gray;
            line-height: 16px;
            margin-top: 5px;
        }
    }
    .label2 {
        margin-top: 274px;
    }
    .form-info
    .form-prop {
        width: 500px;
    }
    .text-center {
        margin-top: 20px;
    }
</style>
