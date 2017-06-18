import Server from '../../pub/Server';
import Config from '../../pub/Config';

/**
 * 社群管理API模块
 */
const CommunityApi = {
	
    getCommunityPageList: (basciInfo: {}) => {
        return Server.resource('POST', "User/GetCommunityInfoPageList",
            basciInfo
        );
    },

    createCommunity: (basciInfo: {}) => {
        return Server.resource('POST', "User/InsertCommunity",
            basciInfo
        );
    },
    updateCommunity: (basciInfo: {}) => {
        return Server.resource('POST', "User/UpdateCommunity",
            basciInfo
        );
    },

    getCommunity: (basciInfo: {}) => {
        return Server.resource('POST', "User/GetCommunity",
            basciInfo
        );
    },

    getCommunitySelectData: (basciInfo: {}) => {
        return Server.resource('POST', "User/GetCommunitySelectData",
            basciInfo
        );
    },

    getClassSelectData: (basciInfo: {}) => {
        return Server.resource('POST', "User/GetClassSelectData",
            basciInfo
        );
    },

    getStudentBasicPageList: (basciInfo: {}) => {
        return Server.resource('POST', "User/GetStudentBasicPageList",
            basciInfo
        );
    },

    switchStudentEnterGroupState: (basciInfo: {}) => {
        return Server.resource('POST', "User/SwitchStudentEnterGroupState",
            basciInfo
        );
    },

    exportStudentBasicList: (basciInfo: {}) => {
        return Server.resource('POST', "User/ExportStudentBasicList",
            basciInfo
        );
    },

    deleteCommunity: (basciInfo: {}) => {
        return Server.resource('POST', "User/DeleteCommunity",
            basciInfo
        );
    },
}

export default CommunityApi;