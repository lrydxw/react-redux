import Server from '../../../pub/Server';
import Config from '../../../pub/Config';

/**
 * 微信菜单API模块
 */
const ManagerWeChatSetMenuApi = {
	/**
	 * 获取列表
	 */
    getList: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/WeChatSetMenu/GetList", basciInfo, false);
    },

	/**
	 * 新增
	 */
    insert: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/WeChatSetMenu/Insert",
            basciInfo, false
        );
    },
	/**
	 * 修改
	 */
    updateName: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/WeChatSetMenu/UpdateName",
            basciInfo, false
        );
    },
	/**
	 * 修改
	 */
    updateBtnType: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/WeChatSetMenu/UpdateBtnType",
            basciInfo, false
        );
    },
	/**
	 * 修改
	 */
    updatePath: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/WeChatSetMenu/UpdatePath",
            basciInfo, false
        );
    },
	/**
	 * 修改
	 */
    updateOrderIndex: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/WeChatSetMenu/UpdateOrderIndex",
            basciInfo, false
        );
    },
	/**
	 * 删除
	 */
    delete: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/WeChatSetMenu/Delete",
            basciInfo, false
        );
    },
	/**
	 * 发布
	 */
    publish: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/WeChatSetMenu/PublishMenu",
            basciInfo, false
        );
    },

}

export default ManagerWeChatSetMenuApi;