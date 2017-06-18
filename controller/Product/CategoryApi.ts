import Server from '../../pub/Server';
import Config from '../../pub/Config';

/**
 * 产品分类API模块
 */
const ProductCategoryApi = {
	/**
	 * 获取产品分类列表
	 */
    getProductCategoryList: (basciInfo: {}) => {
        return Server.resource('POST', "Product/GetCategoryTreeList",
            basciInfo
        );
    },
    /**
	 * 获取产品分类
	 */
    getProductCategory: (basciInfo: {}) => {
        return Server.resource('POST', "Product/GetCategory",
            basciInfo
        );
    },
	/**
	 * 新增产品分类
	 */
    insertProductCategory: (basciInfo: {}) => {
        return Server.resource('POST', "Product/InsertCategory",
            basciInfo
        );
    },
	/**
	 * 修改产品分类
	 */
    updateProductCategory: (basciInfo: {}) => {
        return Server.resource('POST', "Product/UpdateCategory",
            basciInfo
        );
    },
	/**
	 * 删除产品分类
	 */
    deleteProductCategory: (basciInfo: {}) => {
        return Server.resource('POST', "Product/DeleteCategory",
            basciInfo
        );
    },
    /**
	 * 获取产品分类树选择
	 */
    getProductCategoryTree: (basciInfo: {}) => {
        return Server.resource('POST', "Product/GetCategoryTreeSelectList",
            basciInfo
        );
    },
    /**
	 * 获取产品分类枚举列表
	 */
    getProductCategoryEnum: (basciInfo: {}) => {
        return Server.resource('POST', "Product/GetProductTypeEnumList",
            basciInfo
        );
    },

    /**
    * 获取产品分类枚举列表
    */
    getCategorySelectList: (basciInfo: {}) => {
        return Server.resource('POST', "Product/GetCategorySelectList",
            basciInfo
        );
    },
}

export default ProductCategoryApi;