import request from '@/utils/request'

export default {
    //1、添加小节
    addVideo(eduVideo) {
        return request({
            url: '/eduservice/video/addVideo',
            method: 'post',
            data: eduVideo
        })
    },

    //2、删除小节
    deleteVideo(id) {
        return request({
            url: '/eduservice/video/deleteVideo/' + id,
            method: 'delete'
        })
    },
    //=========================================================
    //3、根据章节id查询章节信息
    getChapterInfoById(chapterId) {
        return request({
            url: '/eduservice/chapter/getChapter/' + chapterId,
            method: 'get'
        })
    },
    //4、修改小节信息
    updateChapter(eduChapter) {
        return request({
            url: '/eduservice/chapter/updateChapter',
            method: 'post',
            data: eduChapter
        })
    },
    //======================阿里云视频操作接口=====================
    //删除视频
    deleteAliyunvod(id) {
        return request({
            url: '/eduvod/video/removeAlyVideo/' + id,
            method: 'delete'
        })
    }

}