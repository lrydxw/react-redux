import Server from '../../pub/Server';
import Config from '../../pub/Config';

/**
 * 代理API模块
 */
const AgencyManageApi = {

    getAnencyPageList: (basciInfo: {}) => {
        return Server.resource('POST', "User/GetAnencyPageList",
            basciInfo
        );
    },

    getAgencyDetailMemberInfo: (basciInfo: {}) => {
        return Server.resource('POST', "User/GetAgencyDetailMemberInfo",
            basciInfo
        );
    },

    getAgnecyOrderPageList: (basciInfo: {}) => {
        return Server.resource('POST', "Order/GetAgnecyOrderPageList",
            basciInfo
        );
    },

    getAgencyInfo: (basciInfo: {}) => {
        return Server.resource('POST', "User/GetAgencyInfo",
            basciInfo
        );
    },

    getAgnecyPayOrderPageList: (basciInfo: {}) => {
        return Server.resource('POST', "Order/GetAgnecyPayOrderPageList",
            basciInfo
        );
    },

    getMyAgencyList: (basciInfo: {}) => {
        return Server.resource('POST', "User/getMyAgencyList",
            basciInfo
        );
    },
    getMemberProfile: (basciInfo: {}) => {
        return Server.resource('POST', "User/GetMemberProfile",
            basciInfo
        );
    },
    getMemberStatistics: (basciInfo: {}) => {
        return Server.resource('POST', "User/GetMemberStatistics",
            basciInfo
        );
    },
    getMemberAreaDistribute: (basciInfo: {}) => {
        return Server.resource('POST', "User/GetMemberAreaDistribute",
            basciInfo
        );
    },
    getMemberIntegralRankPageList: (basciInfo: {}) => {
        return Server.resource('POST', "User/GetMemberIntegralRankPageList",
            basciInfo
        );
    },

    insertMemberLevel: (basciInfo: {}) => {
        return Server.resource('POST', "User/InsertMemberLevel",
            basciInfo
        );
    },

    updateMemberLevel: (basciInfo: {}) => {
        return Server.resource('POST', "User/UpdateMemberLevel",
            basciInfo
        );
    },

    getMemberLevelPageList: (basciInfo: {}) => {
        return Server.resource('POST', "User/GetMemberLevelPageList",
            basciInfo
        );
    },

    getMemberLevelData: (basciInfo: {}) => {
        return Server.resource('POST', "User/GetMemberLevelData",
            basciInfo
        );
    },

    getMemberLevelSelectData: (basciInfo: {}) => {
        return Server.resource('POST', "User/GetMemberLevelSelectData",
            basciInfo
        );
    },

    updateMemberRecruitment: (basciInfo: {}) => {
        return Server.resource('POST', "User/UpdateMemberRecruitment",
            basciInfo
        );
    },


    getMemberRecruitment: (basciInfo: {}) => {
        return Server.resource('POST', "User/GetMemberRecruitment",
            basciInfo
        );
    },

    getMemberLevelDataList: (basciInfo: {}) => {
        return Server.resource('POST', "User/GetMemberLevelDataList",
            basciInfo
        );
    },

    exportAnencyList: (basciInfo: {}) => {
        return Server.resource('POST', "User/ExportAnencyList",
            basciInfo
        );
    },

    insertAgentLevel: (basciInfo: {}) => {
        return Server.resource('POST', "User/InsertAgentLevel",
            basciInfo
        );
    },

    updateAgentLevel: (basciInfo: {}) => {
        return Server.resource('POST', "User/UpdateAgentLevel",
            basciInfo
        );
    },

    getAgentLevelPageList: (basciInfo: {}) => {
        return Server.resource('POST', "User/GetAgentLevelPageList",
            basciInfo
        );
    },

    getAgentLevelData: (basciInfo: {}) => {
        return Server.resource('POST', "User/GetAgentLevelData",
            basciInfo
        );
    },

    getAgentLevelSelectData: (basciInfo: {}) => {
        return Server.resource('POST', "User/GetAgentLevelSelectData",
            basciInfo
        );
    },

    exportMyAgencyList: (basciInfo: {}) => {
        return Server.resource('POST', "User/ExportMyAgencyList",
            basciInfo
        );
    },
    /**
	 * 获取用户经验值排行
	 */
    getMemberExperienceRankPageList: (basciInfo: {}) => {
        return Server.resource('POST', "User/GetMemberExperienceRankPageList",
            basciInfo
        );
    },
    /**
	 * 获取合作伙伴积分排行
	 */
    getPartnerIntegralRankPageList: (basciInfo: {}) => {
        return Server.resource('POST', "User/GetPartnerIntegralRankPageList",
            basciInfo
        );
    },
    /**
	 * 获取会员级别比例（性别，用户级别，合作伙伴级别）
	 */
    getMemberPercent: (basciInfo: {}) => {
        return Server.resource('POST', "User/GetMemberPercent",
            basciInfo
        );
    },
    /**
	 * 获取用户排行（积分、经验值）
	 */
    getMemberRankList: (basciInfo: {}) => {
        return Server.resource('POST', "User/GetMemberRankList",
            basciInfo
        );
    },
}

export default AgencyManageApi;