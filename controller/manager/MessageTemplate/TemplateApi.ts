import Server from '../../../pub/Server';
import Config from '../../../pub/Config';

const TemplateApi = {
    /**
    * 获取埋点列表
    */
    getMessageNoticeList: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/MessageTemplate/GetMessageNoticeList",
            basciInfo
        );
    },
    /**
    * 获取埋点模板列表
    */
    getMessageTemplateList: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/MessageTemplate/GetMessageTemplateList",
            basciInfo
        );
    },
    /**
    * 修改埋点模板
    */
    updateMessageTemplateList: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/MessageTemplate/UpdateMessageTemplateList",
            basciInfo
        );
    },
}

export default TemplateApi;