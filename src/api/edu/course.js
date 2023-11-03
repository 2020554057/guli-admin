import request from '@/utils/request'

export default {
    //1、添加课程信息
    addCourseInfo(courseInfoVo){
        return request({
            url: `/eduservice/course/addCourseInfo`, //这里用的是es6的``不是单引号
            method: 'post',
            data: courseInfoVo
        })
    },
    //2、查询所有讲师
    getListTeacher(){
        return request({
            url: `/eduservice/teacher/findAll`, //这里用的是es6的``不是单引号
            method: 'get',
        })
    },
    //3、根据课程id查询课程信息
    getCourseInfoById(courseId){
        return request({
            url: `/eduservice/course/getCourseInfoById/${courseId}`, //这里用的是es6的``不是单引号
            method: 'get',
        })
    },
    //4、修改课程信息
    updateCourseInfo(courseInfoVo){
        return request({
            url: `/eduservice/course/updateCourseInfo`, //这里用的是es6的``不是单引号
            method: 'post',
            data: courseInfoVo
        })
    }
}