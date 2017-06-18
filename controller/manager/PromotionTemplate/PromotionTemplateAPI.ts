import Server from '../../../pub/Server';
import Config from '../../../pub/Config';


/**
 * 推广二维码模板API模块
 */
const PromotionTemplateAPI = {

    //获取所有推广模板列表
    GetPromotionTemplateList: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/PromotionTemplate/GetPromotionTemplateList",
            basciInfo
        );
    },
    /**
     * 获取推广二维码类型列表
    /api/Template/GetPromotionTypeList
     */
    GetPromotionTypeList: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/PromotionTemplate/GetPromotionTypeList",
            basciInfo
        );
    },

    /*
    获取指定类型的推广模板列表
    */
    GetPromotionTemplateListByTypeId: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/PromotionTemplate/GetPromotionTemplateListByTypeId",
            basciInfo);
    },

    /*
    根据模板ID 来更新推广模板的启用状态
    */
    UpdateIsEnable: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/PromotionTemplate/UpdateIsEnable",
            basciInfo);
    },

    /**
    获取指定模板的信息
    */
    GetPromotionTemplateInfoById: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/PromotionTemplate/GetPromotionTemplateById", basciInfo);
    },

    //保存修改过的模板信息
    UpdatePromotionTemplateById: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/PromotionTemplate/UpdatePromotionTemplateById", basciInfo);
    },

    //获取所有模板配置项枚举数据
    GetAllTemplateConfigEnum: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/PromotionTemplate/GetAllTemplateConfigEnum", basciInfo);
    },

    // 生成预览图(返回Base64格式)
    GetTemplatePreview: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/PromotionTemplate/GetTemplatePreview", basciInfo);
    },
    //添加模板
    AddPromotionTemplate: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/PromotionTemplate/AddPromotionTemplate", basciInfo);
    },

}

export default PromotionTemplateAPI;