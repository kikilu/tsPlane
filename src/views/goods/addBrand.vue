<template>
    <div>
        <sub-title :sub-title="'添加品牌'" :is-refresh="false"></sub-title>
        <div class="body">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="150px" class="form">
                <el-form-item label="品牌名称: " prop="name">
                    <el-input v-model="ruleForm.name" placeholder="请输入品牌名称"></el-input>
                </el-form-item>
                <el-form-item label="品牌首字母">
                    <el-input v-model="ruleForm.firstChar" placeholder="请输入品牌首字母"></el-input>
                </el-form-item>
                <el-form-item label="品牌LOGO" prop="logo">
                    <img ref="imgLogo" :src="ruleForm.logo" alt="" class="form-img" v-if="ruleForm.logo">
                    <div class="upload-btn-wrap">
                        <el-button type="primary" size="small">上传图片</el-button>
                        <input @change="uploadLogo" type="file" accept="image/jpeg, image/png" class="upload-input">
                        <p>只能上传jpeg/png格式的图片</p>
                    </div>
                </el-form-item>
                <el-form-item label="品牌专区大图">
                    <img :src="ruleForm.areaLogo" alt="" class="form-img" v-if="ruleForm.logo">
                    <div class="upload-btn-wrap">
                        <el-button type="primary" size="small">上传图片</el-button>
                        <input @change="uploadAreaLogo" type="file" accept="image/jpeg, image/png" class="upload-input">
                        <p>只能上传jpeg/png格式的图片</p>
                    </div>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="ruleForm.sorting" type="number"></el-input>
                </el-form-item>
                <el-form-item label="品牌故事">
                    <el-input v-model="ruleForm.story" type="textarea" placeholder="请输入品牌故事"></el-input>
                </el-form-item>
                <el-form-item label="是否显示" prop="isShow">
                    <el-radio-group v-model="ruleForm.isShow">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                    <p>当品牌下还没有商品的时候，分类页的品牌区将不会显示该品牌。</p>
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
    import mixin from "../../util/mixin"

    export default {
        name: "addBrand",
        components: {
            subTitle
        },
        mixins: [mixin],
        data() {
            let validLogo = (item, value, callback) => {
                debugger
                if (!this.ruleForm.logo) {
                    callback(new Error("请上传品牌logo"));
                } else {
                    callback();
                }
            }
            return {
                ruleForm: {
                    name: '',
                    logo: '',
                    areaLogo: '',
                    story: '',
                    isShow: '',
                    sorting: '',
                    firstChar: '',
                },
                rules: {
                    name: [
                        {required: true, message: "请输入品牌名字", trigger: "blur"},
                        {max: 20, message: "长度必须小于20个字符", trigger: "blur"}
                    ],
                    logo: [{validator: validLogo, required: true, trigger: "change"}],
                    isShow: [{required: true, message: "请选择是否显示", trigger: "change"}]
                }
            };
        },
        methods: {
            // 上传品牌LOGO
            uploadLogo(file) {
                // console.log(file);
                this.uploadFile(file).then(res => {
                    this.$set(this.ruleForm, "logo", res.imgUrl);
                });
            },
            // 上传品牌专区大图
            uploadAreaLogo(file) {
                this.uploadFile(file).then(res => {
                    this.$set(this.ruleForm, "areaLogo", res.imgUrl);
                });
            },
            submitForm(form) {
                this.$refs[form].validate(valid => {
                    if (valid) {
                        if (this.isAdd) {
                            this.addEdit("merchant_goods_brand/add");
                        } else {
                            this.$set(this.ruleForm, "id", this.$route.query.id);
                            this.addEdit("merchant_goods_brand/update");
                        }
                    } else {
                        return false;
                    }
                });
            },
            addEdit(url) {
                this.$http.post(url, this.ruleForm).then(() => {
                    this.$msgSuc("提交成功");
                    this.back();
                }, err => {
                    this.$msgErr(err.msg);
                });
            }
        },
        mounted() {

        },
        created() {
            if (this.$route.query.id) {
                this.$http.post("merchant_goods_brand/query_by_id", {id: this.$route.query.id}, {type: "form"}).then(res => {
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

</style>
