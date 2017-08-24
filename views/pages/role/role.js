$(document).ready(function () {
  role.init();
});

role = {
  pageButtons: [],
  role_id: -1,
  roleTable: {},
  formMode: "",
  saveDisabled: false,
  moduleGridFields: [],
  /**
   * [CBT:This function will be called on document ready event]
   * @return {[type]} [description]
   */
  init: function () {
    role.pageButtons.push({
      name: "role",
      width: "40%",
      targets: 0
    })
    role.pageButtons.push({
      name: "type",
      width: "30%",
      targets: 1
    })
    if (canAddEdit > 0) {
      var buttons = [];
      if (canDelete > 0) {
        buttons.push({
          buttonObj: Constants.staticHtml.editButton,
          onClickEvent: role.edit
        }, {
            buttonObj: Constants.staticHtml.deleteButton,
            onClickEvent: role.delete
          });
      } else {
        buttons.push({
          buttonObj: Constants.staticHtml.editButton,
          onClickEvent: role.edit
        });
      }
      role.pageButtons.push({
        isActionButton: true,
        targets: 2,
        orderable: false,
        searchable: false,
        isVisible: true,
        buttons: buttons
      });

    }
    role.getData();
    role.getUserType();
    role.getModule();
  },
 /**
  * [CBT:this function get role data and show in grid]
  * @return {[type]} [description]
  */
  getData: function () {
    var roleUrl = Constants.Api.getRoles + "-1/-1";
    var headers = {
      Authorization: $.cookie(Constants.User.authToken)
    };
    Api.get(roleUrl, headers, function (error, res) {
      if (res != undefined && res.status == true) {
        role.roleTable = common.bindCommonDatatable(res.data, role.pageButtons, "gridrole", objModules.role);//, adminUser.edit, adminUser.delete);
      } else if (res != undefined && res.status == false) {
        common.showMessage(res.error.message, true);
      } else if (error != undefined && error.status == false) {
        common.showMessage(error.error.message, true);
      }
    });
  },
  /**
   * CBT:this function will be called when user clicked on edit button from Grid and It takes current grid row as argument,make current row as editable
   * @param  {[type]} currentRow [description]
   * @return {[type]}            [description]
   */
  edit: function (currentRow) {
    role.formMode = "edit";
    event.preventDefault();
    var currentRowData = currentRow.data();
    if (currentRowData != undefined && currentRowData.role_id > 0) {
      common.showHideDiv(false, objModules.role);
      role.role_id = currentRowData.role_id;
      var roleUrl = Constants.Api.getRoleModuleMapping + currentRowData.role_id + "/-1";
      var headers = {
        Authorization: $.cookie(Constants.User.authToken)
      };
      Api.get(roleUrl, headers, function (error, res) {
        if (res != undefined && res.status == true) {
          role.fillRoleFormValues(currentRowData.user_type_id, currentRowData.role, res.data);
        } else if (res != undefined && res.status == false) {
          common.showMessage(res.error.message, true);
        } else if (error != undefined && error.status == false) {
          common.showMessage(error.error.message, true);
        }
      });
    }

  },
  /**
   * CBT:this function will be called when user clicked on delete button from grid and it takes current row as argument,delete current record from grid
   * @param  {[type]} currentRow [description]
   * @return {[type]}            [description]
   */
  delete: function (currentRow) {
    common.deleteData(objModules.role, Constants.Api.removeRole, currentRow.data().role_id, function (res) {
      if (res != undefined && res.status == true) {
        currentRow.remove().draw(false);
        common.showMessage(res.message, false);
      } else {
        common.showMessage(res.errorMsg, true);
      }
    });
  },
  /**
   * CBT:this function gets all user types and fill user type dropdown
   * @return {[type]} [description]
   */
  getUserType: function () {
    var userTypeUrl = Constants.Api.getUsertType;
    var headers = {
      Authorization: $.cookie(Constants.User.authToken)
    };
    Api.get(userTypeUrl, headers, function (error, res) {
      if (res != undefined && res.status == true) {
        role.bindSelect("#drpUserType", res.data, "typeid", "type");
      } else if (res != undefined && res.status == false) {
        common.showMessage(res.error.message, true);
      } else if (error != undefined && error.status == false) {
        common.showMessage(error.error.message, true);
      }
    });
  },
  /**
   * CBT:this function get all modules and call bindModuleTbl() function
   * @return {[type]} [description]
   */
  getModule: function () {
    var getModuleUrl = Constants.Api.getModule;
    var headers = {
      Authorization: $.cookie(Constants.User.authToken)
    };
    Api.get(getModuleUrl, headers, function (error, res) {
      if (res != undefined && res.status == true) {
        //CBT:bind module table (tableId,result data)
        role.bindModuleTbl("#gridModule", res.data);
      } else if (res != undefined && res.status == false) {
        common.showMessage(res.error.message, true);
      } else if (error != undefined && error.status == false) {
        common.showMessage(error.error.message, true);
      }
    });
  },
  /**
   * CBT:this function update role grid and reset module grid
   * @param  {[type]} isshowGridDiv [description]
   * @return {[type]}               [description]
   */
  clearValues: function (isshowGridDiv) {
    if (isshowGridDiv == true) {
      common.showHideDiv(true, objModules.role);
      role.getData();
      role.roleTable.destroy();
    }
    role.role_id = -1;
    role.clearModuleGrid();
    role.saveDisabled=false;
  },
  /**
   * CBT:called when user click on Add role icon
   */
  add: function () {
    common.showHideDiv(false, objModules.role);
    role.clearValues(false);
    role.formMode = "add";
  },
  /*
  CBT:Called when user cancel to add or edit role
   */
  cancel: function () {
    role.clearValues(true);
  },
  /**
   * CBT:this function save or update role data
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  save: function (event) {
    if (role.saveDisabled == false) {
      role.saveDisabled=true;
      var validation = formValidation('frmRole');
      if (validation == true) {
        var data = {};
        data.userTypeId = $("#drpUserType").val();
        data.roleName = $("#txtRole").val();
        var moduleGridRows = role.moduleTable.rows().data();
        var moduleOdj = [];
        for (var i = 0; i < moduleGridRows.length; i++) {
          var moduleInfo = {};
          moduleInfo.moduleId = moduleGridRows[i].moduleid;
          moduleInfo.canView = $("#chkCanView_" + moduleGridRows[i].moduleid).prop("checked") ? 1 : 0;
          moduleInfo.canAddEdit = $("#chkCanAddEdit_" + moduleGridRows[i].moduleid).prop("checked") ? 1 : 0;
          moduleInfo.canDelete = $("#chkCanDelete_" + moduleGridRows[i].moduleid).prop("checked") ? 1 : 0;
          moduleOdj.push(moduleInfo);
        }
        data.moduleRights = moduleOdj;
        data.role_id = role.role_id;
        var headers = {
          Authorization: $.cookie(Constants.User.authToken)
        };
        Api.post(Constants.Api.addRole, headers, data, function (error, res) {
          role.saveDisabled=false;
          if (res != undefined && res.status == true) {
            common.showMessage(res.data.message, false);
            role.clearValues(true);
          } else if (res != undefined && res.status == false) {
            common.showMessage(res.error.message, true);
            role.clearValues(false);
          } else if (error != undefined && error.status == false) {
            common.showMessage(error.error.message, true);
            role.clearValues(false);
          }
        });
      }else{
        role.saveDisabled=false;
      }
    }

  },
  /*
  CBT:this function fill values in select(dropdown) component
   */
  bindSelect: function (selectId, dataSet, valField, dispValField) {
    try {
      var selectOptions = "";
      for (var i = 0; i < dataSet.length; i++) {
        selectOptions += '<option value="' + dataSet[i][valField] + '">' + dataSet[i][dispValField] + '</option>'
      }
      $(selectId).append(selectOptions);
    } catch (e) {
      throw (e);
    }
  },
  /**
   * CBT:this function create module list table with check boxes
   * @param  {[type]} moduleTableId [description]
   * @param  {[type]} moduleData    [description]
   * @return {[type]}               [description]
   */
  bindModuleTbl: function (moduleTableId, moduleData) {
    role.moduleGridFields.push({
      name: "modulename",
      width: "40%",
      targets: 0
    });
    var buttons = [];
    buttons.push({
      buttonObj: Constants.staticHtml.checkBoxCanView,
      idField: "moduleid",
      idName: "chkCanView_",
    }, {
        buttonObj: Constants.staticHtml.checkBoxCanAddEdit,
        idField: "moduleid",
        idName: "chkCanAddEdit_",
      }, {
        buttonObj: Constants.staticHtml.checkBoxCanDelete,
        idField: "moduleid",
        idName: "chkCanDelete_",
      });

    role.moduleGridFields.push({
      isActionButton: true,
      targets: 1,
      orderable: false,
      searchable: false,
      isVisible: true,
      buttons: [buttons[0]]
    });
    role.moduleGridFields.push({
      isActionButton: true,
      targets: 2,
      orderable: false,
      searchable: false,
      isVisible: true,
      buttons: [buttons[1]]
    });
    role.moduleGridFields.push({
      isActionButton: true,
      targets: 3,
      orderable: false,
      searchable: false,
      isVisible: true,
      buttons: [buttons[2]]
    });
    role.moduleTable = common.bindCommonDatatable(moduleData, role.moduleGridFields, "gridModule", objModules.module);//, adminUser.edit, adminUser.delete);
    //CBT:remove table title and search bar
    $("#gridModule_wrapper").find(".pmd-card-title").remove();
  },
  /**
   * CBT:this function reset module table
   * @return {[type]} [description]
   */
  clearModuleGrid: function () {
    $("#drpUserType").prop("selectedIndex", 0);
    $("#txtRole").val("");
    var moduleGridRows = role.moduleTable.rows().data();
    for (var i = 0; i < moduleGridRows.length; i++) {
      $("#chkCanView_" + moduleGridRows[i].moduleid).prop("checked", false);
      $("#chkCanAddEdit_" + moduleGridRows[i].moduleid).prop("checked", false);
      $("#chkCanDelete_" + moduleGridRows[i].moduleid).prop("checked", false);
    }
  },
  /**
   * CBT:this function fill role form values for edit mode
   * @param  {[type]} userTypeId   [description]
   * @param  {[type]} roleName     [description]
   * @param  {[type]} moduleRights [description]
   * @return {[type]}              [description]
   */
  fillRoleFormValues: function (userTypeId, roleName, moduleRights) {
    var target = $("#drpUserType option[value=" + userTypeId + "]").index();
    $("#drpUserType ").prop("selectedIndex", target);
    $("#txtRole").val(roleName);
    var moduleGridRows = role.moduleTable.rows().data();
    for (var i = 0; i < moduleGridRows.length; i++) {
      var moduleData = moduleRights.filter(function (moduleInfo) {
        return moduleInfo.moduleid == moduleGridRows[i].moduleid;
      });

      moduleData[0].canView == 1 ? $("#chkCanView_" + moduleGridRows[i].moduleid).prop("checked", true) : $("#chkCanView_" + moduleGridRows[i].moduleid).prop("checked", false);
      moduleData[0].canAddEdit == 1 ? $("#chkCanAddEdit_" + moduleGridRows[i].moduleid).prop("checked", true) : $("#chkCanAddEdit_" + moduleGridRows[i].moduleid).prop("checked", false);
      moduleData[0].canDelete == 1 ? $("#chkCanDelete_" + moduleGridRows[i].moduleid).prop("checked", true) : $("#chkCanDelete_" + moduleGridRows[i].moduleid).prop("checked", false);
    }
  }
}
