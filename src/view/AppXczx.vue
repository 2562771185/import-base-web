<template>
  <div class="app-container">
    <el-main>
      <h1>乡村振兴人员信息导入</h1>
      <!--      表单-->
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="下载模板：">
          <el-link type="primary" @click="downloadTemplateExcel()">人员信息
          </el-link>
        </el-form-item>
        <el-form-item label="上传Excel：">
          <el-upload
              class="upload-demo"
              :action=this.actionHost
              :headers="mytoken"
              ref="upload"
              :data="{c1:this.form.checkField1,c2:this.form.checkField2,c3:this.form.checkField3,c4:this.form.checkField4,inputType:this.form.inputType,printlog:this.form.printlog}"
              :file-list="fileList"
              :before-upload="checkFile"
              :on-success="updateSucces"
              :on-error="updateError"
              :on-progress="uploadProgress"
              :before-remove="beforeRemove"
              accept=".xls, .xlsx"
              :limit="1"
              :auto-upload="false"
          >
            <el-button size="small" type="primary">选择Excel</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="重复验证字段：" label-width="200">
          <el-switch
              disabled="false"
              v-model="form.checkField1"
              active-text="身份证"
          >
          </el-switch>
          ---------
          <el-switch
              disabled="false"
              v-model="form.checkField2"
              active-text="所属年份"
          >
          </el-switch>
          ---------
          <el-switch
              disabled="false"
              v-model="form.checkField3"
              active-text="所属月份"
          >
          </el-switch>
          <div slot="tip" class="el-upload__tip">可以设置多个验证组合，一个组合若设置多个字段则为组合验证</div>
        </el-form-item>
        <el-form-item label="导入类型：">
          <el-select v-model="form.inputType" disabled placeholder="请选择">
            <el-option
                v-for="item in inputOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="打印导入日志：" label-width="200">
          <el-switch
              v-model="form.printlog"
          >
          </el-switch>
          <el-link type="success" style="margin-left: 30px" v-show="LogShow" @click="downloadLog()">点击·下载导入日志</el-link>
          <el-link type="danger" @click="openImportRes" style="margin-left: 30px" v-show="importFlag">点击·查看导入结果</el-link>
          <span style="color: red;margin-left: 30px" v-show="importFlag2">本次导入日志数据过大，请下载查看</span>
        </el-form-item>


        <el-form-item>
          <el-button type="primary" @click="submitUpload">开始导入</el-button>
        </el-form-item>
        <el-form-item>
          <el-tag
              v-if="importFlag3"
              style="size: A3"
              type="warning">
            {{ msg }}
          </el-tag>
        </el-form-item>

      </el-form>

      <!--      导入结果显示-->
      <el-dialog
          title="导入结果"
          :visible.sync="dialogVisible"
          width="70%"
      >
        <div style="height: 500px;overflow: scroll">
          <el-input
              type="textarea"
              :rows="20"
              v-model="this.importLog">
          </el-input>
          <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
          <el-button type="info" @click="clearLog">清空</el-button>
        </div>
      </el-dialog>

      <span>导入进度</span>
      <hr>
      <el-steps :active="stepsNum">
        <el-step title="步骤 1" description="解析文件"></el-step>
        <el-step title="步骤 2" description="数据校验"></el-step>
        <el-step title="步骤 3" description="添加数据"></el-step>
        <el-step title="步骤 4" description="导入完成"></el-step>
      </el-steps>
      <el-progress :text-inside="true" :stroke-width="26" :percentage="progressNum"
                   v-show="this.progressVisible"></el-progress>
    </el-main>
  </div>
</template>


