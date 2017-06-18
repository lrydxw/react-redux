import Server from '../../pub/Server';
import Config from '../../pub/Config';

const CrmApi = {
  
    getCrmLeaveMsgList: (basciInfo: {}) => {
        return Server.resource('POST', "Extend/GetCrmLeaveMsgList",
            basciInfo
        );
    },

    getCrmLeaveMsgDetail: (basciInfo: {}) => {
        return Server.resource('POST', "Extend/GetCrmLeaveMsgDetail",
            basciInfo
        );
    },
}

export default CrmApi;