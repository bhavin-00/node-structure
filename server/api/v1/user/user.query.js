var tbl_UserMaster = "tbl_UserMaster";
var tbl_RoleMaster = "tbl_RoleMaster";
var tbl_UserType = "tbl_UserType";
var tbl_OTP = "tbl_OTP";
var tbl_AccessToken = "tbl_AccessToken";
var tbl_transactionMaster = "tbl_transactionMaster";
var view_GetUserDetail = "view_GetUserDetail";

var query = {
    checkUserIsExistQuery: {
        table: tbl_UserMaster,
        select: [{
            field: 'pk_userId',
            alias: 'user_id'
        }, {
            field: 'IFNULL(name,"")',
            encloseField: false,
            alias: 'name'
        }, {
            field: 'countryCode',
            alias: 'country_code'
        }, {
            field: 'mobile',
            alias: 'mobile'
        }, {
            field: 'isActive',
            alias: 'is_active'
        }, {
            field: 'isVerified',
            alias: 'is_verify'
        }],
        filter: {
            or: [{
                and: [{
                    field: 'countryCode',
                    operator: 'EQ',
                    value: ''
                }, {
                    field: 'mobile',
                    operator: 'EQ',
                    value: ''
                }]
            }, {
                field: 'email',
                operator: 'EQ',
                value: ''
            }]
        }
    }, // check user is exist query end
    createUserQuery: {
        table: tbl_UserMaster,
        insert: []
    },
    getUserInfoQuery: {
        table: view_GetUserDetail,
        select: [{
            field: 'pk_userId',
            alias: 'user_id'
        }, {
            field: 'countryCode',
            alias: 'country_code'
        }, {
            field: 'mobile',
            alias: 'mobile'
        }, {
            field: 'role',
            alias: 'role'
        }, {
            field: 'userTypeID',
            alias: 'user_type_id'
        }, {
            field: 'IFNULL(name,"")',
            encloseField: false,
            alias: 'name'
        }, {
            field: 'IFNULL(email,"")',
            encloseField: false,
            alias: 'email'
        }, {
            field: 'IFNULL(photo,"")',
            encloseField: false,
            alias: 'profile_photo'
        }, {
            field: 'IFNULL(moduleName,"")',
            encloseField: false,
            alias: 'module_name'
        }, {
            field: 'IFNULL(canView,"")',
            encloseField: false,
            alias: 'can_view'
        }, {
            field: 'IFNULL(canAddEdit,"")',
            encloseField: false,
            alias: 'can_add_edit'
        }, {
            field: 'IFNULL(canDelete,"")',
            encloseField: false,
            alias: 'can_delete'
        }, {
            field: 'IFNULL(adminCreated,"")',
            encloseField: false,
            alias: 'admin_created'
        }],
        filter: {
            and: [{
                field: 'isActive',
                operator: 'EQ',
                value: 1
            }, {
                or: [{
                    and: [{
                        field: 'countryCode',
                        operator: 'EQ',
                        value: ''
                    }, {
                        field: 'mobile',
                        operator: 'EQ',
                        value: ''
                    }]
                }, {
                    field: 'pk_userID',
                    operator: 'EQ',
                    value: ''
                }, {
                    and: [{
                        field: 'countryCode',
                        operator: 'EQ',
                        value: ''
                    }, {
                        field: 'mobile',
                        operator: 'EQ',
                        value: ''
                    }, {
                        field: 'password',
                        operator: 'EQ',
                        value: ''
                    }]
                }, {
                    and: [{
                        field: 'email',
                        operator: 'EQ',
                        value: ''
                    }, {
                        field: 'password',
                        operator: 'EQ',
                        value: ''
                    }]
                }]
            }]
        }
    },
    updateAccessTokenQuery: {
        table: tbl_AccessToken,
        update: [{
            field: 'isExpired',
            fValue: 1
        }],
        filter: {
            or: [{
                and: [{
                    field: 'fk_userID',
                    operator: 'EQ',
                    value: ''
                }, {
                    field: 'deviceID',
                    operator: 'EQ',
                    value: ''
                }, {
                    field: 'requestHost',
                    operator: 'EQ',
                    value: ''
                }]
            }, {
                field: 'deviceID',
                operator: 'EQ',
                value: ''
            }, {
                field: 'requestHost',
                operator: 'EQ',
                value: ''
            }]
        }
    },
    insertAccessTokenQuery: {
        table: tbl_AccessToken,
        insert: {
            field: ["fk_userID", "token", "expiryDateTime", "deviceID", "requestHost"],
            fValue: []
        }
    },
    checkUserTransactionQuery: {
        table: tbl_transactionMaster,
        select: [{
            field: 'pk_transactionID',
            aggregation: 'count',
            alias: 'totalCount'
        }],
        filter: {
            and: [{
                field: 'deviceID',
                operator: 'EQ',
                value: ''
            }, {
                field: 'deviceType',
                operator: 'EQ',
                value: ''
            }]
        }
    },
    updateUserTransactionQuery: {
        table: tbl_transactionMaster,
        update: [{
            field: 'isLogedIn',
            fValue: 1
        }],
        filter: {
            and: [{
                field: 'deviceID',
                operator: 'EQ',
                value: ''
            }, {
                field: 'deviceType',
                operator: 'EQ',
                value: ''
            }]
        }
    },
    insertUserTransactionQuery: {
        table: tbl_transactionMaster,
        insert: {
            field: ["deviceID", "deviceType"],
            fValue: []
        }
    },
    validateUserQuery: {
        table: tbl_UserMaster,
        select: [{
            field: 'pk_userID',
            aggregation: 'count',
            alias: 'totalCount'
        }],
        filter: {
            and: [{
                field: 'pk_userID',
                operator: 'EQ',
                value: ''
            }, {
                field: 'password',
                operator: 'EQ',
                value: ''
            }]
        }
    },
    updateUserQuery: {
        table: tbl_UserMaster,
        update: [],
        filter: {
            or: [{
                and: [{
                    field: 'countryCode',
                    operator: 'EQ',
                    value: ''
                }, {
                    field: 'mobile',
                    operator: 'EQ',
                    value: ''
                }]
            }, {
                field: 'pk_userID',
                operator: 'EQ',
                value: ''
            }]
        }
    },
    checkUserIdIsValidQuery: {
        table: tbl_UserMaster,
        select: [{
            field: 'pk_userId',
            alias: 'user_id'
        }],
        filter: {
            field: 'pk_userID',
            operator: 'EQ',
            value: ''
        }
    },
    getUserByUserTypeQuery: {
        join: {
            table: tbl_UserMaster,
            alias: 'UM',
            joinwith: [{
                table: tbl_RoleMaster,
                alias: 'RM',
                joincondition: {
                    table: 'RM',
                    field: 'pk_RoleID',
                    operator: 'eq',
                    value: {
                        table: 'UM',
                        field: 'fk_roleID'
                    }
                }
            }, {
                table: tbl_UserType,
                alias: 'UT',
                joincondition: {
                    table: 'UT',
                    field: 'pk_userTypeID',
                    operator: 'eq',
                    value: {
                        table: 'RM',
                        field: 'fk_userTypeID'
                    }
                }
            }]
        },
        select: [{
            field: 'UM.pk_userID',
            encloseField: false,
            alias: 'user_id'
        }, {
            field: 'UM.fk_roleID',
            encloseField: false,
            alias: 'role_id'
        }, {
            field: 'UM.name',
            encloseField: false,
            alias: 'name'
        }, {
            field: 'UM.email',
            encloseField: false,
            alias: 'email'
        }, {
            field: 'UM.countryCode',
            encloseField: false,
            alias: 'country_code'
        }, {
            field: 'UM.mobile',
            encloseField: false,
            alias: 'mobile'
        }, {
            field: 'RM.fk_userTypeID',
            encloseField: false,
            alias: 'user_type_id'
        }, {
            field: 'RM.role',
            encloseField: false,
            alias: 'role'
        }, {
            field: 'UT.type',
            encloseField: false,
            alias: 'type'
        }, {
            field: 'UM.isActive',
            encloseField: false,
            alias: 'is_active'
        }],
        filter: {
            table: 'RM',
            field: 'fk_userTypeID',
            operator: 'EQ',
            value: ""
        }
    },
    checkOTPLimitQuery: {
        table: tbl_OTP,
        select: [{
            field: 'pk_otpID',
            aggregation: 'count',
            alias: 'totalCount'
        }],
        filter: {
            and: [{
                field: 'countryCode',
                operator: 'EQ',
                value: ''
            }, {
                field: 'mobile',
                operator: 'EQ',
                value: ''
            }, {
                field: 'expiryDateTime',
                operator: 'GTEQ',
                value: ''
            }, {
                field: 'expiryDateTime',
                operator: 'LTEQ',
                value: ''
            }]
        }
    },
    updateOTPQuery: {
        table: tbl_OTP,
        update: [{
            field: 'isExpired',
            fValue: 1
        }],
        filter: {
            and: [{
                field: 'countryCode',
                operator: 'EQ',
                value: ''
            }, {
                field: 'mobile',
                operator: 'EQ',
                value: ''
            }, {
                field: 'isExpired',
                operator: 'EQ',
                value: 0
            }]
        }
    },
    saveOTPQuery: {
        table: tbl_OTP,
        insert: {
            field: ["countryCode", "mobile", "OTP", "expiryDateTime"],
            fValue: []
        }
    },
    verifyOTPQuery: {
        table: tbl_OTP,
        select: [{
            field: 'expiryDateTime',
            alias: 'expiry_datetime'
        }, {
            field: 'OTP',
            alias: 'otp'
        }],
        filter: {
            and: [{
                field: 'countryCode',
                operator: 'EQ',
                value: ''
            }, {
                field: 'mobile',
                operator: 'EQ',
                value: ''
            }, {
                field: 'expiryDateTime',
                operator: 'GTEQ',
                value: ''
            }, {
                field: 'isExpired',
                operator: 'EQ',
                value: 0
            }]
        }
    },
    getRoleQuery: {
        join: {
            table: tbl_RoleMaster,
            alias: 'RM',
            joinwith: [{
                table: tbl_UserType,
                alias: 'UT',
                joincondition: {
                    table: 'RM',
                    field: 'fk_userTypeID',
                    operator: 'eq',
                    value: {
                        table: 'UT',
                        field: 'pk_userTypeID'
                    }
                }
            }]
        },
        select: [{
            table: 'RM',
            field: 'pk_RoleID',
            alias: 'role_id'
        }, {
            table: 'RM',
            field: 'role',
            alias: 'role'
        }, {
            table: 'RM',
            field: 'fk_userTypeID',
            alias: 'user_type_id'
        }, {
            table: 'UT',
            field: 'type',
            alias: 'type'
        }],
        filter: {

        }
    },
    removeUserQuery: {
        table: tbl_UserMaster,
        delete: [],
        filter: {
            field: 'pk_userID',
            operator: 'EQ',
            value: ''
        }
    },
    getUserInfoQueryAdmin: {
        table: view_GetUserDetail,
        select: [{
            field: 'pk_userId',
            alias: 'user_id'
        }, {
            field: 'countryCode',
            alias: 'country_code'
        }, {
            field: 'mobile',
            alias: 'mobile'
        }, {
            field: 'role',
            alias: 'role'
        }, {
            field: 'userTypeID',
            alias: 'user_type_id'
        }, {
            field: 'IFNULL(name,"")',
            encloseField: false,
            alias: 'name'
        }, {
            field: 'IFNULL(email,"")',
            encloseField: false,
            alias: 'email'
        }, {
            field: 'IFNULL(photo,"")',
            encloseField: false,
            alias: 'profile_photo'
        }, {
            field: 'IFNULL(moduleName,"")',
            encloseField: false,
            alias: 'module_name'
        }, {
            field: 'IFNULL(canView,"")',
            encloseField: false,
            alias: 'can_view'
        }, {
            field: 'IFNULL(canAddEdit,"")',
            encloseField: false,
            alias: 'can_add_edit'
        }, {
            field: 'IFNULL(canDelete,"")',
            encloseField: false,
            alias: 'can_delete'
        }, {
            field: 'IFNULL(adminCreated,"")',
            encloseField: false,
            alias: 'admin_created'
        }],
        filter: {
            and: [{
                field: 'isActive',
                operator: 'EQ',
                value: 1
            }, {
                field: 'isVerified',
                operator: 'EQ',
                value: 1
            }, {
                field: 'email',
                operator: 'EQ',
                value: ''
            }, {
                field: 'password',
                operator: 'EQ',
                value: ''
            }, {
                field: 'userTypeID',
                operator: 'EQ',
                value: '1'
            }]
        }
    },
    getUserTypeQuery: {
        table: tbl_UserType,
        select: [{
            field: 'pk_userTypeID',
            alias: 'typeid'
        },
        {
            field: 'type',
            alias: 'type'
        }],
        filter: {
            field: 'isActive',
            operator: 'EQ',
            value: '1'
        }
    }
};


module.exports = query
