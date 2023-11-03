<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>

    <el-steps
      :active="2"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>

    <el-button type="text" @click="openChapterDialog()">添加章节</el-button>

    <!-- 章节 -->
    <ul class="chanpterList">
      <li v-for="chapter in chapterVideoList" :key="chapter.id">
        <p>
          {{ chapter.title }}

          <span class="acts">
            <el-button style="" type="text" @click="openVideo(chapter.id)"
              >添加小节</el-button
            >
            <el-button style="" type="text" @click="openEditChatper(chapter.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="removeChapter(chapter.id)"
              >删除</el-button
            >
          </span>
        </p>

        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}

              <span class="acts">
                <el-button style="" type="text">编辑</el-button>
                <el-button type="text" @click="removeVideo(video.id)"
                  >删除</el-button
                >
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next"
        >下一步</el-button
      >
    </div>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number
            v-model="chapter.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title" />
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number
            v-model="video.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <!-- TODO -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button
          :disabled="saveVideoBtnDisabled"
          type="primary"
          @click="saveOrUpdateVideo"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>


<script>
import chapter from "@/api/edu/chapter";
import video from "@/api/edu/video";
export default {
  data() {
    return {
      saveBtnDisabled: false,
      courseId: "", //课程id
      chapterVideoList: [],
      chapter: {
        //封装章节数据
        title: "",
        sort: 0,
      },
      video: {
        title: "",
        sort: 0,
        free: 0,
        videoSourceId: "",
      },
      dialogChapterFormVisible: false, //章节弹框
      dialogVideoFormVisible: false, //小节弹框
    };
  },

  created() {
    //获取路由的id值
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      //根据课程id查询章节和小节
      this.getChapterVideo();
    }
  },

  methods: {
    //===========================小节操作================================
    //删除小节
    removeVideo(id){
      this.$confirm("此操作将永久删除当前小节, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //调用删除章节接口
          return video.deleteVideo(id);
        })
        .then(() => {
          //刷新页面
          this.getChapterVideo();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch((response) => {
          // 失败
          if (response === "cancel") {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          } else {
            this.$message({
              type: "error",
              message: "删除失败",
            });
          }
        });
    },
    //弹出添加小节的弹框
    openVideo(chapterId) {
      this.dialogVideoFormVisible = true
      //先设置video中的chapterId和courseId，因为数据表中它是非空的
      this.video.chapterId = chapterId
      this.video.courseId = this.courseId

      this.video.title = ""
      this.video.sort = 0
      this.video.free = 0
      this.video.videoSourceId = ""
    },
    //添加小节
    addVideo() {
      video.addVideo(this.video).then((response) => {
        //关闭弹窗
        this.dialogVideoFormVisible = false;
        //提示信息
        this.$message({
          type: "success",
          message: "添加小节成功！",
        });
        //刷新页面
        this.getChapterVideo();
      });
    },

    //添加或修改小节
    saveOrUpdateVideo() {
      //判断是添加还是修改
      if (!this.video.videoSourceId) {
        //添加
        this.addVideo();
      } else {
        //修改 TODO
      }
    },

    //===========================章节操作================================
    //删除章节
    removeChapter(chapterId) {
      this.$confirm("此操作将永久删除当前章节, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //调用删除章节接口
          return chapter.deleteChapter(chapterId);
        })
        .then(() => {
          //刷新页面
          this.getChapterVideo();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch((response) => {
          // 失败
          if (response === "cancel") {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          } else {
            this.$message({
              type: "error",
              message: "删除失败",
            });
          }
        });
    },
    //添加或修改章节
    saveOrUpdate() {
      if (!this.chapter.courseId) {
        //添加章节
        this.addChapter();
      } else {
        //修改章节
        this.updateChapter();
      }
    },
    //修改章节
    updateChapter() {
      chapter.updateChapter(this.chapter).then((response) => {
        //关闭弹窗
        this.dialogChapterFormVisible = false;
        //提示信息
        this.$message({
          type: "success",
          message: "修改章节成功",
        });
        //刷新页面
        this.getChapterVideo();
      });
    },
    //添加章节
    addChapter() {
      //先设置chapter中的course_id，因为数据表中它是非空的
      this.chapter.courseId = this.courseId;
      //调用接口
      chapter.addChapter(this.chapter).then((response) => {
        //关闭弹窗
        this.dialogChapterFormVisible = false;
        //提示信息
        this.$message({
          type: "success",
          message: "添加章节成功！",
        });
        //刷新页面
        this.getChapterVideo();
      });
    },
    //弹出修改章节的弹框
    openEditChatper(chapterId) {
      //弹出弹框
      this.dialogChapterFormVisible = true;
      chapter.getChapterInfoById(chapterId).then((response) => {
        //数据回显
        this.chapter = response.data.chapter;
      });
    },
    //弹出添加章节的弹框
    openChapterDialog() {
      this.dialogChapterFormVisible = true;
      //清空表单的数据
      this.chapter.title = "";
      this.chapter.sort = 0;
    },
    //根据课程id查询章节和小节
    getChapterVideo() {
      chapter.getAllChapterVideo(this.courseId).then((response) => {
        this.chapterVideoList = response.data.allChapterVideo;
      });
    },
    previous() {
      console.log("previous");
      this.$router.push({ path: "/course/info/" + this.courseId });
    },

    next() {
      console.log("next");

      this.$router.push({ path: "/course/publish/" + this.courseId });
    },
  },
};
</script>
<style scoped>
.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chanpterList li {
  position: relative;
}
.chanpterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.chanpterList .acts {
  float: right;
  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}
.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>