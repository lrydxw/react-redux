import Server from '../../pub/Server';
import Config from '../../pub/Config';

const FinanceApi = {
    /**
    * 获取系统费用列表
    */
    getSystemMoneyLogPageList: (basciInfo: {}) => {
        return Server.resource('POST', "Finance/GetSystemMoneyLogPageList",
            basciInfo
        );
    },
    /**
    * 获取提现配置
    */
    getWithdrawConfigList: (basciInfo: {}) => {
        return Server.resource('POST', "Finance/GetWithdrawConfigList",
            basciInfo
        );
    },
    /**
    * 提交提现配置
    */
    updateWithdrawConfigList: (basciInfo: {}) => {
        return Server.resource('POST', "Finance/UpdateWithdrawConfigList",
            basciInfo
        );
    },
    /**
    *获取会员提现列表
    */
    getWithdrawalApplyPageList: (basciInfo: {}) => {
        return Server.resource('POST', "Finance/GetWithdrawalApplyPageList",
            basciInfo
        );
    },
    /**
    *获取会员提现信息
    */
    getMemberWithdrawal: (basciInfo: {}) => {
        return Server.resource('POST', "Finance/GetMemberWithdrawal",
            basciInfo
        );
    },
    /**
    *修改会员提现状态
    */
    updateMemberWithdrawal: (basciInfo: {}) => {
        return Server.resource('POST', "Finance/UpdateMemberWithdrawal",
            basciInfo
        );
    },
    /**
    *获取财务概况
    */
    getFinanceProfile: (basciInfo: {}) => {
        return Server.resource('POST', "Finance/GetFinanceProfile",
            basciInfo
        );
    },
    /**
    *获取财务趋势数据
    */
    getFinanceStatistics: (basciInfo: {}) => {
        return Server.resource('POST', "Finance/GetFinanceStatistics",
            basciInfo
        );
    },
}

export default FinanceApi;