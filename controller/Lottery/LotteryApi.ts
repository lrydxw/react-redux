import Server from '../../pub/Server';
import Config from '../../pub/Config';

const LotteryApi = {
    /**
	 * 添加/修改签到抽奖
	 */
    insertLotterySet: (basciInfo: {}) => {
        return Server.resource('POST', "Lottery/InsertLotterySet",
            basciInfo
        );
    },
    /**
    *获取签到抽奖设置
    */
    getLotterySet: (basciInfo: {}) => {
        return Server.resource('POST', "Lottery/GetLotterySet",
            basciInfo
        );
    },
    /**
    *获取签到抽奖设置
    */
    getLotterySetPageList: (basciInfo: {}) => {
        return Server.resource('POST', "Lottery/GetLotterySetPageList",
            basciInfo
        );
    },
    /**
    *修改签到抽奖发布状态
    */
    updateLotterySetPublish: (basciInfo: {}) => {
        return Server.resource('POST', "Lottery/UpdateLotterySetPublish",
            basciInfo
        );
    },
    /**
    *获取签到记录
    */
    getLotterySignInPageList: (basciInfo: {}) => {
        return Server.resource('POST', "Lottery/GetLotterySignInPageList",
            basciInfo
        );
    },
    /**
    *摇奖
    */
    drawLottery: (basciInfo: {}) => {
        return Server.resource('POST', "Lottery/DrawLottery",
            basciInfo
        );
    },
    /**
    *修改签到抽奖详情
    */
    updateLotterySetDetails: (basciInfo: {}) => {
        return Server.resource('POST', "Lottery/UpdateLotterySetDetails",
            basciInfo
        );
    },
    /**
    *添加联合发起人信息
    */
    updateOrInsertLottery: (basciInfo: {}) => {
        return Server.resource('POST', "Lottery/UpdateOrInsertLottery",
            basciInfo
        );
    },
}

export default LotteryApi;