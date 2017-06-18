import Server from '../../pub/Server';
import Config from '../../pub/Config';

/**
 * 课时API模块
 */
const CourseHourApi = {
	/**
	 * 获取课时列表
	 */
    getCourseHourList: (basciInfo: {}) => {
        return Server.resource('POST', "Course/GetCourseHourList",
            basciInfo
        );
    },
    /**
	 * 获取课时列表(分页)
	 */
    getCourseHourPageList: (basciInfo: {}) => {
        return Server.resource('POST', "Course/GetCourseHourPageList",
            basciInfo
        );
    },
    /**
	 * 获取课时
	 */
    getCourseHour: (basciInfo: {}) => {
        return Server.resource('POST', "Course/GetCourseHour",
            basciInfo
        );
    },
	/**
	 * 添加/修改课时(第一步)
	 */
    insertCourseHourFirst: (basciInfo: {}) => {
        return Server.resource('POST', "Course/InsertCourseHourFirst",
            basciInfo
        );
    },
    /**
	 * 添加/修改课时(第二步)
	 */
    insertCourseHourSecond: (basciInfo: {}) => {
        return Server.resource('POST', "Course/InsertCourseHourSecond",
            basciInfo
        );
    },
    /**
	 * 添加/修改课时(第三步)
	 */
    insertCourseHourThird: (basciInfo: {}) => {
        return Server.resource('POST', "Course/InsertCourseHourThird",
            basciInfo
        );
    },
	/**
	 * 删除课时
	 */
    deleteCourseHour: (basciInfo: {}) => {
        return Server.resource('POST', "Course/DeleteCourseHour",
            basciInfo
        );
    },
    /**
	 * 获取章节课时列表
	 */
    getCourseHourChapterList: (basciInfo: {}) => {
        return Server.resource('POST', "Course/GetCourseHourChapterList",
            basciInfo
        );
    },
    /**
	 * 获取课时播客类型
	 */
    getCourseHourType: (basciInfo: {}) => {
        return Server.resource('POST', "Course/GetCourseHourType",
            basciInfo
        );
    },
    /**
	 * 修改课时排序
	 */
    updateCourseHourOrder: (basciInfo: {}) => {
        return Server.resource('POST', "Course/UpdateCourseHourOrder",
            basciInfo
        );
    },
    /**
	 * 修改课时发布状态
	 */
    updateCourseHourPublish: (basciInfo: {}) => {
        return Server.resource('POST', "Course/UpdateCourseHourPublish",
            basciInfo
        );
    },
    /**
	 * 批量删除课时
	 */
    batchDeleteCourseHour: (basciInfo: {}) => {
        return Server.resource('POST', "Course/BatchDeleteCourseHour",
            basciInfo
        );
    },
    /**
	 * 批量复制课时
	 */
    batchCopyCourseHour: (basciInfo: {}) => {
        return Server.resource('POST', "Course/BatchCopyCourseHour",
            basciInfo
        );
    },
    /**
	 * 批量移动课时
	 */
    batchRemoveCourseHour: (basciInfo: {}) => {
        return Server.resource('POST', "Course/BatchRemoveCourseHour",
            basciInfo
        );
    },
    /**
	 * 批量修改课时发布状态
	 */
    batchUpdateCourseHourPublish: (basciInfo: {}) => {
        return Server.resource('POST', "Course/BatchUpdateCourseHourPublish",
            basciInfo
        );
    },
    /**
	 * 修改课时预告
	 */
    updateCourseHourNotice: (basciInfo: {}) => {
        return Server.resource('POST', "Course/UpdateCourseHourNotice",
            basciInfo
        );
    },
    /**
	 * 添加或修改课时
	 */
    courseHourUpdateOrInsert: (basciInfo: {}) => {
        return Server.resource('POST', "Course/CourseHourUpdateOrInsert",
            basciInfo
        );
    },
}

export default CourseHourApi;