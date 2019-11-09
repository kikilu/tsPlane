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
                                                v-for="item in categoryList"
                                                :class="ruleForm.typeId == item.id ? 'active' : ''"
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
                                            <el-checkbox
                                                    v-for="prop in item.value"
                                                    :label="item.name + prop"
                                                    :key="prop.id"
                                                    :disabled="!isAdd"
                                                    @change="handleCheckProp(prop, item.name, $event)"
                                            >{{ prop }}</el-checkbox>
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
                                        <el-input v-model="ruleForm.merchantParamDetailIds.mainMaterial" size="mini"></el-input>
                                    </td>
                                </tr>
                                <tr>
                                    <td>适用对象</td>
                                    <td>
                                        <el-input v-model="ruleForm.merchantParamDetailIds.paramObject" size="mini"></el-input>
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
                                    <input type="file" multiple="multiple" id="upload" @change="uploadGoodImg" class="upload-input large" accept="image/jpeg, image/png">
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
                                <el-upload
                                        id="uploadEditor"
                                        hidden
                                        :action="serverUtl"
                                        accept="image/jpeg, image/png"
                                        :http-request="uploadEditor"
                                >
                                </el-upload>
                            </div>
                            <div style="margin-top: 80px">
                                <el-button @click="stepActive = 1">上一步，填写商品信息</el-button>
                                <el-button type="primary" @click="submitGood">下一步，选择商品类目</el-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="stepActive == 3">
                    <div class="flex">
                        <div class="form-label">关联目录</div>
                        <div class="flex-1">
                            <p class="form-tips">*类目非必选 | 选择了一级类目必须选择二级类目</p>
                            <div class="select-category flex h-center" style="margin-top: 20px">
                                <div class="flex-1">
                                    <div class="title font-18 gray bold">选择一级类目</div>
                                    <ul class="category-list">
                                        <li :class="ruleForm.navId == item.id ? 'active' : ''"
                                            v-for="item in headerList"
                                            @click="getHeader(item)"
                                        >
                                            <span>{{item.navName}}</span>
                                            <i class="el-icon-arrow-right fr"></i>
                                        </li>
                                    </ul>
                                </div>
                                <img src="@/assets/icon-arrow.png" alt="">
                                <div class="flex-1">
                                    <div class="title font-18 gray bold">选择二级类目</div>
                                    <ul class="category-list" v-if="childHeaderList.length > 0">
                                        <li
                                                :class="ruleForm.navChildId == item.id ? 'active' : ''"
                                                @click="getChildHeader(item)"
                                                v-for="item in childHeaderList"
                                        >{{item.navName}}</li>
                                    </ul>
                                    <div class="category-list" v-if="childHeaderList.length == 0">
                                        <span class="empty">暂无类目</span>
                                    </div>
                                </div>
                            </div>
                            <div style="margin-top: 20px">
                                <el-button @click="stepActive = 2">上一步，填写商品属性</el-button>
                                <el-button type="primary" @click="submitGoods">完成，提交商品</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
