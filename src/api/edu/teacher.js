import request from '@/utils/request'

export default {

    //讲师列表(条件查询分页)
    //current 当前页 limit每页记录数  teacherQuery条件对象
    getTeacherListPage(current, limit, teacherQuery) {
        return request({
            url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`, //这里用的是es6的``不是单引号
            method: 'post',
            //teacherQuery条件对象，后端使用RequestBody获取数据
            //data表示把对象转换json进行传递到接口
            data: teacherQuery
        })
    },

    //删除讲师
    deleteTeacherById(id) {
        return request({
            url: `/eduservice/teacher/${id}`,
            method: 'delete'
        })
    },

    //添加讲师
    addTeacher(teacher) {
        return request({
            url: '/eduservice/teacher/addTeacher',
            method: 'post',
            data: teacher
        })
    },

    //根据id查询讲师信息
    getTeacherInfoById(id){
        return request({
            url: `/eduservice/teacher/getTeacher/${id}`,
            method: 'get',
        })
    },

    //根据id修改讲师信息
    updateTeacherById(teacher){
        return request({
            url: `/eduservice/teacher/updateTeacher`,
            method: 'post',
            data: teacher
        })
    }


}