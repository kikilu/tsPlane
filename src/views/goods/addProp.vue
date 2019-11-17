<template>
    <div>
        <sub-title :sub-title="'添加属性'" :is-refresh="false"></sub-title>
        <div class="body">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="form">
                <el-form-item label="属性名称：" prop="propertyName">
                    <el-input v-model="ruleForm.propertyName" placeholder="请输入属性名称"></el-input>
                </el-form-item>
                <el-form-item label="商品类型：">
                    <el-select v-model="ruleForm.styleId" placeholder="请选择类型">
                        <el-option
                                v-for="item in typeList"
                                :key="item.id"
                                :label="item.styleName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="属性是否可选">
                    <el-radio-group v-model="ruleForm.propertySelect" prop="propertySelect">
                        <el-radio :label="0" disabled>唯一属性</el-radio>
                        <el-radio :label="1" disabled>单选属性</el-radio>
                        <el-radio :label="2" disabled>复选属性</el-radio>
                    </el-radio-group>
                    <p class="form-tips">选择“单选/复选属性”时，可以对商品该属性设置多个值，同时还能对不同属性值指定不同的价格加价，用户购买商品时需要选定具体的属性值。选择“唯一属性”时，商品的该属性值只能设置一个值，用户只能查看该值</p>
                </el-form-item>
                <el-form-item label="属性值" prop="propertyList">
                    <el-tag
                            v-for="tag in dynamicTags"
                            :key="tag"
                            closable
                            @close="handleClose(tag)"
                            type="success"
                    >{{tag}}</el-tag>
                    <el-input
                            id="propInput"
                            class="input-new-tag"
                            v-model="inputValue"
                            v-if="inputVisible"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm"
                            @blur="handleInputConfirm"
                    ></el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">添加属性值</el-button>
                </el-form-item>
                <el-form-item label="属性排序：">
                    <el-input v-model="ruleForm.propertySort" placeholder="请输入属性排序"></el-input>
                    <p>排序级别最高的属性可单独上传属性图片</p>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    <el-button @click="back">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import subTitle from "../../components/subTitle";
    import mixin from "../../util/mixin";

    export default {
        name: "addProp",
        mixins: [mixin],
        components: {
            subTitle
        },
        data() {
            let validProp = (item, value, callback) => {
                // console.log("validProp");
                // console.log(callback);
                if (this.dynamicTags.length == 0) {
                    callback(new Error("请添加属性值"));
                } else if (this.ruleForm.propertySelect == 0 && this.dynamicTags.length > 1) {
                    callback(new Error("唯一属性只能添加一个属性值"));
                } else {
                    callback();
                }
            };
            return {
                inputValue: "",
                inputVisible: false,
                dynamicTags: [],
                typeList: [],
                ruleForm: {
                    propertyName: '',
                    styleId: '',
                    propertySelect: 1,
                    propertyList: "",
                    propertyOrder: ""
                },
                rules: {
                    propertyName: [
                        {required: true, message: "请输入属性名称", trigger: "blur"},
                        {max: 20, message: "长度必须小于20个字符", trigger: "blur"}
                    ],
                    styleId: [
                        {required: true, message: "请选择商品类型", trigger: "change"},
                    ],
                    propertyList: [
                        {validator: validProp, required: true, trigger: "change"}
                    ]
                }
            };
        },
        methods: {
            handleClose(tag) {
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            },
            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    if (this.dynamicTags.indexOf(inputValue) < 0) {
                        this.dynamicTags.push(inputValue);
                    } else {
                        this.$msgErr("已存在同名标签");
                    }
                }
                this.inputVisible = false;
                this.inputValue = "";
            },
            showInput() {
                this.inputVisible = true;
                this.$nextTick(() => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            submitForm(form) {
                this.$refs[form].validate(valid => {
                    if (valid) {
                        this.$set(this.ruleForm, "paramList", this.dynamicTags.join(","));
                        if (this.isAdd) {
                            this.addEdit("merchantGoodsParam/merchant_goods_type_add", this.ruleForm);
                        } else {
                            this.ruleForm.id = this.$route.query.id;
                            this.addEdit("merchantGoodsParam/merchant_goods_type_update", this.ruleForm);
                        }
                    } else {
                        return false;
                    }
                });
            }
        },
        mounted() {
            this.$http.post("merchantGoodsStyle/merchant_goods_type_list").then(res => {
                this.typeList = res;
                // console.log(res);
                // if (this.$route.query.id) {
                //     this.isAdd = false;
                //     this.$http.post("merchantGoodsProperty/merchant_goods_type_by_id", {id: this.$route.query.id}).then(res => {
                //         console.log(res);
                //         this.$set(this.ruleForm, 'propertyName', res.propertyName);
                //         this.$set(this.ruleForm, 'styleId', res.styleId);
                //         this.$set(this.ruleForm, 'propertySelect', res.propertySelect);
                //         this.$set(this.ruleForm, 'propertyOrder', res.propertyOrder);
                //         if (res.propertyList.length > 0) {
                //             this.dynamicTags = res.propertyList.split(",");
                //         }
                //     });
                // }
            });
        }
    }
</script>

<style scoped lang="scss">
    @import "~@/assets/css/common.scss";
    .form {
        width: 700px;
    }
    .form-tips {
        font-size: 12px;
        color: $gray;
        line-height: 16px;
        margin-top: 5px;;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 32px;
        padding-top: 0;
        padding-bottom: 0;
        text-align: center;
        vertical-align: middle;
    }
    .input-new-tag {
        margin-left: 10px;
        width: 90px;
    }
    .el-tag {
        color: #fff;
        background-color: #7ccdcc;
        border-color: #7ccdcc;
        margin-left: 10px;
    }


</style>
