import Server from '../../../pub/Server';
import Config from '../../../pub/Config';


const ShopHomeSetApi = {
	/**
	 * 获取基本信息
	 */
    GetMyCenterFunction: (basciInfo: {}) => {
        return Server.resource('POST', "UITemplate/GetMyCenterFunction",
            basciInfo
        );
    },
    /**
    *获取模板配置
    */
    GetTemplatePageSet: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/SystemTemplate/GetTemplatePageSet",
            basciInfo
        );
    },
    //切换是否启用商城首页Banner图
    switchIsEnableShopBanner: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/SystemUISet/SwitchIsEnableShopBanner",
            basciInfo
        );
    },

    //切换是否启用商城导航栏
    switchIsEnableShopNavigationModule: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/SystemUISet/SwitchIsEnableShopNavigationModule",
            basciInfo
        );
    },

    //获取商城首页配置项
    getShopHomeSetConfig: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/SystemUISet/GetShopHomeSetConfig",
            basciInfo
        );
    },

    //获取商城首页Banner图列表
    getShopBannerList: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/SystemUISet/GetShopBannerList",
            basciInfo
        );
    },

    //获取商城首页导航模块
    getShopNavigationModuleInfoList: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/SystemUISet/GetShopNavigationModuleInfoList",
            basciInfo
        );
    },

    //更新商城首页Banner图配置
    updateShopBanner: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/SystemUISet/UpdateShopBanner",
            basciInfo
        );
    },

    //更新商城导航模块
    updateShopNavigationModuleInfo: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/SystemUISet/UpdateShopNavigationModuleInfo",
            basciInfo
        );
    },

    //获取推荐商品数据
    getProductRecommendedInfoList: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/SystemUISet/GetProductRecommendedInfoList",
            basciInfo
        );
    },

    //更新推荐商品
    updateProductRecommendedInfoList: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/SystemUISet/UpdateProductRecommendedInfoList",
            basciInfo
        );
    },


    //获取商城首页配置项
    getShopHomeConfigInfo: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/SystemUISet/GetShopHomeConfigInfo",
            basciInfo
        );
    },
}

export default ShopHomeSetApi;

