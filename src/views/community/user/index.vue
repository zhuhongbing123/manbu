<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
            <el-form-item label="姓名" prop="searchName">
            
                <el-input
                placeholder="请输入用户姓名或昵称"
                v-model="searchName"
                clearable>
                </el-input>
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
                
                @click=""
                v-hasPermi="['system:post:edit']"
                >修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
               
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:post:remove']"
                >删除</el-button>
            </el-col> -->
            <el-col :span="1.5">
                <el-button
                type="warning"
                icon="el-icon-download"
                size="mini"
                @click="handleExport"
                v-hasPermi="['mp:user:export']"
                >导出</el-button>
            </el-col>
        </el-row>
        <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="姓名" sortable align="center" prop="userName" />
            <el-table-column label="昵称" sortable align="center" prop="nickname" />
            <el-table-column label="手机号" sortable align="center" prop="mobile" />
            <el-table-column label="注册日期" sortable align="center" prop="registerTime" />
            <el-table-column label="上次登录日期" sortable align="center" prop="lastLoginTime" />
            <el-table-column label="上次登录IP" sortable align="center" prop="lastLoginIp" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="handleUpdate(scope.row)"
                    v-hasPermi="['mp:user:edit']"
                >修改</el-button>
                <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.row)"
                    v-hasPermi="['mp:user:remove']"
                >删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getUser"
        />
        
        <!-- 添加或修改用户对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="姓名" prop="userName">
                    <el-input v-model="form.userName" placeholder="请输入姓名" />
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="form.nickname" placeholder="请输入昵称" />
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="form.mobile" placeholder="请输入昵称" />
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
    import {listUser,addUser,getPost,updateUser,exportUser} from "@/api/community/user";
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
                //用户数据
                userList:[],
                open: false,
              // 查询参数
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    isAsc:'desc',
                    orderByColumn: 'registerTime'
                },
                 // 弹出层标题
                title: "",
                // 表单参数
                form: {},
                // 表单校验
                rules: {
                    userName: [
                    { required: true, message: "用户名称不能为空", trigger: "blur" }
                    ],
                    nickname: [
                    { required: true, message: "昵称不能为空", trigger: "blur" }
                    ],
                    mobile: [
                    { required: true, message: "手机号不能为空", trigger: "blur" }
                    ],
                    postCode: [
                    { required: true, message: "岗位编码不能为空", trigger: "blur" }
                    ],
                    postSort: [
                    { required: true, message: "岗位顺序不能为空", trigger: "blur" }
                    ]
                },
                searchName:''//搜索的名称
        }
    },
    created() {
        this.getUser();
    },
    methods:{
        /** 查询所有注册用户 */
        getUser() {
            this.loading = true;
            listUser(this.queryParams).then(response => {
                this.userList = response.rows;
                this.total = response.total;
                this.loading = false;
            })
        },
         
        // 多选框选中数据
        handleSelectionChange(selection) {
            
        },
         /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加历史数据";
        },
         // 表单重置
        reset() {
            this.form = {
                userName: undefined,
                
            };
            this.resetForm("form");
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        /** 提交按钮 */
        submitForm: function() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id != undefined) {
                        this.form.updateTime = this.getDate(new Date()).fullTime;
                        updateUser(this.form).then(response => {
                            if (response.code === 200) {
                                this.msgSuccess("修改成功");
                                this.open = false;
                                this.getUser();
                            }
                        });
                    } else {
                        addUser(this.form).then(response => {
                        if (response.code === 200) {
                            this.msgSuccess("新增成功");
                            this.open = false;
                            this.getUser();
                        }
                        });
                    }
                   
                }
            })
        },
         /** 修改按钮操作 */
        handleUpdate(row){
            this.reset();
            let id = row.id;
            getPost(id).then(val=>{
                this.form = val.data;
                 this.open = true;
                this.title = "修改注册用户";
            })
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams;
            this.$confirm('是否确认导出所有数据项?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function() {
                    return exportUser(queryParams);
                }).then(response => {
                    let data = response.rows;
                    console.log(data)
                  
                    this.download(response.msg);
            }).catch(function() {});
        },
         /** 重置按钮操作 */
        resetQuery() {
            this.searchName = '';
            this.handleQuery();
        },
        /* 搜索按钮操作 */
        handleQuery(){
            this.queryParams = {
                pageNum: 0,
                pageSize: 10,
                userName: this.searchName,
                isAsc:'desc',
                orderByColumn: 'registerTime'
            }
            
            this.getUser();
        },
    }
}
</script>