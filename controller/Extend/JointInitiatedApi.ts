import Server from '../../pub/Server';
import Config from '../../pub/Config';

const JointInitiatedApi = {
    /**
	 * 获取联合发起人列表
	 */
    getJointInitiatedPageList: (basciInfo: {}) => {
        return Server.resource('POST', "Extend/GetJointInitiatedPageList",
            basciInfo
        );
    },
    /**
    * 添加/修改联合发起人（第一步）
    */
    insertJointInitiatedFirst: (basciInfo: {}) => {
        return Server.resource('POST', "Extend/InsertJointInitiatedFirst",
            basciInfo
        );
    },
    /**
	 * 获取联合发起人信息（第一步）
	 */
    getJointInitiatedFirst: (basciInfo: {}) => {
        return Server.resource('POST', "Extend/GetJointInitiatedFirst",
            basciInfo
        );
    },
    /**
	 * 删除联合发起人
	 */
    deleteJointInitiated: (basciInfo: {}) => {
        return Server.resource('POST', "Extend/DeleteJointInitiated",
            basciInfo
        );
    },
    /**
	 * 修改联合发起人状态
	 */
    updateJointInitiatedPublish: (basciInfo: {}) => {
        return Server.resource('POST', "Extend/UpdateJointInitiatedPublish",
            basciInfo
        );
    },
    /**
	 * 获取联合发起人表单列表
	 */
    getJointExtendFormValuePageList: (basciInfo: {}) => {
        return Server.resource('POST', "Extend/GetJointExtendFormValuePageList",
            basciInfo
        );
    },
    /**
	 * 获取联合发起人表单详情
	 */
    getJointExtendFormValue: (basciInfo: {}) => {
        return Server.resource('POST', "Extend/GetJointExtendFormValue",
            basciInfo
        );
    },
    /**
	 * 修改联合发起人审核状态
	 */
    updateJointExtendFormValue: (basciInfo: {}) => {
        return Server.resource('POST', "Extend/UpdateJointExtendFormValue",
            basciInfo
        );
    },
    /**
    *获取扩展表单模板数据
    */
    getExtendFormTemplateList: (basciInfo: {}) => {
        return Server.resource('POST', "Extend/GetExtendFormTemplateList",
            basciInfo
        );
    },
    /**
    *添加联合发起人信息
    */
    updateOrInsertJointInitiated: (basciInfo: {}) => {
        return Server.resource('POST', "Extend/UpdateOrInsertJointInitiated",
            basciInfo
        );
    },
}

export default JointInitiatedApi;