import Server from '../../../pub/Server';
import Config from '../../../pub/Config';


const MemberSetInfoApi = {
    getMemberRightsPageList: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/MemberSetInfo/GetMemberRightsPageList", 
            basciInfo
        );
    },

    insertMemberRights: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/MemberSetInfo/InsertMemberRights",
            basciInfo
        );
    },

    updateMemberRights: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/MemberSetInfo/UpdateMemberRights",
            basciInfo
        );
    },

    getMemberRightsInfo: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/MemberSetInfo/GetMemberRightsInfo",
            basciInfo
        );
    },

    deleteMemberRights: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/MemberSetInfo/DeleteMemberRights",
            basciInfo
        );
    },

    getMemberRightsSelectData: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/MemberSetInfo/GetMemberRightsSelectData",
            basciInfo
        );
    },
    updateMemberRebateConfig: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/MemberSetInfo/UpdateMemberRebateConfig",
            basciInfo
        );
    },

    getMemberRebateConfig: (basciInfo: {}) => {
        return Server.resourceAsyn('POST', "Manager/MemberSetInfo/GetMemberRebateConfig",
            basciInfo
        );
    },

}

export default MemberSetInfoApi;

