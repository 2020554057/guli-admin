.<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps
      :active="1"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>
    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input
          v-model="courseInfo.title"
          placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"
        />
      </el-form-item>

      <!-- 所属分类 -->
      <el-form-item label="课程分类">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类"
          @change="subjectLevelOneChanged"
        >
          <el-option
            v-for="subject in subjectOneLists"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          ></el-option>
        </el-select>

        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in subjectTwoLists"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <!--课程讲师-->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherLists"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description" />
      </el-form-item>

      <!-- 课程封面 -->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API + '/eduoss/fileoss/upload'"
          class="avatar-uploader"
        >
          <img :src="courseInfo.cover" width="400px" height="200px" />
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />
        元
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
          >保存并下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import course from "@/api/edu/course.js";
import subject from "@/api/edu/subject.js";
import Tinymce from "@/components/Tinymce"; //引入富文本编辑器的组件
export default {
  components: { Tinymce },
  data() {
    return {
      saveBtnDisabled: false,
      courseInfo: {
        title: "",
        subjectId: "", //二级分类id
        subjectParentId: "", //一级分类id
        teacherId: "",
        lessonNum: 0,
        description: "",
        cover: "/static/课程默认封面.png",
        price: 0,
      },
      courseId: "", //课程id值
      teacherLists: [],
      subjectOneLists: [], //封装所以一级分类数据
      subjectTwoLists: [], //封装二级分类数据
      BASE_API: process.env.BASE_API, // 接口API地址
    };
  },
  created() {
    //页面渲染之前执行
    // this.init();
    //获取路径id值
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      //调用根据id查询课程的方法
      this.getCourseInfoById();
    } else {
      //初始化所有讲师
      this.getListTeacher();
      //初始化一级分类
      this.getOneSubject();
    }
  },
  //======ToDo====这里有一个Bug
  // watch: {
  //   //监听
  //   $route(to, from) {
  //     //路由变化方式，路由发生变化，方法就会执行
  //     this.init();
  //   },
  // },
  methods: {
    // init() {
    //   //获取路径id值
    //   if (this.$route.params && this.$route.params.id) {
    //     this.courseId = this.$route.params.id;
    //     //调用根据id查询课程的方法
    //     this.getCourseInfoById();
    //   } else {
    //     //初始化所有讲师
    //     this.getListTeacher();
    //     //初始化一级分类
    //     this.getOneSubject();

    //     //路径没有id值，做添加
    //     //清空表单
    //     this.courseInfo = {}
    //     this.courseInfo.description = ""
    //   }
    // },
    //根据课程id获取课程信息
    getCourseInfoById() {
      course.getCourseInfoById(this.courseId).then((response) => {
        //在CourseInfo课程基本信息中，包含一级分类和二级分类的id
        this.courseInfo = response.data.courseInfoVo;
        //1、查询所有分类，包含一级分类和二级分类
        subject.getSubjectList().then((response) => {
          //2、获取所有一级分类
          this.subjectOneLists = response.data.list;
          //3、把所有的一级分类数组进行遍历
          for (let i = 0; i < this.subjectOneLists.length; i++) {
            //获取每一个一级分类
            var oneSubject = this.subjectOneLists[i];
            //比较当前CourseInfo中的一级分类id和所有的一级分类id
            if (this.courseInfo.subjectParentId == oneSubject.id) {
              //获取一级分类所有的二级分类
              this.subjectTwoLists = oneSubject.children;
            }
          }
        });
        //初始化所有讲师
        this.getListTeacher();
      });
    },
    //上传封面成功调用的方法
    handleAvatarSuccess(resp, file) {
      this.courseInfo.cover = resp.data.url;
    },
    //上传之前要调用的方法
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //点击某个一级分类，触发change,显示对应二级分类
    subjectLevelOneChanged(value) {
      //value就是一级分类的id值
      //遍历所有的分类，包含一级和二级
      for (let i = 0; i < this.subjectOneLists.length; i++) {
        //每一个一级分类
        var oneSubject = this.subjectOneLists[i];
        //判断：所有一级分类id和点击一级分类的id是否一样
        if (value === oneSubject.id) {
          //从一级分类中获取所有的二级分类
          this.subjectTwoLists = oneSubject.children;
          //把二级分类id值清空
          this.courseInfo.subjectId = "";
        }
      }
    },
    //查询所有的一级分类
    getOneSubject() {
      subject.getSubjectList().then((response) => {
        this.subjectOneLists = response.data.list;
      });
    },
    //查询所有的讲师
    getListTeacher() {
      course.getListTeacher().then((response) => {
        this.teacherLists = response.data.items;
      });
    },
    //添加课程
    addCourse() {
      course.addCourseInfo(this.courseInfo).then((response) => {
        this.$message({
          message: "添加课程信息成功",
          type: "success",
        });
        //跳转到第二步，并带着这个课程生成的id
        this.$router.push({
          path: "/course/chapter/" + response.data.courseId,
        });
      });
    },
    //修改课程
    updateCourse() {
      course.updateCourseInfo(this.courseInfo).then((response) => {
        this.$message({
          message: "修改课程信息成功",
          type: "success",
        });
        //跳转到第二步，并带着这个课程生成的id
        this.$router.push({
          path: "/course/chapter/" + this.courseId,
        });
      });
    },
    //添加课程信息（并下一步）
    saveOrUpdate() {
      //判断是添加还是修改
      if (!this.courseInfo.id) {
        //添加
        this.addCourse();
      } else {
        //修改
        this.updateCourse();
      }
    },
  },
};
</script>
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>