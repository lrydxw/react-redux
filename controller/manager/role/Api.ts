import Server from '../../../pub/Server';
import Config from '../../../pub/Config';

/**
 * 角色API模块
 */
const ManagerRoleApi = {
	/**
	 * 获取角色列表
	 */
    getRoleInfo: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/Role/GetList",
            basciInfo
		);
	},
	/**
	 * 获取角色列表
	 */
    getFunctionInfo: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/Role/GetFunction",
            basciInfo
		);
	},

	/**
	 * 新增角色
	 */
    insertRoleInfo: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/Role/Insert",
            basciInfo
		);
	},
	/**
	 * 修改角色权限
	 */
    updatePermission: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/Role/UpdatePermission",
            basciInfo
		);
	},
	/**
	 * 修改角色名称
	 */
    updateRoleName: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/Role/UpdateRoleName",
            basciInfo
		);
	},
	/**
	 * 修改角色名称
	 */
    deleteRole: (basciInfo: {}) => {
        return Server.resource('POST', "Manager/Role/DeleteRole",
            basciInfo
		);
    },
    /**
	 * 获取菜单数据
	 */
    getMenuList: (basciInfo: {}) => {
        return Server.resource('POST', "Menu/GetFunction",
            basciInfo
        );
    },
}

export default ManagerRoleApi;