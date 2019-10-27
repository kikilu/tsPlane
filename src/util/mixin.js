export default {
    data() {
        return {
            visibleSearch: false,
            input: '',
            currentPage: 1,
            pageSize: 10,
            pageCount: 0,
            total: 0,
            isAdd: true,
            loading: true,
            stockTypeList: [],
        }
    },
    methods: {
        addEdit(url, data) {
            this.$htt.post(url, data).then(() => {
                this.$msgSuc('提交成功');
            }, error => {
                this.$msgErr(error.msg);
            });
        },

        afterAddEdit() {
        },

        back() {
            this.$router.go(-1);
        },

        //时间选择器change时间
        handleDate(val) {
        },

        //获取入库类型
        getStockType(type) {
        },

        confirmBatch(val) {
            if (val && this.checkItemId.length > 0) {
                if (val == 'delete') {
                    this.remove(this.checkItemId);
                } else if (val == 'shift') {
                    this.shiftItem(this.checkItemId);
                } else if (val == 'restore') {
                    this.restore(this.checkItemId);
                } else if (val == 'show') {
                    this.batchShow(this.checkItemId, 1);
                } else if (val == 'hide') {
                    this.batchShow(this.checkItemId, 0);
                } else if (val == 'close') {
                    this.closeItem(this.checkItemId);
                }
            } else {
                this.$msgWar('未选择操作项');
            }
        },

        next(val) {
            this.currentPage = val;
            this.getList();
        },

        handleChangeAll(val) {
            if (val) {
                this.$refs.table.toggleAllSelection();
            } else {
                this.$refs.table.clearSelection();
            }
        },

        //表格selection事件
        tableSelection(val) {
            let checkItemId = [];
            if (val.length == this.tableData.length) {
                this.$refs.pagination._data.checkAll = true;
            } else {
                this.$refs.pagination._data.checkAll = false;
            }
            val.forEach((item) => {
                checkItemId.push(item.id);
            });
            this.checkItemId = checkItemId;
        },

        //显示商品图片
        getGoodImg(data) {
            if (data) {
                return data.split(',')[0];
            } else {
                return require('@/assets/image.png');
            }
        },

        getList(url, params) {
            console.log('mixin.getList');
            this.loading = true;
            let param = {
                currentPage: this.currentPage,
                pageSize: this.pageSize
            };
            this.$http.post(url, Object.assign(param, params)).then(res => {
                this.total = res.totalCount;
                this.tableData = res.list;
            }, err => {
                this.$msgErr(err.msg);
            }).finally(() => {
                this.loading = false;
            });
        },

        //搜索
        search() {
            this.currentPage = 1;
            this.getList();
        },

        //上传单张图片
        uploadFIle(file) {
        },

        //上传图片
        uploadFiles(file) {
        },

        //表头样式
        headerStyle() {
            return {
                color: '#595757',
                background: '#F6F6F6',
                fontSize: '15px',
                borderLeft: '1px solid #b4b4b4',
                borderTop: '1px solid #b4b4b4',
                textAlign: 'center'
            }
        },

        //表格样式
        tdStyle() {
            return {
                color: '#595757',
                fontSize: '15px',
                borderLeft: '1px solid #b4b4b4',
                borderTop: '1px solid #b4b4b4',
                textAlign: 'center'
            }
        },

        showSearch() {
            this.visibleSearch = !this.visibleSearch;
        }
    },
}
