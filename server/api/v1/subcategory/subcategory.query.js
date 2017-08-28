var tbl_SubCategoryMaster = "tbl_SubCategoryMasterBhavin";

var query = {
    createSubCategory: {
        table: tbl_SubCategoryMaster,
        insert: []
    },
    updateSubCategory: {
        table: tbl_SubCategoryMaster,
        update: [],
        filter: {
            field: 'pk_subCategoryId',
            operator: 'EQ',
            value: ''
        }
    },
    getSubCategoryQuery: {

        join: {
            table: 'tbl_CategoryMaster',
            alias: 'A',
            joinwith: [{
                table: 'tbl_SubCategoryMasterBhavin',
                alias: 'B',
                joincondition: {
                    table: 'A',
                    field: 'pk_categoryID',
                    operator: 'eq',
                    value: {
                        table: 'B',
                        field: 'fk_categoryId'
                    }
                }
            }]
        },

        select: [{
            table: 'A',
            field: 'pk_categoryId',
            alias: 'category_id'
        }, {
            table: 'A',
            field: 'category',
            alias: 'category_name'
        }, {
            table: 'B',
            field: 'pk_subCategoryId',
            alias: 'sub_category_id'
        }, {
            table: 'B',
            field: 'subCategory',
            alias: 'sub_category_name'
        }, {
            table: 'B',
            field: 'description',
            alias: 'description'
        }, {
            table: 'B',
            field: 'imageName',
            alias: 'image_name'
        }, {
            table: 'B',
            field: 'isActive',
            alias: 'is_active'
        }
        ],
        filter: {}
    },
    checkSubCategoryValidQuery: {
        table: tbl_SubCategoryMaster,
        select: [{
            field: 'pk_subCategoryId',
            alias: 'sub_category_id'
        }, {
            field: 'imageName',
            alias: 'image_name'
        }],
        filter: {

        },
    },
    removeSubCategoryQuery: {
        table: tbl_SubCategoryMaster,
        delete: [],
        filter: {
            field: 'pk_subCategoryId',
            operator: 'EQ',
            value: ''
        }
    },
}

module.exports = query;
