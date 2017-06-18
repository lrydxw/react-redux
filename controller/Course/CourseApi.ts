import Server from '../../pub/Server';
import Config from '../../pub/Config';

const CourseApi = {
    /**
	 * 获取课程列表
	 */
    getCourseList: (basciInfo: {}) => {
        return Server.resource('POST', "Course/GetCoursePageList",
            basciInfo
        );
    },

   /**
   * 删除课程列表
   */
    deleteCourse: (basciInfo: {}) => {
        return Server.resource('POST', "Course/DeleteCourse",
            basciInfo
        );
    },


    /**
    * 添加课程基本信息
    */
    addBasicCourse: (basciInfo: {}) => {
        return Server.resource('POST', "Course/AddBasicCourse",
            basciInfo
        );
    },

    /**
    * 更新课程基本信息
    */
    updateBasicCourse: (basciInfo: {}) => {
        return Server.resource('POST', "Course/UpdateBasicCourse",
            basciInfo
        );
    },
    /**
    * 获取评论列表
    */
    getCourseCommentList: (basciInfo: {}) => {
        return Server.resource('POST', "Course/GetCourseCommentPageList",
            basciInfo
        );
    },
    /**
    * 获取课程详细信息
    */
    getCourseInfo: (basciInfo: {}) => {
        return Server.resource('POST', "Course/GetCourseInfo",
            basciInfo
        );
    },

    /**
    * 更新详细信息
    */
    UpdateCourseInfoSet: (basciInfo: {}) => {
        return Server.resource('POST', "Course/UpdateCourseInfoSet",
            basciInfo
        );
    },

    /**
    * 切换课程发布状态
    */
    SwitchCoursePublishState: (basciInfo: {}) => {
        return Server.resource('POST', "Course/SwitchCoursePublishState",
            basciInfo
        );
    },


    /**
    * 切换课程推荐到首页状态
    */
    SwitchCourseRecommendedHomeState: (basciInfo: {}) => {
        return Server.resource('POST', "Course/SwitchCourseRecommendedHomeState",
            basciInfo
        );
    },

   /**
  * 获取班长列表
  */
    getClassMonitorList: (basciInfo: {}) => {
        return Server.resource('POST', "Course/GetClassMonitorList",
            basciInfo
        );
    },

    /**
    * 获取课程基本信息
    */
    getBasicCourse: (basciInfo: {}) => {
        return Server.resource('POST', "Course/GetBasicCourse",
            basciInfo
        );
    },

   /**
  * 获取课程选择信息数据列表
  */
    getCourseInfoList: (basciInfo: {}) => {
        return Server.resource('POST', "Course/GetCourseInfoList",
            basciInfo
        );
    },


    getCourseRebateInfo: (basciInfo: {}) => {
        return Server.resource('POST', "Course/GetCourseRebateInfo",
            basciInfo
        );
    },

    updateCourseRebateInfo: (basciInfo: {}) => {
        return Server.resource('POST', "Course/UpdateCourseRebateInfo",
            basciInfo
        );
    },

     /**
  * 获取课程选择信息数据列表
  */
    updateOrInsertCourse: (basciInfo: {}) => {
        return Server.resource('POST', "Course/UpdateOrInsertCourse",
            basciInfo
        );
    },
  
}

export default CourseApi;