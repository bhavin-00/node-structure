$(document).ready(function () {
  category.init();
});

category = {
  category_id: -1,
  categories: [],
  imageObj: {},
  categoryTable: {},
  saveDisabled: false,
  init: function () {
    category.categories.push({
      name: "category_name",
      width: "20%",
      targets: 0
    });
    category.categories.push({
      name: "description",
      width: "50%",
      targets: 1
    });

    if (canAddEdit > 0) {
      var buttons = [];
      if (canDelete > 0) {
        buttons.push({
          buttonObj: Constants.staticHtml.editButton,
          onClickEvent: category.edit
        }, {
            buttonObj: Constants.staticHtml.deleteButton,
            onClickEvent: category.delete
          });
      } else {
        buttons.push({
          buttonObj: Constants.staticHtml.editButton,
          onClickEvent: category.edit
        });
      }
      category.categories.push({
        isActionButton: true,
        targets: 3,
        width: "10%",
        orderable: false,
        searchable: false,
        isVisible: true,
        buttons: buttons
      })
      category.categories.push({
        isActionButton: true,
        targets: 2,
        width: "10%",
        orderable: false,
        searchable: false,
        isVisible: true,
        buttons: [{
          buttonObj: Constants.staticHtml.approveButton,
          onClickEvent: category.onActiveClick,
          dataRowField: "is_active",
          compareValue: 1
        }, {
          buttonObj: Constants.staticHtml.rejectButton,
          onClickEvent: category.onActiveClick,
          dataRowField: "is_active",
          compareValue: 0
        }]
      })
    }
    category.getData();
  },
  getData: function () {
    var headers = {
      Authorization: $.cookie(Constants.User.authToken)
    };
    var categoryUrl = Constants.Api.getCategory + '-1/-1'
    Api.get(categoryUrl, headers, function (error, res) {
      if (error) {
        common.showMessage(error.error.message, true);
      }
      if (res != undefined && res.status == true) {
        category.categoryTable = common.bindCommonDatatable(res.data, category.categories, "gridCategory", objModules.category);
      } else if (res != undefined && res.status == false) {
        common.showMessage(res.error.message, true);
      }
    });
  },
  save: function (event) {
    var validation = formValidation('frmCategory');
    if (category.saveDisabled == false) {
      if (validation == true) {
        category.saveDisabled = true;
        var data = {};
        data = common.getFormValues($("#frmCategory"));
        data.category_id = category.category_id;
        data.imageObj = category.imageObj;
        var headers = {
          Authorization: $.cookie(Constants.User.authToken)
        };
        Api.post(Constants.Api.addUpdateCategory, headers, data, function (error, res) {
          if (res != undefined && res.status == true) {
            common.showMessage(res.data.message, false);
            category.clearValues(true);
          } else if (res != undefined && res.status == false) {
            common.showMessage(res.error.message, true);
            category.clearValues(false);
          } else if (error != undefined && error.status == false) {
            common.showMessage(error.error.message, true);
            category.clearValues(false);
          }
        });
      } else {
        category.saveDisabled = false;
      }

    }

  },
  clearValues: function (isshowGridDiv) {
    if (isshowGridDiv == true) {
      common.showHideDiv(true, objModules.category);
      category.getData();
      category.categoryTable.destroy();
    }
    category.category_id = -1;
    category.saveDisabled = false;
    category.imageObj = {};
    common.clearValues($("#frmCategory"));
  },
  cancel: function () {
    category.clearValues(true);
  },
  delete: function (currentRow) {
    common.deleteData(objModules.category, Constants.Api.deleteCategory, currentRow.data().category_id, function (res) {
      if (res != undefined && res.status == true) {
        currentRow.remove().draw(false);
        common.showMessage(res.message, false);
      } else {
        common.showMessage(res.errorMsg, true);
      }
    });
  },
  edit: function (currentRow) {
    event.preventDefault();
    var currentCategory = currentRow.data();
    if (currentCategory != undefined && currentCategory.category_id > 0) {
      category.category_id = currentCategory.category_id;
      common.showHideDiv(false, objModules.category);

      common.fillFormValues($("#frmCategory"), currentCategory);

      $('#imageCategory').attr("src", currentCategory.image_name);
    }
  },
  add: function () {
    common.showHideDiv(false, objModules.category);
    category.clearValues(false);
    $('#imageCategory').attr("src", common.getDefaultImage);
  },
  fileupload: function (event) {
    if (category.saveDisabled == false) {
      event.preventDefault();
      // $('#btnSubmit').attr('disabled', 'disabled');
      category.saveDisabled = true;
      common.uploadMedia(event.target.files[0], "image", function (res) {
        if (res.status) {
          // $('#btnSubmit').removeAttr("disabled");
          category.saveDisabled = false;
          category.imageObj = res.objImage;
          $('#imageCategory').attr("src", res.url);
        } else {
          common.showMessage(res.errorMsg, true);
          // $('#btnSubmit').removeAttr("disabled");
          category.saveDisabled = false;
          $('#imageCategory').attr("src", common.getDefaultImage);
        }
      });
    }

  },
  onActiveClick: function (rowObj) {
    var data = rowObj.data();
    var status = "0";
    if (data.is_active == "0") {
      status = "1";
    }
    common.updateActiveStatus(data.category_id, objModules.category.tableId, status, function (res) {
      if (res != null && res.status == true) {
        category.clearValues(true);
      }
    });
  }
}
$('input[name=mediaFile]').on('change', category.fileupload);
