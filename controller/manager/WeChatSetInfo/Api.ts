import Server from '../../../pub/Server';
import Config from '../../../pub/Config';

/**
 * 微信菜单API模块
 */
const WeChatSetInfoApi = {
	/**
	 * 获取列表
	 */
    GetWeChatInfo: (basciInfo: {}) => {
        return Server.resourceAsyn('POST', "Manager/WeChatSetInfo/GetWeChatInfo", basciInfo);
    },

	/**
	 * 新增
	 */
    InitWeChat: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/WeChatSetInfo/InitWeChat", basciInfo, false);
    },

    /**
	 * 获取微信消息列表
	 */
    GetWeChatMessageContentInfoList: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/WeChatSetInfo/GetWeChatMessageContentInfoList", basciInfo);
    },

    /**
	 * 设置微信信息内容
	 */
    SetWeChatMessageContent: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/WeChatSetInfo/SetWeChatMessageContent", basciInfo);
    },

    /**
	 * 获取关键字回复分页信息
	 */
    getWeChatKeywordContentListInfo: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/WeChatSetInfo/GetWeChatKeywordContentListInfo", basciInfo);
    },

    /**
    * 获取关键字回复信息
    */
    getWeChatKeywordContentInfo: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/WeChatSetInfo/GetWeChatKeywordContentInfo", basciInfo);
    },

    /**
     * 设置关键字回复信息
     */
    setWeChatKeywordContentInfo: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/WeChatSetInfo/SetWeChatKeywordContentInfo", basciInfo);
    },

    /**
    * 删除微信信息配置
    */
    deleteWeChatMessageContent: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/WeChatSetInfo/DeleteWeChatMessageContent", basciInfo);
    },

    /**
    * 移动微信回复信息位置
    */
    moveWeChatMessageContent: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/WeChatSetInfo/MoveWeChatMessageContent", basciInfo);
    },

    /**
    * 删除关键字回复信息
    */
    deleteWeChatKeywordContentInfo: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/WeChatSetInfo/DeleteWeChatKeywordContentInfo", basciInfo);
    }

}

export default WeChatSetInfoApi;