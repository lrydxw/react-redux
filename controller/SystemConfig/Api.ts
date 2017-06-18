import Server from '../../pub/Server';
import Config from '../../pub/Config';

/**
 * 整站API模块
 */
const SystemConfigApi = {
	/**
	 * 初始化 - 设置基本信息
	 */
    setAppBasciInfo: (basciInfo: {}) => {
        return Server.resource('POST', "InitSystemConfig/SetAppBasciInfo",
            basciInfo
        );
    },
	/**
	 * 初始化 - 获取设置基本信息
	 */
    getAppBasciInfo: () => {
        return Server.resourceAsyn('POST', "InitSystemConfig/GetBasicInfo", {}
        );
    },
	/**
	 * 初始化 - 设置微信信息
	 */
    setWeChatInfo: (weChatInfo: {}) => {
        return Server.resourceAsyn('POST', "InitSystemConfig/SetWeChatInfo", weChatInfo
        );
    },
	/**
	 * 初始化 - 获取微信设置信息
	 */
    getWeChatInfo: () => {
        return Server.resourceAsyn('POST', "InitSystemConfig/GetWeChatInfo", {}
        );
    },
	/**
	 * 初始化 - 设置分销信息
	 */
    setDistributionInfo: (weChatInfo: {}) => {
        return Server.resourceAsyn('POST', "InitSystemConfig/SetDistributionInfo", weChatInfo
        );
    },
	/**
	 * 初始化 - 获取分销设置信息
	 */
    getDistributionInfo: () => {
        return Server.resourceAsyn('POST', "InitSystemConfig/GetDistributionInfo", {}
        );
    },
    /**
	 * 获取系统概况
	 */
    getSystemProfile: () => {
        return Server.resourceAsyn('POST', "InitSystemConfig/GetSystemProfile", {}
        );
    },
}

export default SystemConfigApi;