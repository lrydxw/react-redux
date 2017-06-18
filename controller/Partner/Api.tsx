import Server from '../../pub/Server';
import Config from '../../pub/Config';

/**
 * 合作伙伴API模块
 */
const PartnerApi = {
	
    getPartnerTypeSetPageList: (basciInfo: {}) => {
        return Server.resource('POST', "/Partner/GetPartnerTypeSetPageList",
            basciInfo
        );
    },

    insertPartnerTypeSet: (basciInfo: {}) => {
        return Server.resource('POST', "/Partner/InsertPartnerTypeSet",
            basciInfo
        );
    },

    updatePartnerTypeSet: (basciInfo: {}) => {
        return Server.resource('POST', "/Partner/UpdatePartnerTypeSet",
            basciInfo
        );
    },

    getPartnerSet: (basciInfo: {}) => {
        return Server.resource('POST', "/Partner/GetPartnerSet",
            basciInfo
        );
    },

    getPartnerPageListData: (basciInfo: {}) => {
        return Server.resource('POST', "/Partner/GetPartnerPageListData",
            basciInfo
        );
    },

    getPartnerTypeSelectData: (basciInfo: {}) => {
        return Server.resource('POST', "/Partner/GetPartnerTypeSelectData",
            basciInfo
        );
    },

    setPartner: (basciInfo: {}) => {
        return Server.resource('POST', "/Partner/SetPartner",
            basciInfo
        );
    },

    getPartner: (basciInfo: {}) => {
        return Server.resource('POST', "/Partner/GetPartner",
            basciInfo
        );
    },

    updatePartner: (basciInfo: {}) => {
        return Server.resource('POST', "/Partner/UpdatePartner",
            basciInfo
        );
    },

    setPartnerMaxQuotaProportion: (basciInfo: {}) => {
        return Server.resource('POST', "/Partner/SetPartnerMaxQuotaProportion",
            basciInfo
        );
    },

    getPartnerMaxQuotaProportion: (basciInfo: {}) => {
        return Server.resource('POST', "/Partner/GetPartnerMaxQuotaProportion",
            basciInfo
        );
    },

    getPartnerTypeList: (basciInfo: {}) => {
        return Server.resource('POST', "/Partner/GetPartnerTypeList",
            basciInfo
        );
    },

    exportPartnerListData: (basciInfo: {}) => {
        return Server.resource('POST', "/Partner/ExportPartnerListData",
            basciInfo
        );
    },

    deletePartnerType: (basciInfo: {}) => {
        return Server.resource('POST', "/Partner/DeletePartnerType",
            basciInfo
        );
    },

    getPartnerRightsPageList: (basciInfo: {}) => {
        return Server.resource('POST', "/Partner/GetPartnerRightsPageList",
            basciInfo
        );
    },

    getInvitationRecord: (basciInfo: {}) => {
        return Server.resource('POST', "/Partner/GetInvitationRecord",
            basciInfo
        );
    },

    getConditionsRecord: (basciInfo: {}) => {
        return Server.resource('POST', "/Partner/GetConditionsRecord",
            basciInfo
        );
    },
}

export default PartnerApi;