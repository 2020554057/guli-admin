<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>

    <el-steps
      :active="3"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="发布课程" />
    </el-steps>

    <div class="ccInfo">
      <img :src="coursePublish.cover" />
      <div class="main">
        <h2>{{ coursePublish.title }}</h2>
        <p class="gray">
          <span>共{{ coursePublish.lessonNum }}课时</span>
        </p>
        <p>
          <span
            >所属分类：{{ coursePublish.subjectLevelOne }} —
            {{ coursePublish.subjectLevelTwo }}</span
          >
        </p>
        <p>课程讲师：{{ coursePublish.teacherName }}</p>
        <h3 class="red">￥{{ coursePublish.price }}</h3>
      </div>
    </div>

    <div>
      <el-button @click="previous">返回修改</el-button>
      <el-button type="warning" @click="returnCourseList">返回课程列表</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="publish"
        >发布课程</el-button
      >
    </div>
  </div>
</template>

<script>
import course from "@/api/edu/course";
export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseId: "",
      coursePublish: {},
    };
  },

  created() {
    //获取路由课程id值
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      //调用接口方法根据课程id查询
      this.getCoursePublishId();
    }
  },

  methods: {
    //根据课程id查询
    getCoursePublishId() {
      course.getPublihCourseInfo(this.courseId).then((response) => {
        this.coursePublish = response.data.publishCourse;
      });
    },
    previous() {
      console.log("previous");
      this.$router.push({ path: "/course/chapter/" + this.courseId });
    },
    returnCourseList(){
      console.log("returnCourseList");
      this.$router.push({ path: "/course/list"});
    },
    publish() {
      //提示
      this.$confirm("此操作发布该课程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //调用课程发布接口
          course.publihCourse(this.courseId).then((response) => {
            //跳转课程列表页面
            this.$router.push({ path: "/course/list" });
          });
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "发布课程成功!",
          });
        })
        .catch((response) => {
          // 失败
          if (response === "cancel") {
            this.$message({
              type: "info",
              message: "已取消发布",
            });
          } else {
            this.$message({
              type: "error",
              message: "发布课程失败！",
            });
          }
        });
    },
  },
};
</script>

<style scoped>
.ccInfo {
  background: #f5f5f5;
  padding: 20px;
  overflow: hidden;
  border: 1px dashed #ddd;
  margin-bottom: 40px;
  position: relative;
}
.ccInfo img {
  background: #d6d6d6;
  width: 500px;
  height: 278px;
  display: block;
  float: left;
  border: none;
}
.ccInfo .main {
  margin-left: 520px;
}

.ccInfo .main h2 {
  font-size: 28px;
  margin-bottom: 30px;
  line-height: 1;
  font-weight: normal;
}
.ccInfo .main p {
  margin-bottom: 10px;
  word-wrap: break-word;
  line-height: 24px;
  max-height: 48px;
  overflow: hidden;
}

.ccInfo .main p {
  margin-bottom: 10px;
  word-wrap: break-word;
  line-height: 24px;
  max-height: 48px;
  overflow: hidden;
}
.ccInfo .main h3 {
  left: 540px;
  bottom: 20px;
  line-height: 1;
  font-size: 28px;
  color: #d32f24;
  font-weight: normal;
  position: absolute;
}
</style>