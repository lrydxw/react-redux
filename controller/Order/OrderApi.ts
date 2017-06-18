import Server from '../../pub/Server';
import Config from '../../pub/Config';

const OrderApi = {
    /**
	 * 获取订单列表
	 */
    getGoodsOrderPageList: (basciInfo: {}) => {
        return Server.resource('POST', "Order/GetGoodsOrderPageList",
            basciInfo
        );
    },
    /**
	 * 获取订单详情
	 */
    getGoodsOrder: (basciInfo: {}) => {
        return Server.resource('POST', "Order/GetGoodsOrder",
            basciInfo
        );
    },
    /**
	 * 获取订单商品列表
	 */
    getGoodsPageList: (basciInfo: {}) => {
        return Server.resource('POST', "Order/GetOrderGoodsPageList",
            basciInfo
        );
    },
    /**
	 * 获取订单七日概况
	 */
    getGoodsOrderProfile: (basciInfo: {}) => {
        return Server.resource('POST', "Order/GetGoodsOrderProfile",
            basciInfo
        );
    },
    /**
	 * 获取订单趋势图数据
	 */
    getGoodsOrderStatistics: (basciInfo: {}) => {
        return Server.resource('POST', "Order/GetGoodsOrderStatistics",
            basciInfo
        );
    },
    /**
	 * 获取退款订单列表
	 */
    getRefundOrderPageList: (basciInfo: {}) => {
        return Server.resource('POST', "Order/GetRefundOrderPageList",
            basciInfo
        );
    },
    /**
	 * 获取退款订单详情
	 */
    getRefundOrder: (basciInfo: {}) => {
        return Server.resource('POST', "Order/GetRefundOrder",
            basciInfo
        );
    },
    /**
    *拒绝/同意退款请求
    */
    refuseRefundOrder: (basciInfo: {}) => {
        return Server.resource('POST', "Order/RefuseRefundOrder",
            basciInfo
        );
    },
    /**
    *获取物流公司列表
    */
    getLogisticConfigList: (basciInfo: {}) => {
        return Server.resource('POST', "Order/GetLogisticConfigList",
            basciInfo
        );
    },
    /**
    *确认退款
    */
    confirmRefundOrder: (basciInfo: {}) => {
        return Server.resource('POST', "Order/ConfirmRefundOrder",
            basciInfo
        );
    },
    /**
    *获取订单日志
    */
    getOrderRecordList: (basciInfo: {}) => {
        return Server.resource('POST', "Order/GetOrderRecordList",
            basciInfo
        );
    },
    /**
    *调单处理
    */
    supplementOrderTask: (basciInfo: {}) => {
        return Server.resource('POST', "Order/SupplementOrderTask",
            basciInfo
        );
    },
    /**
    *填写物流公司和物流单号
    */
    updateRefundOrderCourierByManager: (basciInfo: {}) => {
        return Server.resource('POST', "Order/UpdateRefundOrderCourierByManager",
            basciInfo
        );
    },

    ImportOrder: (basciInfo: {}) => {
        return Server.resource('POST', "Order/ImportOrder",
            basciInfo
        );
    },
}

export default OrderApi;