var tbl_ModuleMaster = "tbl_ModuleMaster";
var tbl_RoleMaster = "tbl_RoleMaster";
var tbl_RoleModuleMapping = "tbl_RoleModuleMapping";
var tbl_UserMaster = "tbl_UserMaster";

var query = {
    addRoleQuery: {
        table: tbl_RoleMaster,
        insert: []
    },
    moduleMappingQuery: {
        table: tbl_RoleModuleMapping,
        insert: []
    },
    getRoleModuleMappingQuery: {
        table: tbl_RoleModuleMapping,
        select: [{
            field: 'fk_moduleID',
            alias: 'moduleid'
        },
        {
            field: 'fk_roleID',
            alias: 'roleid'
        },
        {
            field: 'canView',
            alias: 'canView'
        },
        {
            field: 'canAddEdit',
            alias: 'canAddEdit'
        },
        {
            field: 'canDelete',
            alias: 'canDelete'
        }],
        filter: {
        }
    },
    updateRoleQuery: {
        table: tbl_RoleMaster,
        update: []
    },
    updateRoleModuleMappingQuery: {
        table: tbl_RoleModuleMapping,
        update: []
    },
    checkUserIsExistQuery: {
        table: tbl_UserMaster,
        select: [{
            field: 'pk_userId',
            alias: 'user_id'
        }],
        filter: {
            field: 'fk_roleID',
            operator: 'EQ',
            value: ''
        }
    },
    removeRoleQuery: {
        table: tbl_RoleMaster,
        delete: [],
        filter: {
            field: 'pk_RoleID',
            operator: 'EQ',
            value: ''
        }
    },
    removeRoleMappingQuery: {
        table: tbl_RoleModuleMapping,
        delete: [],
        filter: {
            field: 'fk_roleID',
            operator: 'EQ',
            value: ''
        }
    },
}

module.exports = query;