<script>
import axios from 'axios'
import service from "@/utils/request";
import global from "@/common/Global";
import Cookies from 'js-cookie'
export default {
  name: 'importPersonInfo',
  data() {
    return {
      inputOptions: [{
        value: '1',
        label: '追加'
      }, {
        value: '2',
        label: '更新'
      }],
      importOptions: [{
        value: '1',
        label: '顺序导入'
      }, {
        value: '2',
        label: '极速导入'
      }],
      importOrder: null,
      LogShow: false,
      form: {
        checkField1: true,
        checkField2: true,
        checkField3: true,
        checkField4: null,
        inputType: null,
        printlog: null,
        file: null,
      },
      fileList: [],
      fileSize: 0,
      dialogVisible: false,
      importLog: "",
      //是否进行导入标志
      importFlag: false,
      importFlag2: false,
      importFlag3: false,
      progressVisible: false,
      progressNum: 0,
      proNum: null,
      stepsNum: 0,
      actionHost: global.host + "xczx/importExcel",
      msg: "",
      mytoken: null,
    }
  },
  mounted() {
  },
  created() {
    this.form.inputType = this.inputOptions[0].value;
    var token = Cookies.get("access_token");
    this.mytoken = {Authorization: token}
  },
  watch: {},
  methods: {
    clearLog() {
      this.importLog = ''
      this.dialogVisible = false
      this.importFlag = false
    },
    submitUpload(file) {
      this.importFlag2 = false
      var files = this.$refs.upload.uploadFiles
      if (files.length == 0) {
        this.$message({
          message: '未选择文件',
          type: 'warning'
        })
      } else {
        this.progressNum = 5
        this.progressVisible = true
        const that = this;
        that.proNum = setInterval(function () {
          if (that.progressNum >= 100){
            return
          }
          if (that.fileSize > 4000000) {
            that.progressNum += 0.4;
          } else if (that.fileSize > 700000) {
            that.progressNum += 1;
          } else {
            that.progressNum += 20;
          }
          that.progressNum = Math.round(that.progressNum * 100) / 100;
          if (that.progressNum >= 98) {
            that.stepsNum = 5
          } else if (that.progressNum >= 64) {
            that.stepsNum = 3
          } else if (that.progressNum >= 33) {
            that.stepsNum = 2
          } else if (that.progressNum >= 2) {
            that.stepsNum = 1
          }
        }, 1000);
        this.$refs.upload.submit();
      }
    },
    //上传之前的函数
    checkFile(file) {
      if (file.size === 0) {
        this.$message({
          message: '该文件为空',
          type: 'warning'
        })
        return false
      }
      this.fileSize = file.size
    },
    //上传成功回调
    updateSucces(response, file, fileList) {
      if (response.code == 200) {
        this.$message({
          message: response.msg,
          type: 'success'
        })
      } else {
        this.$message({
          message: response.msg == null ? '未知异常请联系管理员' : response.msg,
          type: 'error'
        })
      }
      clearInterval(this.proNum)
      this.msg = response.msg
      //清空文件列表
      this.$refs.upload.clearFiles()
      //赋值日志内容到前端
      this.importFlag = true
      this.importFlag3 = true
      this.importLog = JSON.parse(JSON.stringify(response.result))
      var logstr = JSON.parse(JSON.stringify(response.result))
      if (logstr.toString().length > 30000) {
        this.LogShow = true
        this.importFlag = false
        this.importFlag2 = true
        this.form.printlog = true
      }
      //显示可下载日志按钮
      if (this.form.printlog) {
        this.LogShow = true
      }
      this.progressNum = 100
      this.stepsNum = 4
      var that = this
      //延时执行
      setTimeout(function () {
        //1秒后执行刷新
        that.progressNum = 0;
        that.stepsNum = 0
        that.progressVisible = false
      }, 4000); //单位是毫秒
    },
    //上传失败回调
    updateError(response, file, fileList) {
      this.$message({
        message: response.msg,
        type: 'error'
      })
      this.progressNum = 0
      //清空文件列表
      this.$refs.upload.clearFiles()
      clearInterval(this.proNum)
      this.stepsNum = 0
      this.progressVisible = false
    },
    //下载导入日志文件
    downloadLog() {
      const a = document.createElement('a')
      a.setAttribute('download', name)
      a.setAttribute('target', '_blank')
      a.setAttribute('href', global.host + "xczx/downloadLog")
      // a.setAttribute('href', global.fileaddr + "/log/lab.log")
      a.click()
    },
    // 下载人员导入模板
    downloadTemplateExcel() {
      const a = document.createElement('a')
      a.setAttribute('download', name)
      a.setAttribute('target', '_blank')
      a.setAttribute('href', global.host + "xczx/downloadExcel")
      // a.setAttribute('href', global.fileaddr + "/人员导入模板.xls")
      a.click()
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    openImportRes() {
      this.dialogVisible = true
    },
    //上传中函数
    uploadProgress(event, file, fileList) {
      this.progressVisible = true

    },
  }
}
</script>
<style>
.app-container {
  margin-bottom: 10px;
  width: 100%;
  height: auto;
  border-radius: 4px;
  padding: 40px 20px;
  box-sizing: border-box;
  margin-right: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
</style>
