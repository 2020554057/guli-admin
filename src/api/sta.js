import request from '@/utils/request' //引入已经封装好的axios 和 拦截器

export default {
    //生成统计数据
    createStaByDay(day) {
        return request({
            url: `/edusta/sta/registerCount/${day}`,
            method: 'get'
        })
    },

    //获取统计数据
    getDataSta(searchObj) {
        return request({
            url: `/edusta/sta/showData/${searchObj.type}/${searchObj.begin}/${searchObj.end}`,
            method: 'get'
        })
    }

}