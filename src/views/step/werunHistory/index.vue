<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
            <el-form-item label="姓名" prop="userName">
                
                <el-autocomplete
                    class="inline-input"
                    v-model="userName"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入用户姓名"
                    :trigger-on-focus="false"
                    @select="handleSelect"
                ></el-autocomplete>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
            <!-- <el-col :span="1.5">
                <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
                v-hasPermi="['system:post:add']"
                >新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                type="success"
                icon="el-icon-edit"
                size="mini"
                :disabled="single"
                @click=""
                v-hasPermi="['system:post:edit']"
                >修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click=""
                v-hasPermi="['system:post:remove']"
                >删除</el-button>
            </el-col> -->
            <el-col :span="1.5">
                <el-button
                type="warning"
                icon="el-icon-download"
                size="mini"
                @click="handleExport"
                v-hasPermi="['werun:history:export']"
                >导出</el-button>
            </el-col>
        </el-row>
        <el-table v-loading="loading" :data="werunList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="姓名" sortable align="center" prop="userName" />
            <el-table-column label="日期" sortable align="center" prop="werunSubmitDate" />
            <el-table-column label="最后更新时间" sortable align="center" prop="werunSubmitTime" />
            <el-table-column label="步数" sortable align="center" prop="werunCount" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="handleUpdate(scope.row)"
                    v-hasPermi="['werun:history:edit']"
                >修改</el-button>
                <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.row)"
                    v-hasPermi="['werun:history:remove']"
                >删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
        />

        <!-- 添加或修改岗位对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="姓名" prop="userName">
                    <el-input v-model="form.userName" placeholder="请输入姓名" />
                </el-form-item>
               <el-form-item label="步数" prop="werunCount">
                    <el-input v-model="form.werunCount" placeholder="请输入步数" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { listWerun,listUser,exportWerun,getWerun,updateWerun,delWerun} from "@/api/step/werunHistory";
export default {

    data(){
        return{
                // 非单个禁用
                single: true,
                // 非多个禁用
                multiple: true,
                // 总条数
                total: 0,
                // 遮罩层
                loading: true,
                //表格数据
                werunList: [],
                open:false,
                //注册用户数据
                registerList:[],
              // 查询参数
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    user_id: undefined,
                    isAsc:'desc',
                    orderByColumn: 'werunSubmitTime'
                },
                userName:'',
                restaurants:[],
                // 弹出层标题
                title: "",
                // 表单参数
                form: {},
                // 表单校验
                rules: {
                    userName: [
                    { required: true, message: "用户名称不能为空", trigger: "blur" }
                    ],
                    werunCount: [
                    { required: true, message: "步数不能为空", trigger: "blur" }
                    ]
                }

        }
    },
    created() {
        this.getUser();
    },
   
    methods:{
        /** 查询所有注册用户 */
        getUser() {
            this.loading = true;
            listUser().then(response => {
                this.registerList = response.rows;
                this.restaurants = this.registerList;
                this.getList();
            })
        },
         /** 查询运动历史列表 */
        getList() {
            listWerun(this.queryParams).then(response => {
                let data = response.rows;
                for(let i=0;i<data.length;i++){
                    for(let j=0;j<this.registerList.length;j++){
                        if(data[i].userId==this.registerList[j].userId){
                            data[i]['userName'] = this.registerList[j].nickname;
                        }
                    }
                }
                this.werunList = data;
                this.total = response.total;
                this.loading = false;
            });
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            his.single = selection.length!=1
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加历史数据";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            //this.reset();
            const postId = row.id;
            getWerun(postId).then(response => {
                
                for(let j=0;j<this.registerList.length;j++){
                    if(response.data.userId==this.registerList[j].userId){
                        response.data['userName'] = this.registerList[j].nickname;
                    }
                }
                this.form = response.data;
                this.open = true;
                this.title = "修改岗位";
            });
        },
         /** 删除按钮操作 */
        handleDelete(row) {
            const userIds = row.id;
            this.$confirm('是否确认删除该条数据?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function() {
                return delWerun(userIds);
            }).then(() => {
                this.getUser();
                this.msgSuccess("删除成功");
            }).catch(function() {});
        },
        /** 提交按钮 */
        submitForm: function() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.userId != undefined) {
                        this.form.updateTime = this.getDate(new Date()).fullTime;
                        updateWerun(this.form).then(response => {
                            if (response.code === 200) {
                                this.msgSuccess("修改成功");
                                this.open = false;
                                this.getUser();
                            }
                        });
                    } else {
                        addWerun(this.form).then(response => {
                        if (response.code === 200) {
                            this.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        }
                        });
                    }
                }
            });
        },
        // 表单重置
        reset() {
            this.form = {
                postId: undefined,
                postCode: undefined,
                postName: undefined,
                postSort: 0,
                status: "0",
                remark: undefined
            };
            this.resetForm("form");
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams;
            this.$confirm('是否确认导出所有数据项?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function() {
                    return exportWerun(queryParams);
                }).then(response => {
                    let data = response.rows;
                    console.log(response);
                //     for(let i=0;i<data.length;i++){
                //         for(let j=0;j<this.registerList.length;j++){
                //             if(data[i].userId==this.registerList[j].userId){
                //                 data[i]['userName'] = this.registerList[j].nickname;
                //             }
                //         }
                // }
                    this.download(response.msg);
            }).catch(function() {});
        },
        /* 搜索按钮操作 */
        handleQuery(){
            
            this.queryParams = {
                pageNum: 1,
                pageSize: 10,
                userName: this.userName,
                isAsc:'desc',
                orderByColumn: 'werunSubmitTime'
            }
            // this.queryParams = {
            //     page: 0,
            //     limit: 10,
            //     userId: '11111',
            //     sidx: 'T.WERUN_SUBMIT_DATE',
            //     asc: 'FALSE'
            // }
            // //this.queryParams.pageNum = 1;
            // if(!this.userName){
            //     this.queryParams.userId = '';
            // }
            // for(let i=0;i<this.registerList.length;i++){
            //     if(this.registerList[i].nickname ==this.userName){
            //         this.queryParams.userId = this.registerList[i].userId;
            //     }
            // };
            
            this.getList();
        },
         /** 重置按钮操作 */
        resetQuery() {
            this.userName = '';
            this.handleQuery();
        },
        querySearch(queryString, cb) {
            var restaurants = this.restaurants;
            for(let i=0;i<restaurants.length;i++){
                restaurants[i]['value']= restaurants[i].nickname;

            }
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        /* 选择姓名 */
        handleSelect(item) {
            console.log(item);
            this.userName = item.value;
            this.handleQuery()
        }
    }
}
</script>