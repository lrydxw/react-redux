import Server from '../../../pub/Server';
import Config from '../../../pub/Config';

const FinanceSetApi = {
    /**
    * 获取积分配置
    */
    getSystemIntegral: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/FinanceSet/GetSystemIntegral",
            basciInfo
        );
    },
    /**
    * 修改积分配置
    */
    updateSystemIntegral: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/FinanceSet/UpdateSystemIntegral",
            basciInfo
        );
    },
    /**
    *获取支付配置信息
    */
    getPayConfig: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/FinanceSet/GetPayConfig",
            basciInfo
        );
    },
    /**
    *修改支付配置信息
    */
    updatePayConfig: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/FinanceSet/UpdatePayConfig",
            basciInfo
        );
    },
    /**
    * 获取提现配置
    */
    getWithdrawConfig: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/FinanceSet/GetWithdrawConfig",
            basciInfo
        );
    },
    /**
    * 修改提现配置
    */
    updateWithdrawConfig: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/FinanceSet/UpdateWithdrawConfig",
            basciInfo
        );
    },
}

export default FinanceSetApi;