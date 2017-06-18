import Server from '../../pub/Server';
import Config from '../../pub/Config';

/**
 * 章节API模块
 */
const CourseChapterApi = {
	/**
	 * 获取章节列表
	 */
    getCourseChapterList: (basciInfo: {}) => {
        return Server.resource('POST', "Course/GetCourseChapterList",
            basciInfo
        );
    },
    /**
	 * 获取章节
	 */
    getCourseChapter: (basciInfo: {}) => {
        return Server.resource('POST', "Course/GetCourseChapter",
            basciInfo
        );
    },
	/**
	 * 新增章节
	 */
    insertCourseChapter: (basciInfo: {}) => {
        return Server.resource('POST', "Course/InsertCourseChapter",
            basciInfo
        );
    },
	/**
	 * 修改章节
	 */
    updateCourseChapter: (basciInfo: {}) => {
        return Server.resource('POST', "Course/UpdateCourseChapter",
            basciInfo
        );
    },
	/**
	 * 删除章节
	 */
    deleteCourseChapter: (basciInfo: {}) => {
        return Server.resource('POST', "Course/DeleteCourseChapter",
            basciInfo
        );
    },
    /**
	 * 获取章节下拉列表
	 */
    getCourseChapterSelectList: (basciInfo: {}) => {
        return Server.resource('POST', "Course/GetCourseChapterSelectList",
            basciInfo
        );
    },
    /**
	 * 获取课程章节级联列表
	 */
    getCourseChapterCascaderList: (basciInfo: {}) => {
        return Server.resource('POST', "Course/GetCourseChapterCascaderList",
            basciInfo
        );
    },
}

export default CourseChapterApi;