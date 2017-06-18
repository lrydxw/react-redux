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
        return Server.resource('POST', "Manager/WeChatSetInfo/GetWeChatInfo", basciInfo, false);
    },

	/**
	 * 新增
	 */
    InitWeChat: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/WeChatSetInfo/InitWeChat", basciInfo, false);
    },
    /**
    *获取模板列表
    */
    getUITemplateList: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/SystemTemplate/GetUITemplateList",
            basciInfo
        );
    },
    /**
    *获取模板配置
    */
    getTemplatePageSet: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/SystemTemplate/GetTemplatePageSet",
            basciInfo
        );
    },
    /**
    *修改模板配置
    */
    updateTemplatePageSet: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/SystemTemplate/UpdateTemplatePageSet",
            basciInfo
        );
    },
}

export default WeChatSetInfoApi;