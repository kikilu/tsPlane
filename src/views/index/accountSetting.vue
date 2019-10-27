<template>
    <div class="accountSetting">
        <sub-title :sub-title="'用户设置'"></sub-title>
        <div class="body">
            <div class="div-middle">
                <el-upload
                    class="upload-demo"
                    action
                    :http-request="uploadFile"
                    accept="image/jpeg, image/png"
                    :show-file-list="false"
                >
                    <img class="uploading-img-img" :src="avatar" alt="">
                    <div slot="tip" class="el-upload__tip">上传头像</div>
                </el-upload>
                <el-form
                        :model="ruleForm"
                        :rules="rules"
                        ref="ruleForm"
                        label-width="150px"
                        class="demo-ruleForm"
                        required
                >
                    <el-form-item label="用户名" prop="name">
                        <el-input v-model="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="旧密码" prop="oldPassword">
                        <el-input v-model="ruleForm.oldPassword" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPassword">
                        <el-input v-model="ruleForm.newPassword" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="确定密码" prop="twicePassword">
                        <el-input v-model="ruleForm.twicePassword" type="password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="update('ruleForm')" type="primary">提交</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import subTitle from "../../components/subTitle";
    export default {
        name: 'accountSetting',
        components: {
            subTitle
        },
        data() {
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error("请再次输入密码"));
                } else if (this.ruleForm.twicePassword !== this.ruleForm.newPassword) {
                    callback(new Error("两次输入密码不一致"));
                } else {
                    callback();
                }
            };
            return {
                avatar: "",
                ruleForm: {
                    name: "",
                    oldPassword: "",
                    newPassword: "",
                    twicePassword: "",
                    merchantLogo: ""
                },
                rules: {
                    name: [{required: true, message: "请输入用户名", trigger: "blur"}],
                    oldPassword: [{required: true, message: "请输入旧密码", trigger: "blur"}],
                    newPassword: [{required: true, message: "请输入新密码", trigger: "blur"}],
                    twicePassword: [{required: true, trigger: "blur", validator: validatePass2}]
                }
            };
        },
        created() {
            this.userInfo = JSON.parse(this.$store.getters.userInfo);
            this.ruleForm.name = this.userInfo.merchantName;
            this.ruleForm.merchantLogo = this.userInfo.merchantLogo;
            this.avatar = "http://k.zol-img.com.cn/sjbbs/7692/a7691515_s.jpg";
        },
        methods: {
            uploadFile(file) {
                let formData = new FormData();
                formData.append("file", file.file);
                // console.log(formData.get('file'));
                this.$http.post("merchant/upload_file", formData, {
                    type: "form",
                    file: "image"
                }).then(res => {
                    // console.log(res);
                    this.ruleForm.merchantLogo = res.image;
                    this.avatar = this.userInfo.imgUrl + res.image;
                });
            },
            update(formName) {
                this.$refs[formName].validate(valid => {
                    console.log(valid);
                    if (valid) {
                        this.$http.post("/merchant/change_password", this.ruleForm, {type: "form"}).then(() => {
                            this.userInfo.merchantName = this.ruleForm.name;
                            this.userInfo.merchantLogo = this.ruleForm.merchantLogo;
                            this.$msgSuc("修改成功");
                            this.ruleForm.oldPassword = "";
                            this.ruleForm.newPassword = "";
                            this.ruleForm.twicePassword = "";
                            this.$store.commit("SET_USERINFO", JSON.stringify(this.userInfo));
                        }, error => {
                            this.$msgErr(error.msg);
                        });
                    } else {
                        return false;
                    }
                });
            }
        }
    };
</script>

<style scoped lang="scss">
    .el-form-item__error {
        left: 26px;
    }
    .body {
        .div-middle {
            text-align: center;
            .el-form-item__label {
                float: none;
                clear: both;
            }
            .el-form-item {
                width: 400px;
                margin: 26px auto;
            }
            button {
                background: #5BC0BF;
                color: #fff;
            }
            .el-alert__content {
                display: inline-block;
                .el-input {
                    display: inline-block;
                    width: 100%;
                }
            }
        }
    }
    .uploading-img-img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }
    .demo-ruleForm {
        margin-left: -120px;
    }
</style>
