import Server from '../../../pub/Server';
import Config from '../../../pub/Config';

/**
 * 微信菜单API模块
 */
const Api = {
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

}

export default Api;