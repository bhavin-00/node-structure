var tbl_ModuleMaster = "tbl_ModuleMaster";


var query = {
  updateTableQuery: {
    table: '',
    update: [],
    filter: {
      field: '',
      operator: 'EQ',
      value: ''
    }
  },
  getModuleQuery: {
    table: tbl_ModuleMaster,
    select: [{
      field: 'pk_moduleID',
      alias: 'moduleid'
    },
    {
      field: 'moduleName',
      alias: 'modulename'
    },
    {
      field: 'adminCreated',
      alias: 'admincreated'
    }]
  },
}

module.exports = query;
