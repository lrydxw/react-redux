import Server from '../../pub/Server';
import Config from '../../pub/Config';

/**
 * 讲师API模块
 */
const LecturerApi = {
	/**
	 * 获取讲师列表
	 */
    getLecturerList: (basciInfo: {}) => {
        return Server.resource('POST', "Course/GetLecturerPageList",
            basciInfo
        );
    },
    /**
	 * 获取讲师
	 */
    getLecturer: (basciInfo: {}) => {
        return Server.resource('POST', "Course/GetLecturer",
            basciInfo
        );
    },
	/**
	 * 新增讲师
	 */
    insertLecturer: (basciInfo: {}) => {
        return Server.resource('POST', "Course/InsertLecturer",
            basciInfo
        );
    },
	/**
	 * 修改讲师
	 */
    updateLecturer: (basciInfo: {}) => {
        return Server.resource('POST', "Course/UpdateLecturer",
            basciInfo
        );
    },
	/**
	 * 删除讲师
	 */
    deleteLecturer: (basciInfo: {}) => {
        return Server.resource('POST', "Course/DeleteLecturer",
            basciInfo
        );
    },
    /**
	 * 讲师下拉列表数据
	 */
    getSelectLecturerList: (basciInfo: {}) => {
        return Server.resource('POST', "Course/GetSelectLecturerList",
            basciInfo
        );
    },
}

export default LecturerApi;