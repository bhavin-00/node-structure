var tbl_CategoryMaster = "tbl_CategoryMaster";

var query = {
  createCategory: {
    table: tbl_CategoryMaster,
    insert: []
  },
  updateCategory: {
    table: tbl_CategoryMaster,
    update: [],
    filter: {
      field: 'pk_categoryID',
      operator: 'EQ',
      value: ''
    }
  },
  getCategoryQuery: {
    table: tbl_CategoryMaster,
    select: [{
      field: 'pk_categoryID',
      alias: 'category_id'
    }, {
      field: 'category',
      alias: 'category_name'
    }, {
      field: 'description',
      alias: 'description'
    }, {
      field: 'imageName',
      alias: 'image_name'
    }, {
      field: 'isActive',
      alias: 'is_active'
    }],
    filter: {}
  },
  checkCateGoryValidQuery: {
    table: tbl_CategoryMaster,
    select: [{
      field: 'pk_categoryID',
      alias: 'categoryid'
    }, {
      field: 'imageName',
      alias: 'imageName'
    }],
    filter: {

    },
  },
  removeCategoryQuery: {
    table: tbl_CategoryMaster,
    delete: [],
    filter: {
      field: 'pk_categoryID',
      operator: 'EQ',
      value: ''
    }
  },
}

module.exports = query;
