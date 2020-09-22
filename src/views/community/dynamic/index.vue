<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
            <el-form-item label="文章标题" prop="searchTitle">
            
                <el-input
                placeholder="请输入文章标题"
                v-model="searchTitle"
                clearable>
                </el-input>
            </el-form-item>
            <el-form-item label="文章内容" prop="searchContent">
            
                <el-input
                placeholder="请输入文章内容"
                v-model="searchContent"
                clearable>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
             <el-col :span="1.5">
                <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
                 v-hasPermi="['gd:activity:add']"
                >新增</el-button>
            </el-col>
            <!--
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
                v-hasPermi="['gd:activity:export']"
                >导出</el-button>
            </el-col>
        </el-row>
        <el-table v-loading="loading" :data="dynamicList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="文章标题" align="center" prop="articleTitle" />
            <el-table-column label="文章发布人" align="center" prop="articleAuthor" />
            <el-table-column label="发布时间" align="center" prop="articleDate" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="handleView(scope.row)"
                    v-hasPermi="['gd:activity:edit']"
                >预览</el-button>
                <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="handleUpdate(scope.row)"
                    v-hasPermi="['gd:activity:edit']"
                >修改</el-button>
                <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.row)"
                    v-hasPermi="['gd:activity:remove']"
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

        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="980px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="公告标题" prop="articleTitle">
                        <el-input v-model="form.articleTitle" placeholder="请输入公告标题" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="文章作者" prop="articleAuthor">
                        <el-input v-model="form.articleAuthor" placeholder="请输入发布人" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="内容" prop="articleContent">
                            <Editor v-model="form.articleContent" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" style="padding-top:20px">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
    </el-dialog>

    <el-dialog :title="viewTitle" :visible.sync="dialogTableVisible">
        <div v-html="viewContent" class="view-content"></div>
    </el-dialog>
    </div>
</template>

<script>
    import { getDate} from "@/api/community/user";
    import {listDynamic, addDynamic, getDynamic, updateDynamic, exportDynamic, delDynamic} from "@/api/community/dynamic";
    import Editor from '@/components/Editor';

   
export default {
    components: {
        Editor
    },
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
                dynamicList: [],
                open:false,
     
              // 查询参数
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    user_id: undefined
                },
                userName:'',
                restaurants:[],
                // 弹出层标题
                title: "",
                // 表单参数
                form: {},
                // 表单校验
                rules: {
                    articleTitle: [
                    { required: true, message: "公告名称不能为空", trigger: "blur" }
                    ],
                    articleAuthor: [
                    { required: true, message: "发布人不能为空", trigger: "blur" }
                    ],
                    articleContent: [
                    { required: true, message: "内容不能为空", trigger: "blur" }
                    ]
                },
                searchTitle:'',//搜索标题
                searchContent:'',//搜索内容
                dialogTableVisible: false,
                viewTitle:'',
                viewContent:''

        }
    },
    created() {
        this.loading = true;
        this.getList();
        
    },
   
    methods:{

         /** 查询运动历史列表 */
        getList() {
            listDynamic(this.queryParams).then(response => {
                let data = response.rows;
                this.dynamicList = data;
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
            this.title = "添加历公告";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            const postId = row.id;
            getDynamic(postId).then(response => {
                
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
                return delDynamic(userIds);
            }).then(() => {
                 this.getList();
                this.msgSuccess("删除成功");
            }).catch(function() {});
        },
        /** 提交按钮 */
        submitForm: function() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id != undefined) {
                        this.form.updateTime = this.getDate(new Date()).fullTime;
                        updateDynamic(this.form).then(response => {
                            if (response.code === 200) {
                                this.msgSuccess("修改成功");
                                this.open = false;
                                this.getList();
                            }
                        });
                    } else {
                        this.form['articleDate'] = this.getDate(new Date()).fullDate;
                        addDynamic(this.form).then(response => {
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
                remark: undefined
            };
            this.resetForm("form");
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        //预览
        handleView(value){
            console.log(value)
            this.dialogTableVisible = true;
            this.viewTitle = value.articleTitle
            this.viewContent = value.articleContent
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams;
            this.$confirm('是否确认导出所有数据项?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function() {
                    return exportDynamic(queryParams);
                }).then(response => {
                    let data = response.rows;
                    console.log(response);
  
                    this.download(response.msg);
            }).catch(function() {});
        },

         /** 重置按钮操作 */
        resetQuery() {
            this.searchTitle = '';
            this.searchContent = '';
            this.handleQuery();
        },
        /* 搜索按钮操作 */
        handleQuery(){
            this.queryParams = {
                pageNum: 0,
                pageSize: 10,
                articleTitle: this.searchTitle,
                articleContent: this.searchContent
            }
            //this.queryParams.pageNum = 1;
            // if(!this.searchName){
            //     this.queryParams.id = '';
            // }
            // for(let i=0;i<this.dynamicList.length;i++){
            //     if(this.dynamicList[i].articleTitle ==this.searchTitle ){
            //         this.queryParams.id = this.dynamicList[i].id;
            //     }
            // };
            
            this.getList();
        },
   
    }
}
</script>
<style lang="scss">
    .view-content{
        width: 800px;
        height: 600px;
        display: contents;
        img{
            display: block;
            max-width: 100%;
        }
    }
    .el-dialog__body{
        height: 500px;
        overflow-y: auto;

    }
    .editor{
        height: 340px;
    }
</style>