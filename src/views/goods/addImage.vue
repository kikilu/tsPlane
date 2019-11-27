<template>
    <div>
        <sub-title :sub-title="'添加图片库'" :is-refresh="false"></sub-title>
        <div class="body">
            <div class="form-wrap">
                <el-form ref="ruleForm" :model="ruleForm" label-width="150px" class="form" :rules="rules">
                    <el-form-item label="相册名称：" prop="name">
                        <el-input v-model="ruleForm.name" placeholder="请输入相册名称"></el-input>
                    </el-form-item>
                    <el-form-item label="相册封面：" prop="cover">
                        <img :src="ruleForm.cover" class="form-img" v-if="ruleForm.cover">
                        <div class="upload-btn-wrap">
                            <label for="upload">
                                <el-button type="primary" size="small">上传图片</el-button>
                            </label>
                            <input class="upload-input" type="file" id="upload" @change="uploadLogo" accept="image/jpeg, image/png">
                            <p class="form-tips">只能上传jpg/png格式的文件，文件不能超过50kb</p>
                        </div>
                    </el-form-item>
                    <el-form-item label="排序">
                        <el-input v-model="ruleForm.sorting"></el-input>
                    </el-form-item>
                    <el-form-item label="相册描述">
                        <el-input type="textarea" v-model="ruleForm.description"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="submitForm('ruleForm')" type="primary">提交</el-button>
                        <el-button @click="back">返回</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import subTitle from "../../components/subTitle";
    import mixin from "../../util/mixin";
    export default {
        name: "addImage",
        components: {
            subTitle
        },
        mixins: [mixin],
        data() {
            let validCover = (item, value, callback) => {
                if (!this.ruleForm.cover) {
                    callback(new Error("请上传相册封面"));
                } else {
                    callback();
                }
            };
            return {
                ruleForm: {
                    name: "",
                    cover: "",
                    sorting: "",
                    description: ""
                },
                rules: {
                    name: [
                        {required: true, message: "请输入相册名称", trigger: "blur"},
                        {max: 20, message: "最大不能超过20个字符", trigger: "change"}
                    ],
                    cover: {required: true, validator: validCover, trigger: "change"}
                }
            };
        },
        methods: {
            uploadLogo(file) {
                this.uploadFile(file).then(res => {
                    this.$set(this.ruleForm, 'cover', res.imgUrl);
                });
            },
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        if (this.isAdd) {
                            this.addEdit("merchant_goods_galleries/add");
                        } else {
                            this.$set(this.ruleForm, 'id', this.$route.query.id);
                            this.addEdit("merchant_goods_galleries/update");
                        }
                    } else {
                        return false;
                    }
                });
            },
            addEdit(url) {
                this.$http.post(url, this.ruleForm).then(() => {
                    this.$msgSuc("添加成功");
                    this.$router.push("/goods/image");
                }, err => {
                    this.$msgErr(err.msg);
                })
            }
        },
        created() {
            if (this.$route.query.id) {
                this.$http.post("merchant_goods_galleries/query_by_id",
                    {id: this.$route.query.id},
                    {type: 'form'}
                    ).then(res => {
                        // console.log(res);
                        this.isAdd = false;
                        this.setAttr(this.ruleForm, res);
                }, err => {
                    this.$msgErr(err.msg);
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "~@/assets/css/common.scss";
    .form {
        width: 600px;
    }
    .form-tips {
        font-size: 12px;
        color: $gray;
        line-height: 16px;
        margin-top: 5px;
    }

</style>
