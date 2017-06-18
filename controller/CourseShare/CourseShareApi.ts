import Server from '../../pub/Server';
import Config from '../../pub/Config';

const CourseShareApi = {
    /**
	 * 获取总站共享的课时列表
	 */
    getShareCourseHourPageList: (basciInfo: {}) => {
        return Server.resource('POST', "CourseShare/GetShareCourseHourPageList",
            basciInfo
        );
    },
    /**
	 * 拉取总站共享的课时
	 */
    pullShareCourseHour: (basciInfo: {}) => {
        return Server.resource('POST', "CourseShare/PullShareCourseHour",
            basciInfo
        );
    },
    /**
	 * 获取我购买的课时列表
	 */
    getPullCourseHourPageList: (basciInfo: {}) => {
        return Server.resource('POST', "CourseShare/GetPullCourseHourPageList",
            basciInfo
        );
    },
    /**
	 * 获取标签列表
	 */
    getTagList: (basciInfo: {}) => {
        return Server.resource('POST', "CourseShare/GetTagList",
            basciInfo
        );
    },
    /**
	 * 分站向总站批量共享课时
	 */
    uploadContributionList: (basciInfo: {}) => {
        return Server.resource('POST', "CourseShare/UploadContributionList",
            basciInfo
        );
    },
    /**
	 * 分站查询自己的共享记录
	 */
    getSiteContributionLog: (basciInfo: {}) => {
        return Server.resource('POST', "CourseShare/GetSiteContributionLog",
            basciInfo
        );
    },
    /**
	 * 分站取消课时共享
	 */
    cancelCourseHourShare: (basciInfo: {}) => {
        return Server.resource('POST', "CourseShare/CancelCourseHourShare",
            basciInfo
        );
    },
}

export default CourseShareApi;