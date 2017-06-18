import Server from '../../pub/Server';
import Config from '../../pub/Config';

/**
 * 合作伙伴等级API模块
 */
const PartnerLevelApi = {
	/**
	 * 获取合作伙伴等级列表
	 */
    getPartnerLeveList: (basciInfo: {}) => {
        return Server.resource('POST', "/Partner/GetPartnerLevelList",
            basciInfo
        );
    },
    /**
	 * 获取合作伙伴等级分页列表
	 */
    getPartnerLevePageList: (basciInfo: {}) => {
        return Server.resource('POST', "/Partner/GetPartnerLevelPageList",
            basciInfo
        );
    },

	/**
	 * 新增合作伙伴等级
	 */
    insertPartnerLevel: (basciInfo: {}) => {
        return Server.resource('POST', "/Partner/InsertPartnerLevel",
            basciInfo
        );
    },
	/**
	 * 修改合作伙伴等级
	 */
    updatePartnerLevel: (basciInfo: {}) => {
        return Server.resource('POST', "/Partner/UpdatePartnerLevel",
            basciInfo
        );
    },
	/**
	 * 删除合作伙伴等级
	 */
    deletePartnerLevel: (basciInfo: {}) => {
        return Server.resource('POST', "/Partner/DeletePartnerLevel",
            basciInfo
        );
    },

}

export default PartnerLevelApi;