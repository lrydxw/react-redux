import Server from '../../pub/Server';
import Config from '../../pub/Config';

/**
 * 产品API模块
 */
const ProductApi = {

    UpdateOrInsertProduct: (basciInfo: {}) => {
        return Server.resource('POST', "Product/UpdateOrInsertProduct",
            basciInfo
        );
    },
	/**
	 * 获取产品列表
	 */
    getProductList: (basciInfo: {}) => {
        return Server.resource('POST', "Product/GetProductPageList",
            basciInfo
        );
    },

	/**
	 * 删除产品
	 */
    deleteProduct: (basciInfo: {}) => {
        return Server.resource('POST', "Product/DeleteProduct",
            basciInfo
        );
    },
    /**
	 * 产品上架
	 */
    setProductOnLine: (basciInfo: {}) => {
        return Server.resource('POST', "Product/SetProductOnLine",
            basciInfo
        );
    },
    /**
	 * 产品下架
	 */
    setProductOffLine: (basciInfo: {}) => {
        return Server.resource('POST', "Product/SetProductOffLine",
            basciInfo
        );
    },

    /**
    * 获取合作伙伴配置信息
    */
    getPartnerLevelConfig: (basciInfo: {}) => {
        return Server.resource('POST', "Product/GetPartnerLevelConfig",
            basciInfo
        );
    },

    /**
    * 产品上、下架（批量）
    */
    setProductStatusBatch: (basciInfo: {}) => {
        return Server.resource('POST', "Product/SetProductStatusBatch",
            basciInfo
        );
    },

    /**
    * 添加赠品
    */
    insertDonation: (basciInfo: {}) => {
        return Server.resource('POST', "Product/InsertDonation",
            basciInfo
        );
    },

    /**
    * 获取赠品列表
    */
    getDonationList: (basciInfo: {}) => {
        return Server.resource('POST', "Product/GetDonationList",
            basciInfo
        );
    },

    /**
   * 获取详情信息
   */
    getCourseInfoDetail: (basciInfo: {}) => {
        return Server.resource('POST', "Product/GetCourseInfoDetail",
            basciInfo
        );
    },

    /**
  * 更新详情信息
  */
    updateCourseInfoDetail: (basciInfo: {}) => {
        return Server.resource('POST', "Product/UpdateCourseInfoDetail",
            basciInfo
        );
    },

    /**
* 获取产品信息选择列表
*/
    getSelectProductDataList: (basciInfo: {}) => {
        return Server.resource('POST', "Product/GetSelectProductDataList",
            basciInfo
        );
    },

    /**
* 获取产品基本信息
*/
    getProductBasicInfo: (basciInfo: {}) => {
        return Server.resource('POST', "Product/GetProductBasicInfo",
            basciInfo
        );
    },

    /**
* 添加课程基本信息
*/
    insertProductBasicInfo: (basciInfo: {}) => {
        return Server.resource('POST', "Product/InsertProductBasicInfo",
            basciInfo
        );
    },

    /**
* 更新产品基本信息
*/
    updateProductBasicInfo: (basciInfo: {}) => {
        return Server.resource('POST', "Product/UpdateProductBasicInfo",
            basciInfo
        );
    },

    /**
* 更新产品详情信息
*/
    updateProductDetailInfo: (basciInfo: {}) => {
        return Server.resource('POST', "Product/UpdateProductDetailInfo",
            basciInfo
        );
    },

    /**
* 获取产品详情信息
*/
    getProductDetailInfo: (basciInfo: {}) => {
        return Server.resource('POST', "Product/GetProductDetailInfo",
            basciInfo
        );
    },


    /**
* 获取地区信息
*/
    getArea: (basciInfo: {}) => {
        return Server.resource('POST', "Product/GetArea",
            basciInfo
        );
    },

    /**
* 获取选择地区名称
*/
    getAreaNames: (basciInfo: {}) => {
        return Server.resource('POST', "Product/GetAreaNames",
            basciInfo
        );
    },

    /**
* 添加运费模版
*/
    insertFareTemplate: (basciInfo: {}) => {
        return Server.resource('POST', "Product/InsertFareTemplate",
            basciInfo
        );
    },

    /**
* 更新运费模版
*/
    updateFareTemplate: (basciInfo: {}) => {
        return Server.resource('POST', "Product/UpdateFareTemplate",
            basciInfo
        );
    },

    /**
* 获取运费模版信息
*/
    getFareTemplate: (basciInfo: {}) => {
        return Server.resource('POST', "Product/GetFareTemplate",
            basciInfo
        );
    },

    /**
* 删除运费模版
*/
    deleteFareTemplate: (basciInfo: {}) => {
        return Server.resource('POST', "Product/DeleteFareTemplate",
            basciInfo
        );
    },

    /**
* 获取运费模板分页数据
*/
    getFareTemplateList: (basciInfo: {}) => {
        return Server.resource('POST', "Product/GetFareTemplateList",
            basciInfo
        );
    },

    /**
* 获取运费模板选择项数据
*/
    getFareTemplateSelectData: (basciInfo: {}) => {
        return Server.resource('POST', "Product/GetFareTemplateSelectData",
            basciInfo
        );
    },

    /**
* 获取产品出售信息
*/
    getProductSellSetInfo: (basciInfo: {}) => {
        return Server.resource('POST', "Product/GetProductSellSetInfo",
            basciInfo
        );
    },

    /**
* 更新产品出售信息
*/
    updateProductSellSetInfo: (basciInfo: {}) => {
        return Server.resource('POST', "Product/UpdateProductSellSetInfo",
            basciInfo
        );
    },

    /**
* 获取产品返利信息
*/
    getProductRebateInfo: (basciInfo: {}) => {
        return Server.resourceAsyn('POST', "Product/GetProductRebateInfo",
            basciInfo
        );
    },

    /**
* 设置返利信息
*/
    setProductRebateInfo: (basciInfo: {}) => {
        return Server.resource('POST', "Product/SetProductRebateInfo",
            basciInfo
        );
    },

    /**
* 获取商品型号列表数据
*/
    getGoodsSizeListData: (basciInfo: {}) => {
        return Server.resource('POST', "Product/GetGoodsSizeListData",
            basciInfo
        );
    },


    /**
* 删除产品型号
*/
    deleteGoodsRebate: (basciInfo: {}) => {
        return Server.resource('POST', "Product/DeleteGoodsRebate",
            basciInfo
        );
    },

    /**
* 添加产品型号类别
*/
    insertSizeCategory: (basciInfo: {}) => {
        return Server.resourceAsyn('POST', "Product/InsertSizeCategory",
            basciInfo
        );
    },

    /**
* 添加产品型号属性
*/
    insertSizeProperty: (basciInfo: {}) => {
        return Server.resourceAsyn('POST', "Product/InsertSizeProperty",
            basciInfo
        );
    },

    /**
* 获取产品型号类别选择项数据
*/
    getSizeCategorySelectData: (basciInfo: {}) => {
        return Server.resource('POST', "Product/GetSizeCategorySelectData",
            basciInfo
        );
    },

    /**
* 获取产品型号属性选择项数据
*/
    getSizePropertySelectData: (basciInfo: {}) => {
        return Server.resource('POST', "Product/GetSizePropertySelectData",
            basciInfo
        );
    },
    /**
    *获取商品规格信息
    */
    getProductSellInfo: (basciInfo: {}) => {
        return Server.resource('POST', "Product/GetProductSellInfo",
            basciInfo
        );
    },
    /**
    * 更新商品规格信息
    */
    updateProductSellInfo: (basciInfo: {}) => {
        return Server.resource('POST', "Product/UpdateProductSellInfo",
            basciInfo
        );
    },
    /**
    * 获取商品分利信息
    */
    getGoodsRebateInfoData: (basciInfo: {}) => {
        return Server.resource('POST', "Product/GetGoodsRebateInfoData",
            basciInfo
        );
    },
}

export default ProductApi;