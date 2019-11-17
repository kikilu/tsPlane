<template>
    <div>
        <sub-title :sub-title="'添加参数'" :is-refresh="false"></sub-title>
        <div class="body">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="form">
                <el-form-item label="参数名称：" prop="paramName">
                    <el-input v-model="ruleForm.paramName" placeholder="请输入参数名称"></el-input>
                </el-form-item>
                <el-form-item label="商品类型：" prop="styleId">
                    <el-select v-model="ruleForm.styleId" placeholder="请选择商品类型" class="search-input">
                        <el-option :value="item.id" :label="item.styleName" v-for="item in typeList"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="参数是否可选：" prop="paramSelect">
                    <el-radio-group v-model="ruleForm.paramSelect" :disabled="!isAdd">
                        <el-radio :label="0">唯一属性</el-radio>
                        <el-radio :label="1">单选属性</el-radio>
                        <el-radio :label="2">复选属性</el-radio>
                    </el-radio-group>
                    <p class="form-tips">选择“单选/复选属性”时，可以对商品该属性设置多个值，同时还能对不同属性值指定不同的价格加价，用户购买商品时需要选定具体的属性值。选择“唯一属性”时，商品的该属性值只能设置一个值，用户只能查看该值</p>
                </el-form-item>
                <el-form-item label="属性值：" prop="paramList">
                    <el-tag
                            v-for="tag in dynamicTags"
                            :key="tag"
                            closable
                            @close="handleClose(tag)"
                    >{{ tag }}</el-tag>
                    <el-input ref="saveTagInput" class="input-new-tag" v-if="inputVisible" v-model="inputValue" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"></el-input>
                    <el-button class="button-new-tag" v-else @click="showInput">添加属性值</el-button>
                </el-form-item>
                <el-form-item label="属性排序：" prop="paramSort">
                    <el-input v-model="ruleForm.paramSort" type="number" placeholder="请输入属性排序"></el-input>
                    <p class="form-tips">排序级别最高的属性可以单独上传属性图片</p>
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
        name: "addParams",
        components: {
            subTitle
        },
        mixins: [mixin],
        data() {
            let validParams = (item, value, callback) => {
                if (this.dynamicTags.length == 0) {
                    callback(new Error("请添加属性值"));
                } else if (this.ruleForm.paramSelect == 0 && this.dynamicTags.length > 1) {
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
                    paramName: "",
                    styleId: "",
                    paramSelect: 1,
                    paramList: "",
                    paramSort: ""
                },
                rules: {
                    paramName: [
                        {required: true, message: "请输入参数名称", trigger: "blur"},
                        {max: 20, message: "长度必须小于20字符", trigger: "blur"}
                    ],
                    styleId: [
                        {required: true, message: "请选择商品类型", trigger: "change"},
                    ],
                    paramList: [
                        {validator: validParams, required: true, trigger: "blur"}
                    ],
                    paramSort: [
                        {required: true, message: "请输入属性排序", trigger: "blur"}
                    ]
                }
            };
        },
        methods: {
            // 显示属性值输入框
            showInput() {
                this.inputVisible = true;
                this.$nextTick(() => {
                    this.$refs.saveTagInput.focus();
                });
            },
            // 添加属性值
            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue && this.dynamicTags.indexOf(inputValue) == -1) {
                    this.dynamicTags.push(inputValue);
                } else {
                    this.$msgErr("已存在同名标签");
                }
                this.inputVisible = false;
                this.inputValue = "";
            },
            // 提交表单
            submitForm(form) {
                this.$refs[form].validate(valid => {
                    if (valid) {
                        this.$set(this.rules, "paramList", this.dynamicTags.join(","));
                        if (!this.isAdd) {
                            this.ruleForm.id = this.$route.query.id;
                        }
                        this.addEdit("merchantGoodsParam/merchant_goods_type_add", this.ruleForm);
                    } else {
                        return false;
                    }
                });
            },
            // 移除属性值
            handleClose(item) {
                // console.log(item);
                this.dynamicTags.splice(this.dynamicTags.indexOf(item), 1);
            },


        },
        mounted() {
            this.$http.post("merchantGoodsStyle/merchant_goods_type_list").then(res => {
                this.typeList = res;
                if (this.$route.query.id) {
                    // console.log(this.$route.query.id);
                    this.isAdd = false;
                    //完蛋，又出bug了
                    this.$http.post("merchantGoodsParam/merchant_goods_type_by_id", {
                        id: this.$route.query.id
                    }).then(res => {
                        // console.log("res:" + res);
                        // this.$set(this.ruleForm, "paramName", res.paramName);
                        // this.$set(this.ruleForm, "styleId", res.styleId);
                        this.setAttr(this.ruleForm, res);
                    }, err => {
                        console.log("err:" + err);
                    });
                }
            });
        }
    }
</script>

<style scoped lang="scss">
    @import "~@/assets/css/common.scss";
    .form {
        width: 700px;
        .form-tips {
            font-size: 12px;
            color: $gray;
            line-height: 16px;
            margin-top: 5px;
        }
    }
    .el-tag {
        color: #fff;
        background-color: #7ccdcc;
        border-color: #7ccdcc;
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 34px;
        line-height: 30px;
        width: 90px;
        padding: 0;
        vertical-align: middle;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
    }
</style>
