module.exports = {
    baseUrl: "./",
    lintOnSave: false,
    devServer: { //服务器配置
            proxy: { //proxy代理
                "/api": {
                    target: "http://47.107.167.164:8080",
                    ws: true,
                    changeOrigin: true,
                    pathRewrite: {
                        '^api': ''
                    }
                }
            }
    }
};
