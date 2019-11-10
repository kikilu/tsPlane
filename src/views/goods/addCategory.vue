<template>
    <div>
        <sub-title :sub-title="'添加分类'" :is-refresh="false"></sub-title>
        <div class="body" v-loading="loading">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="150px" class="form">
                <el-form-item label="分类名称:" prop="typeName">
                    <el-input v-model="ruleForm.typeName"></el-input>
                </el-form-item>
                <el-form-item label="上级分类:">
                    <el-select :disabled="isAddCategory" v-model="ruleForm.parentId" placeholder="请选择分类">
                        <el-option
                                v-for="item in categoryList"
                                :key="item.id"
                                :label="item.typeName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                    <p class="form-tips" v-if="!isAddCategory">不选择分类默认为顶级分类</p>
                </el-form-item>
                <el-form-item label="数量单位：" prop="goodsUnit">
                    <el-input v-model="ruleForm.goodsUnit"></el-input>
                </el-form-item>
                <el-form-item label="排序：">
                    <el-input v-model="ruleForm.goodsSort"></el-input>
                </el-form-item>
                <el-form-item label="是否显示：" prop="showStatus">
                    <el-radio-group v-model="ruleForm.showStatus">
                      <el-radio :label="0">显示</el-radio>
                      <el-radio :label="1">不显示</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="分类描述：">
                    <el-input v-model="ruleForm.typeDesc" type="textarea"></el-input>
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
        name: "addCategory",
        mixins: [mixin],
        components: {
            subTitle
        },
        data() {
            return {
                categoryList: [{id: 0, typeName: "顶级分类"}],
                isAddCategory: false,
                ruleForm: {
                    typeName: "",
                    parentId: 0,
                    goodsUnit: "",
                    goodsSort: "",
                    showStatus: "",
                    typeIcon: "",
                },
                rules: {
                    typeName: [
                        {required: true, message: "请输入分类名称", trigger: "blur"},
                        {max: 20, message: "长度必须小于20个字符", trigger: "blur"}
                    ],
                    goodsUnit: [
                        {required: true, message: "请输入数量单位", trigger: "blur"},
                        {max: 5, message: "长度必须小于5个字符", trigger: "blur"}
                    ],
                    showStatus: [
                        {required: true, message: "请选择显示与否", trigger: "change"}
                    ]
                },
                loading: false
            };
        },
        created() {
            this.$http.post("merchantGoodsType/query_goods_type_tree").then(res => {
                this.categoryList = [...this.categoryList, ...res];
                if (this.$route.query.id) {
                    this.isAdd = false;
                    this.loading = true;
                    this.$http.post("merchantGoodsType/merchant_goods_type_by_id", {
                        id: this.$route.query.id
                    }).then(res => {
                        this.$set(this.ruleForm, 'typeName', res.typeName);
                        this.$set(this.ruleForm, 'parentId', res.parentId);
                        this.$set(this.ruleForm, 'goodsUnit', res.goodsUnit);
                        this.$set(this.ruleForm, 'goodsSort', res.goodsSort);
                        this.$set(this.ruleForm, 'showStatus', res.showStatus);
                        this.$set(this.ruleForm, 'typeIcon', res.typeIcon);
                    }, err => {
                        this.$msgErr(err.msg);
                    }).finally(() => {
                        this.loading = false;
                    });
                }
                if (this.$route.query.parentId) {
                    this.$set(this.ruleForm, 'parentId', Number(this.$route.query.parentId));
                    this.isAddCategory = true;
                }
            });
        },
        methods: {
            submitForm(formName) {
                console.log(this.$refs);
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        if (this.isAdd) {
                            this.addEdit("merchantGoodsType/merchant_add_goods_type");
                        } else {
                            this.ruleForm.id = this.$route.query.id;
                            this.addEdit("merchantGoodsType/merchant_goods_type_update");
                        }
                    } else {
                        return false;
                    }
                });
            },
            uploadTypeIcon(file) {
                this.uploadFile(file).then(res => {
                    this.$set(this.ruleForm, 'typeIcon', res.imgUrl);
                });
            },
            addEdit(url) {
                this.$http.post(url, this.ruleForm).then(() => {
                    this.$msgSuc("操作成功");
                    setTimeout(() => {
                        this.$router.push("/goods/category");
                    }, 500);
                }, err => {
                    this.$msgErr(err.msg);
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "~@/assets/css/common";
    .form {
        width: 600px;
        .form-tips {
            font-size: 12px;
            color: $gray;
        }
    }
    .form-tips {
        font-size: 12px;
        color: $gray;
        line-height: 16px;
        margin-top: 5px;
    }
    .el-select {
        width: 170px;
        margin-right: 20px;
    }
</style>
