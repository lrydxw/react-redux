import Server from '../../pub/Server';
import Config from '../../pub/Config';

/**
 * 合作伙伴API模块
 */
const PartnerApi = {
	/**
	 * 获取合作伙伴列表
	 */
    getPartnerList: (basciInfo: {}) => {
        return Server.resource('POST', "/Partner/GetPartnerList",
            basciInfo
        );
    },
    /**
	 * 获取合作伙伴分页列表
	 */
    getPartnerPageList: (basciInfo: {}) => {
        return Server.resource('POST', "/Partner/GetPartnerPageList",
            basciInfo
        );
    },

	/**
	 * 新增合作伙伴
	 */
    insertPartner: (basciInfo: {}) => {
        return Server.resource('POST', "/Partner/InsertPartner",
            basciInfo
        );
    },
	/**
	 * 修改合作伙伴
	 */
    updatePartner: (basciInfo: {}) => {
        return Server.resource('POST', "/Partner/UpdatePartner",
            basciInfo
        );
    },
	/**
	 * 删除合作伙伴
	 */
    deletePartner: (basciInfo: {}) => {
        return Server.resource('POST', "/Partner/DeletePartner",
            basciInfo
        );
    },


	/**
	 * 获取合作伙伴详情
	 */
    getPartner: (basciInfo: {}) => {
        return Server.resource('POST', "/Partner/GetPartner",
            basciInfo
        );
    },
    /**
	 * 获取合作伙伴权益历史记录
	 */
    getPartnerRightsInterestsHistoryPageList: (basciInfo: {}) => {
        return Server.resource('POST', "/Partner/GetPartnerRightsInterestsHistoryPageList",
            basciInfo
        );
    },

}

export default PartnerApi;