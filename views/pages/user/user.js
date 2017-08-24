$(document).ready(function () {
  adminUser.init();
});

adminUser = {
  users: [],
  user_id: -1,
  adminUserTable: {},
  adminUsers: [],
  formMode: "",
  saveDisabled: false,
  /**
   * CBT:this function will be called on page load
   * @return {[type]} [description]
   */
  init: function () {
    adminUser.users.push({
      name: "name",
      width: "40%",
      targets: 0
    })
    adminUser.users.push({
      name: "mobile",
      width: "30%",
      targets: 1
    })
    if (canAddEdit > 0) {
      var buttons = [];
      if (canDelete > 0) {
        buttons.push({
          buttonObj: Constants.staticHtml.editButton,
          onClickEvent: adminUser.edit
        }, {
            buttonObj: Constants.staticHtml.deleteButton,
            onClickEvent: adminUser.delete
          });
      } else {
        buttons.push({
          buttonObj: Constants.staticHtml.editButton,
          onClickEvent: adminUser.edit
        });
      }
      adminUser.users.push({
        isActionButton: true,
        targets: 3,
        orderable: false,
        searchable: false,
        isVisible: true,
        buttons: buttons
      })

      adminUser.users.push({
        isActionButton: true,
        targets: 2,
        orderable: false,
        searchable: false,
        isVisible: true,
        buttons: [{
          buttonObj: Constants.staticHtml.approveButton,
          onClickEvent: adminUser.onActiveClick,
          dataRowField: "is_active",
          compareValue: 1
        }, {
          buttonObj: Constants.staticHtml.rejectButton,
          onClickEvent: adminUser.onActiveClick,
          dataRowField: "is_active",
          compareValue: 0
        }]
      });
    }
    adminUser.getData();
    adminUser.getRole();
  },
  /**
   * CBT:this function get user data and show into grid
   * @return {[type]} [description]
   */
  getData: function () {
    var getAdminUserUrl = Constants.Api.getAdminUser
    var headers = {
      Authorization: $.cookie(Constants.User.authToken)
    };
    Api.get(getAdminUserUrl, headers, function (error, res) {
      if (res != undefined && res.status == true) {
        adminUser.adminUserTable = common.bindCommonDatatable(res.data, adminUser.users, "gridAdminUser", objModules.adminUser);//, adminUser.edit, adminUser.delete);
      } else if (res != undefined && res.status == false) {
        common.showMessage(res.error.message, true);
      } else if (error != undefined && error.status == false) {
        common.showMessage(error.error.message, true);
      }
    });
  },
  /**
   * CBT:this function will be called when user click on edit from user grid and show currentRow into edit mode
   * @param  {[type]} currentRow [description]
   * @return {[type]}            [description]
   */
  edit: function (currentRow) {
    adminUser.formMode = "edit";
    event.preventDefault();
    var currentRowData = currentRow.data();
    if (currentRowData != undefined && currentRowData.user_id > 0) {
      adminUser.user_id = currentRowData.user_id;
      common.showHideDiv(false, objModules.adminUser);
      common.fillFormValues($("#frmAdminUser"), currentRowData);
      $("#txtPassword").val("");
      // $("#txtPassword").removeAttr("validation");
    }
  },
  /**
   * CBT:this function will be called when user click on delete button from grid and delete current row record
   * @param  {[type]} currentRow [description]
   * @return {[type]}            [description]
   */
  delete: function (currentRow) {
    common.deleteData(objModules.adminUser, Constants.Api.removeAdminUser, currentRow.data().user_id, function (res) {
      if (res != undefined && res.status == true) {
        currentRow.remove().draw(false);
        common.showMessage(res.message, false);
      } else {
        common.showMessage(res.errorMsg, true);
      }
    });
  },
  /**
   * CBT:this function will get All role with user type is admin
   * @return {[type]} [description]
   */
  getRole: function () {
    var roleUrl = Constants.Api.getRoles + "-1/1"
    var headers = {
      Authorization: $.cookie(Constants.User.authToken)
    };
    Api.get(roleUrl, headers, function (error, res) {
      if (res != undefined && res.status == true) {
        adminUser.bindSelect("#drpRole", res.data, "role_id", "role");
      } else if (res != undefined && res.status == false) {
        common.showMessage(res.error.message, true);
      } else if (error != undefined && error.status == false) {
        common.showMessage(error.error.message, true);
      }
    });
  },
  /**
   * CBT:this function clear addRole form values,reset role grid data
   * @param  {[type]} isshowGridDiv [description]
   * @return {[type]}               [description]
   */
  clearValues: function (isshowGridDiv) {
    if (isshowGridDiv == true) {
      common.showHideDiv(true, objModules.adminUser);
      adminUser.getData();
      adminUser.adminUserTable.destroy();
    }
    adminUser.user_id = -1;
    common.clearValues($("#frmAdminUser"));
    adminUser.saveDisabled=false;
  },
  /**
   * CBT:called when click on add icon to show add role form
   */
  add: function () {
    common.showHideDiv(false, objModules.adminUser);
    adminUser.clearValues(false);
    adminUser.formMode = "add";
    // $("#txtPassword").attr("validation","required");
  },
  /**
   * CBT:called when cancel add or edit role to cancel add/edit
   * @return {[type]} [description]
   */
  cancel: function () {
    adminUser.clearValues(true);
  },
  /**
   * CBT:this function is used to save or update role data
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  save: function (event) {
    if (adminUser.saveDisabled == false) {
      adminUser.saveDisabled=true;
      var validation = formValidation('frmAdminUser');
      if (validation == true) {
        var data = {};
        data = common.getFormValues($("#frmAdminUser"));
        data.user_id = adminUser.user_id;
        var headers = {
          Authorization: $.cookie(Constants.User.authToken)
        };
        Api.post(Constants.Api.addUpdateAdminUser, headers, data, function (error, res) {
          adminUser.saveDisabled=false;
          if (res != undefined && res.status == true) {
            common.showMessage(res.content.message, false);
            adminUser.clearValues(true);
          } else if (res != undefined && res.status == false) {
            common.showMessage(res.error.message, true);
            adminUser.clearValues(false);
          } else if (error != undefined && error.status == false) {
            common.showMessage(error.error.message, true);
            adminUser.clearValues(false);
          }
        });
      }else{
        adminUser.saveDisabled=false;
      }
    }

  },
  /**
   * CBT:this function fill values into select(dropdown) component
   * @param  {[type]} selectId     [description]
   * @param  {[type]} dataSet      [description]
   * @param  {[type]} valField     [description]
   * @param  {[type]} dispValField [description]
   * @return {[type]}              [description]
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
   * CBT:this function active or deactive user, when click on active/deactive button from grid
   * @param  {[type]} rowObj [description]
   * @return {[type]}        [description]
   */
  onActiveClick: function (rowObj) {
    var data = rowObj.data();
    var status = "0";
    if (data.is_active == "0") {
      status = "1";
    }
    common.updateActiveStatus(data.user_id, objModules.adminUser.tableId, status, function (res) {
      if (res != null && res.status == true) {
        adminUser.clearValues(true);
      }
    });
  }
}
