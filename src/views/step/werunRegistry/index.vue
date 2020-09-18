<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
            <el-form-item label="姓名">
                
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
                @click=""
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
                v-hasPermi="['system:post:export']"
                >导出</el-button>
            </el-col>
        </el-row>
        <el-table v-loading="loading" :data="registerList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="姓名" align="center" prop="nickname" />
            <el-table-column label="电话" align="center" prop="mobile" />
            <el-table-column label="地址" align="center" prop="address" />
            <el-table-column label="注册日期" align="center" prop="registerTime" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="handleUpdate(scope.row)"
                    v-hasPermi="['system:post:edit']"
                >修改</el-button>
                <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.row)"
                    v-hasPermi="['system:post:remove']"
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
                <el-form-item label="姓名" prop="nickname">
                    <el-input v-model="form.nickname" placeholder="请输入姓名" />
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                      <el-input v-model="form.mobile" placeholder="请输入电话" />
                </el-form-item>
                <el-form-item label="地址" prop="address">
                      <el-input v-model="form.address" placeholder="请输入地址" />
                </el-form-item>
                <el-form-item label="注册日期">
                      <span>{{form.registerTime}}</span>
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
    import {listUser,getPost,updateUser,delUser,exportUser} from "@/api/step/werunRegistry";
export default {

    data(){
        return{
                // 遮罩层
                loading: true,
                //表格数据
                werunList: [],
                // 总条数
                total: 0,
                //注册用户数据
                registerList:[],
                open:false,
                //弹出框标题
                title:'',
                userName:'',
                //搜索框下拉值
                restaurants:[],
              // 查询参数
                queryParams: {
                    pageNum: 1,
                    pageSize: 10
                },
                // 表单参数
                form: {},
                // 表单校验
                rules: {
                    userName: [
                    { required: true, message: "用户名称不能为空", trigger: "blur" }
                    ],
                    mobile: [
                    { required: true, message: "电话不能为空", trigger: "blur" }
                    ],
                    address: [
                    { required: true, message: "地址不能为空", trigger: "blur" }
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
            listUser(this.queryParams).then(response => {
                this.registerList = response.rows;
                this.total = response.total;
                 this.restaurants = this.registerList;
                this.loading = false;
            })
        },
         
        // 多选框选中数据
        handleSelectionChange(selection) {
            
        },
        // 取消按钮
        cancel() {
            this.open = false;
            //this.reset();
        },
        /** 修改按钮操作 */
        handleUpdate(row){
            //this.reset();
            let id = row.id;
            getPost(id).then(val=>{
                this.form = val.data;
                 this.open = true;
                this.title = "修改注册用户";
            })
        },
        /** 提交按钮 */
        submitForm: function() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.userId != undefined) {
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
                            this.getList();
                        }
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const userIds = row.id;
            this.$confirm('是否确认删除用户的数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function() {
                return delUser(userIds);
            }).then(() => {
                this.getUser();
                this.msgSuccess("删除成功");
            }).catch(function() {});
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
        /* 选择姓名 */
        handleSelect(item) {
            console.log(item);
            this.userName = item.value;
            this.handleQuery()
        },
         /** 重置按钮操作 */
        resetQuery() {
            this.userName = '';
            this.handleQuery();
        },
        /* 搜索按钮操作 */
        handleQuery(){
            this.queryParams = {
                pageNum: 0,
                pageSize: 10,
                userName: this.userName
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
            
            this.getUser();
        },
        // 搜索框下拉显示
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
    }
}
</script>