<!--        相册库弹窗-->
        <el-dialog
                title="从图库选择"
                :visible.sync="dialogVisible"
                :append-to-body="true"
        >
            <div class="flex between h-center">
                <span>商品图库 > 全部图片</span>
                <el-select v-model="input" placeholder="请选择图库分类" @change="getAlbumImg" size="small" class="search-input">
                    <el-option
                            v-for="item in albumList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="img-table flex">
                <div v-for="(item, index) in albumImgList" :key="index" @click="checkAlbumImg(item)">
                    <img :src="item.imgUrl" alt="">
                    <i class="el-icon-success" v-if="isIdExits(item).exits"></i>
                </div>
            </div>
            <pagination
                    :is-batch="false"
                    @next="next"
                    :total="total"
                    :pageSize="pageSize"
                    class="pagination"
            ></pagination>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="addImg">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import subTitle from "../../components/subTitle";
    import pagination from "../../components/pagination";
    import { quillEditor } from "vue-quill-editor";
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
                if (value === '') {
                    callback(new Error('请输入商品重量'));
                }
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
                stepActive: 3,
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
                        {required: true, message: "请输入商品名称", trigger: 'blur'},
                        {max: 20, message: "长度必须小于20个字符"}
                    ],
                    goodsSubtitle: [
                        {required: true, message: "请输入副标题", trigger: 'blur'},
                        {max: 20, message: "长度必须小于20个字符"}
                    ],
                    brandId: [{required: true, message: "请选择品牌", trigger: 'change'}],
                    goodsDesc: [{required: true, message: "请输入商品介绍", trigger: "blur"}],
                    goodsPrice: [{required: true, message: "请输入商品售价", trigger: "blur"}],
                    goodsStock: [{required: true, validator: validGoodsStock, trigger: "blur"}],
                    goodsWarning: [{required: true, message: "请输入库存预警值", trigger: "blur"}],
                    goodsWeight: [{required: true, validator: validGoodsWeight, trigger: "blur"}]
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
                checkAlbumImgList: [],
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
                    placeholder: "请输入商品详细信息",
                    theme: "snow",
                    modules: {
                        toolbar: {
                            container: toolbarOptions,
                            handlers: {
                                image: function (value) {
                                    if (value) {
                                        //如果插入了图片，则触发uploadEditor()函数
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
                this.$refs[val].validate(valid => {
                    if (valid) {
                        this.stepActive = 2;
                        document.documentElement.scrollTop = 0;
                    } else {
                        return false;
                    }
                });
            },
            getChildCategory(data) {
                this.ruleForm.childId = data.id;
                this.childCategoryName = data.typeName;
            },
            getCategory(data) {
                // console.log(data);
                this.ruleForm.childId = "";
                this.childCategoryName = "";
                if (this.ruleForm.typeId != data.id) {
                    this.ruleForm.typeId = data.id;
                    this.ruleForm.childId = "";
                    this.childCategoryList = data.list;
                    this.categoryName = data.typeName;
                }
            },
            getProp(val) {
                // console.log(val);
                // console.log(this.oldStyleId);
                // console.log(this.typeList);
                console.log(this.oldCheckPropList);
                if (val == this.oldStyleId) {
                    this.propList = this.oldPropList;
                    this.checkProp = this.oldCheckProp;
                    this.checkPropList = this.oldCheckPropList;
                    this.propHeader = this.oldPropHeader;
                    this.propSpecList = this.oldPropSpecList;
                    this.ruleForm.merchantParamDetailIds = this.oldMerchantParamDetailIds;
                    this.$http.post("merchantGoodsParam/merchant_goods_property_list_page", {
                        styleId: val,
                        currentPage: 1,
                        pageSize: 100
                    }).then(res => {
                        let list = [];
                        res.list.map(item => {
                            list.push({
                                name: item.paramName,
                                list: item.paramList.split(",")
                            });
                        });
                        this.paramsList = list;
                    });
                } else {
                    this.checkProp = [];
                    this.checkPropList = [];
                    this.propHeader = [];
                    this.propSpecList = [];
                    this.propLoading = true;
                    this.$http.post("merchantGoodsProperty/merchant_goods_property_list_page", {
                            styleId: val,
                            currentPage: 1,
                            pageSize: 100
                        }).then(res => {
                            let propList = [];

                            // console.log(res);
                            res.list.map(item => {
                                propList.push({
                                    name: item.propertyName,
                                    value: item.propertyList.split(",")
                                });
                            });
                            this.propList = propList;
                            let paramsList = [];
                            let formList = [];
                            this.$http.post("merchantGoodsParam/merchant_goods_property_list_page", {
                                styleId: val,
                                currentPage: 1,
                                pageSize: 100
                            }).then(res => {
                                res.list.map(item => {
                                    paramsList.push({
                                        name: item.paramName,
                                        list: item.paramList.split(",")
                                    });
                                    formList.push({
                                        paramDetailName: item.paramName,
                                        specificationsValue: ''
                                    });
                                })
                            });
                            this.paramsList = paramsList;
                            this.$set(this.ruleForm, "merchantParamDetailIds", {
                                merchantParamDetails: formList,
                                mainMaterial: "",
                                paramObject: ""
                            });
                            this.propLoading = false;
                    });
                }
            },
            addProps() {
                if (!this.ruleForm.styleId) {
                    this.$msgWar("请选择商品类型");
                    return;
                }
                if (this.checkPropList == 0) {
                    this.$msgWar("请选择商品属性");
                    return;
                }
                let propHeader = [];
                let propArr = [];
                this.checkPropList.map((item, index) => {
                    propHeader.push(item.name);
                    propArr[index] = [];
                    this.checkPropList[index].value.map(val => {
                        propArr[index].push({
                            name: this.checkPropList[index].name,
                            value: val
                        });
                    });
                });
                this.propHeader = propHeader;
                console.log(propArr);
                let propItem = sortAll(propArr);
                console.log(propItem);
                this.propSpecList = [];
                propItem.map(item => {
                    this.propSpecList.push({
                        nameValue: item instanceof Array ? item : [item],
                        goodsSalePrice: "",
                        goodsStock: "",
                        stockWarning: "",
                        skuCode: ""
                    });
                });
                console.log(this.propSpecList);
                function sortAll(arr) {
                    var len = arr.length;
                    if (len >= 2) {
                        var len1 = arr[0].length;
                        var len2 = arr[1].length;
                        var lenBoth = len1 * len2;
                        var items = new Array(lenBoth);
                        var index = 0;
                        for (var i = 0; i < len1; i++) {
                            for (var j = 0; j < len2; j++) {
                                if (arr[0][i] instanceof Array) {
                                    items[index] = [...arr[0][i], arr[1][j]];
                                } else {
                                    items[index] = [arr[0][i], arr[1][j]];
                                }
                                index++;
                            }
                        }
                        var newArr = new Array(len - 1);
                        for (var i = 0; i < arr.length; i++) {
                            newArr[i - 1] = arr[i];
                        }
                        newArr[0] = items;
                        return sortAll(newArr);
                    } else {
                        return arr[0];
                    }
                }
            },
            //设置主图片
            setMainPic(url, index) {
                this.imgList.splice(index, 1);
                this.imgList.unshift(url);
            },
            //删除图片
            deleteImg(index) {
                this.imgList.splice(index, 1);
            },
            //上传图片
            uploadGoodImg(file) {
                // console.log(this.imgList);
                let files = file.target.files;
                if (files.length + this.imgList.length > 5) {
                    this.$msgWar("图片最多5张");
                    return;
                }
                //创建任务队列
                let promiseList = [];
                for (let i = 0; i < files.length; i++) {
                    if (files[i] == []) {
                        continue;
                    }
                    //将要上传的图片加入任务队列
                    promiseList.push(this.uploadFiles(files[i]));
                }
                // console.log(promiseList);
                //执行任务队列
                Promise.all(promiseList).then(res => {
                    res.map(item => {
                        this.imgList.push(item.imgUrl);
                    });
                }, err => {
                    this.$msgErr("上传失败" + err.msg);
                });
            },
            uploadEditor(files) {
                console.log("uploadEditor");
                console.log(files);
                this.uploadFiles(files.file).then(res => {
                    let imgUrl = res.imgUrl;
                    if (imgUrl) {
                        let quill = this.$refs.myQuillEditor.quill;
                        let length = quill.getSelection().index;
                        quill.insertEmbed(length, "image", imgUrl);
                        quill.setSelection(length + 1);
                    } else {
                        this.$msgErr("上传失败");
                    }
                });
            },
            submitGood() {
                //提交产品信息
                let formData = this.ruleForm;
                if (!formData.styleId) {
                    this.$msgWar("请选择商品类型");
                    return;
                }
                if (this.checkPropList.length == 0) {
                    this.$msgWar("请选择商品规格");
                    return;
                }
                if (this.propSpecList.length == 0) {
                    this.$msgWar("请选择商品规格列表");
                    return;
                }
                for (let i = 0; i < this.propSpecList.length; i++) {
                    let data = this.propSpecList[i];
                    if (!data.goodsSalePrice || !data.goodsStock || !data.stockWarning) {
                        this.$msgWar("请填写完整商品规格列表");
                        return;
                    }
                    if (data.goodsStock > 99999 || data.stockWarning > 99999) {
                        this.$msgWar("库存最大值为99999");
                        return;
                    }
                    if (data.goodsSalePrice < 0) {
                        this.$msgWar("规格列表销售价格不能小于0");
                        return;
                    }
                    if (data.goodsStock < 0) {
                        this.$msgWar("规格列表库存不能小于0");
                        return;
                    }
                    if (data.goodsWarning < 0) {
                        this.$msgWar("规格列表库存预警值不能小于0");
                        return;
                    }
                }
                let details = formData.merchantParamDetailIds.merchantParamDetails;
                for (let i = 0; i < details.length; i++) {
                    if (!details[i].specificationsValue) {
                        this.$msgWar("请选择商品参数");
                        return;
                    }
                }
                if (!formData.merchantParamDetailIds.mainMaterial || !formData.merchantParamDetailIds.paramObject) {
                    this.$msgWar("请填写商品参数");
                    return;
                }
                if (this.imgList.length == 0) {
                    this.$msgWar("请上传产品图片");
                    return;
                }
                this.stepActive = 3;
            },
            //添加商品属性
            handleCheckProp(prop, name, $event) {
                //如果复选框被选中，将选中的商品属性加入this.checkPropList中
                if ($event) {
                    if (this.checkPropList.length == 0) {
                        this.checkPropList.push({
                            name: name,
                            value: [prop]
                        });
                    } else {
                        // debugger;
                        let isExist = false;
                        for (let i = 0; i < this.checkPropList.length; i++) {
                            if (this.checkPropList[i].name == name) {
                                this.checkPropList[i].value.push(prop);
                                isExist = true;
                                break;
                            }
                        }
                        if (!isExist) {
                            // debugger;
                            this.checkPropList.push({
                                name: name,
                                value: [prop]
                            });
                        }
                    }
                } else {
                    //如果复选框被取消，则将this.checkPropList中对应的商品属性去除
                    // debugger;
                    for (let i = 0; i < this.checkPropList.length; i++) {
                        if (this.checkPropList[i].name == name) {
                            for (let j = 0; j < this.checkPropList[i].value.length; j++) {
                                if (this.checkPropList[i].value[j] == prop) {
                                    this.checkPropList[i].value.splice(j, 1);
                                    if (this.checkPropList[i].value.length == 0) {
                                        this.checkPropList.splice(i, 1);
                                    }
                                    return;
                                }
                            }
                        }
                    }
                }
            },
            //获取图库图片
            getAlbumImg(val) {
                console.log(val);
                this.albumId = val;
                this.$http.post("merchant_goods_galleries_detail/query_for_page", {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    galleriesId: val
                }).then(res => {
                    console.log(res);
                    this.albumImgList = res.list;
                    this.total = res.totalCount;
                });
            },
            //从图库中添加图片
            checkAlbumImg(item) {
                // console.log(item);
                var exits = this.isIdExits(item);
                if (!exits.exits) {
                    if (this.checkAlbumImgList.length + this.imgList.length >= 5) {
                        this.$msgWar("最多添加5张");
                        return;
                    }
                    this.checkAlbumImgList.push({id:item.id, imgUrl: item.imgUrl});
                } else {
                    this.checkAlbumImgList.splice(exits.index, 1);
                }
            },
            isIdExits(item) {
                for (let i = 0; i < this.checkAlbumImgList.length; i++) {
                    if (this.checkAlbumImgList[i].id == item.id) {
                        return {exits: true, index: i};
                    }
                }
                return {exits: false, index: -1};
            },
            //将图库中选中的图片插入imgList中
            addImg() {
                var temp = [];
                this.checkAlbumImgList.map(item => {
                    temp.push(item.imgUrl);
                });
                this.imgList = [...this.imgList, ...temp];
                this.checkAlbumImgList = [];
                this.dialogVisible = false;
            },

            next(val) {
                this.currentPage = val;
                this.getAlbumImg(this.albumId);
            },
            getHeader(item) {
                console.log(this.ruleForm);
                console.log(item);
                if (this.ruleForm.navId != item.id) {
                    this.ruleForm.navId = item.id;
                    this.ruleForm.navChildId = "";
                    this.childHeaderList = item.list;
                } else {
                    this.ruleForm.navId = "";
                    this.ruleForm.navChildId = "";
                    this.childHeaderList = [];
                }
            },
            getChildHeader(item) {
                this.ruleForm.navChildId = item.id;
            },
            submitGoods() {
                if (this.ruleForm.navId && !this.ruleForm.navChildId) {
                    this.$msgWar("选择了一级类目必须选择二级类目");
                    return;
                }
                let formData = JSON.parse(JSON.stringify(this.ruleForm));
                if (!formData.merchantParamDetailIds.merchantParamDetails) {
                    formData.merchantParamDetailIds.merchantParamDetails = [];
                }
                formData.goodsImg = this.imgList.join(",");
                formData.merchantSpecification = this.checkPropList;
                formData.merchantGoodsTypePropertyList = this.propSpecList;
                if (this.isAdd) {
                    this.$http.post("merchantGoods/merchant_goods_add", formData).then(() => {
                        this.$msgSuc("添加商品成功");
                        setTimeout(() => {
                            this.back();
                        }, 500);
                    }, err => {
                        this.$msgErr(err.msg);
                    });
                } else {
                    formData.id = this.$router.query.id;
                    this.$http.post("merchantGoods/merchant_goods_update", formData).then(() => {
                        this.$msgSuc("修改成功");
                        setTimeout(() => {
                            this.back();
                        }, 500);
                    }, err => {
                        this.$msgErr(err.msg);
                    });
                }
            }
        },
        mounted() {
            this.loading = true;
            //获取商品类型列表
            this.$http.post("merchantGoodsType/query_goods_type_tree").then(res => {
                this.categoryList = res;
                // console.log(res);
                //获取商品品牌列表
                this.$http.post("merchant_goods_brand/query_list").then(res => {
                    this.brandList = res;
                    // console.log(res);
                    //获取给定页商品样式列表
                    this.$http.post("merchantGoodsStyle/merchant_goods_style_list_page", {
                        currentPage: 1,
                        pageSize: 100
                    }).then(res => {
                        // console.log(res);
                        this.typeList = res.list;
                        //获取给定页商品展示
                        this.$http.post("merchant_goods_galleries/query_for_page", {
                            currentPage: 1,
                            pageSize: 100
                        }).then(res => {
                            this.albumList = res.list;
                            //获取商品导航
                            this.$http.post("merchantNavigation/query_navigation_type_tree").then(res => {
                                this.headerList = res;
                                // console.log(this.$route);
                                if (this.$route.query.id) {
                                    console.log("================================================================");
                                    this.isAdd = false;
                                    //根据商品id获取商品详细信息
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
        .form-item-3 {
            margin-bottom: 40px;
            &:last-child > .form-label {
                margin-bottom: 20px;
            }
        }
        .search-input {
            width: 200px;
            margin: 0 15px;
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
        .text-center {
            margin-top: 20px;
        }
        .form-tips {
            font-size: 12px;
            color: $gray;
            line-height: 16px;
            margin-top: 5px;
        }
        .prop-wrap {
            padding: 20px;
            border: $border;
            border-radius: 4px;
        }
    }
    .upload-wrap {
        margin-right: 20px;
        margin-bottom: 20px;
        border: $border;
        .img-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 160px;
            height: 160px;
            border-bottom: $border;
            i {
                color: $gray;
                font-size: 30px;
            }
            img {
                width: 100%;
                height: 100%;
            }
        }
        > div:last-child {
            height: 40px;
            background-color: #f8f9fc;
        }
    }
    .dialog-footer {
        button:last-child {
            margin-right: 0;
        }
    }
    .img-table {
        margin-top: 20px;
        div {
            width: 150px;
            height: 150px;
            margin-right: 20px;
            margin-bottom: 20px;
            position: relative;
            img {
                width: 100%;
                height: 100%;
            }
            i {
                position: absolute;
                right: 0;
                top: 0;
                color: green;
                background-color: #fff;
                border-radius: 50%;
                font-size: 24px;
            }
        }
    }
    .goods-table {
        border-radius: 4px;
        border-right: $border;
        border-bottom: $border;
        thead {
            background-color: #eeeeee;
        }
        td {
            height: 50px;
            color: $gray;
            text-align: center;
            border-left: $border;
            border-top: $border;
            padding: 0 20px;
        }
    }
    .form-params {
        .mall-btn {
            margin-bottom: 20px;
        }
    }
    .pagination {
        border: $border;
        background-color: #fff;
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
    .editor {
        width: 800px;
        height: 300px;
        padding-bottom: 20px;
    }
    .upload-btn-wrap {
        margin-right: 20px;
    }
</style>
