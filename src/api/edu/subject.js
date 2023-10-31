import request from '@/utils/request'

export default {
    //1、课程分类列表
    getSubjectList(){
        return request({
            url: `/eduservice/edusubject/getAllSubject`, //这里用的是es6的``不是单引号
            method: 'get',
        })
    },
}