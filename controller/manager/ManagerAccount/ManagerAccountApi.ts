import Server from '../../../pub/Server';
import Config from '../../../pub/Config';

/**
 * 管理人员API模块
 */
const ManagerAccountApi = {
	/**
	 * 获取管理人员列表
	 */
    getManagerAccountList: (basciInfo: {}) => {
        return Server.resource('POST', "ManagerAccount/GetManagerAccountPageList",
            basciInfo
        );
    },
    /**
	 * 获取管理人员
	 */
    getManagerAccount: (basciInfo: {}) => {
        return Server.resource('POST', "ManagerAccount/GetManagerAccount",
            basciInfo
        );
    },
	/**
	 * 新增管理人员
	 */
    insertManagerAccount: (basciInfo: {}) => {
        return Server.resource('POST', "ManagerAccount/InsertManagerAccount",
            basciInfo
        );
    },
	/**
	 * 修改管理人员
	 */
    updateManagerAccount: (basciInfo: {}) => {
        return Server.resource('POST', "ManagerAccount/UpdateManagerAccount",
            basciInfo
        );
    },
	/**
	 * 删除管理人员
	 */
    deleteManagerAccount: (basciInfo: {}) => {
        return Server.resource('POST', "ManagerAccount/DeleteManagerAccount",
            basciInfo
        );
    },
    /**
    * 创建一个新的班长
    */
    createClassMonitor: (basciInfo: {}) => {
        return Server.resource('POST', "ManagerAccount/InsertClassMonitor",
            basciInfo
        );
    },
     /**
    * 批量删除管理人员
    */
    batchDeleteManagerAccount: (basciInfo: {}) => {
        return Server.resource('POST', "ManagerAccount/BatchDeleteManagerAccount",
            basciInfo
        );
    },

    /**
    * 重置管理员密码
    */
    resetPassword: (basciInfo: {}) => {
        return Server.resource('POST', "ManagerAccount/ResetPassword",
            basciInfo
        );
    },
}

export default ManagerAccountApi;