const path = require("path")
module.exports = {
    productionSourceMap: false, //是否打包sourcemap
    publicPath: "./",
    lintOnSave: false,
    // devServer: { //服务器配置
    //         proxy: { //proxy代理
    //             "/api": {
    //                 target: "http://47.107.167.164:8080",
    //                 ws: true,
    //                 changeOrigin: true,
    //                 pathRewrite: {
    //                     '^api': ''
    //                 }
    //             }
    //         }
    // },
    chainWebpack: config => {
        config.resolve.alias.set('_V', path.resolve(__dirname, 'src/views'));
    }
};
