$(document).ready(function() {
    subcategory.init();
});

subcategory = {
    sub_category_id: -1,
    subcategories: [],
    imageObj: {},
    subcategoryTable: {},
    saveDisabled: false,
    init: function() {
        subcategory.subcategories.push({
            name: "sub_category_name",
            width: "20%",
            targets: 0
        });
        subcategory.subcategories.push({
            name: "category_name",
            width: "20%",
            targets: 1
        });
        subcategory.subcategories.push({
            name: "description",
            width: "50%",
            targets: 2
        });

        if (canAddEdit > 0) {
            var buttons = [];
            if (canDelete > 0) {
                buttons.push({
                    buttonObj: Constants.staticHtml.editButton,
                    onClickEvent: subcategory.edit
                }, {
                        buttonObj: Constants.staticHtml.deleteButton,
                        onClickEvent: subcategory.delete
                    });
            } else {
                buttons.push({
                    buttonObj: Constants.staticHtml.editButton,
                    onClickEvent: subcategory.edit
                });
            }
            subcategory.subcategories.push({
                isActionButton: true,
                targets: 4,
                width: "10%",
                orderable: false,
                searchable: false,
                isVisible: true,
                buttons: buttons
            })
            subcategory.subcategories.push({
                isActionButton: true,
                targets: 3,
                width: "10%",
                orderable: false,
                searchable: false,
                isVisible: true,
                buttons: [{
                    buttonObj: Constants.staticHtml.approveButton,
                    onClickEvent: subcategory.onActiveClick,
                    dataRowField: "is_active",
                    compareValue: 1
                }, {
                    buttonObj: Constants.staticHtml.rejectButton,
                    onClickEvent: subcategory.onActiveClick,
                    dataRowField: "is_active",
                    compareValue: 0
                }]
            })
        }
        subcategory.getData();
        subcategory.getCategory();
    },
    getData: function() {
        var headers = {
            Authorization: $.cookie(Constants.User.authToken)
        };
        var subcategoryUrl = Constants.Api.getSubCategory + '-1/-1';
        Api.get(subcategoryUrl, headers, function(error, res) {
            if (error) {
                common.showMessage(error.error.message, true);
            }
            if (res != undefined && res.status == true) {
                subcategory.subcategoryTable = common.bindCommonDatatable(res.data, subcategory.subcategories, "gridSubcategory", objModules.subcategory);
            } else if (res != undefined && res.status == false) {
                common.showMessage(res.error.message, true);
            }
        });
    },
    getCategory: function() {
        var getCategoryUrl = Constants.Api.getCategory + "-1/1"
        var headers = {
            Authorization: $.cookie(Constants.User.authToken)
        };
        Api.get(getCategoryUrl, headers, function(error, res) {
            if (res != undefined && res.status == true) {
                console.log(res.data);
                subcategory.bindSelect("#drpCategory", res.data, "category_id", "category_name");
            } else if (res != undefined && res.status == false) {
                common.showMessage(res.error.message, true);
            } else if (error != undefined && error.status == false) {
                common.showMessage(error.error.message, true);
            }
        });
    },
    bindSelect: function(selectId, dataSet, valField, dispValField) {
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
    save: function(event) {
        var validation = formValidation('frmSubCategory');
        if (subcategory.saveDisabled == false) {
            if (validation == true) {
                subcategory.saveDisabled = true;
                var data = {};
                data = common.getFormValues($("#frmSubCategory"));
                console.log(data);
                data.sub_category_id = subcategory.sub_category_id;
                // data.imageObj = category.imageObj;
                var headers = {
                    Authorization: $.cookie(Constants.User.authToken)
                };
                Api.post(Constants.Api.addUpdateSubcategory, headers, data, function(error, res) {
                    if (res != undefined && res.status == true) {
                        common.showMessage(res.data.message, false);
                        subcategory.clearValues(true);
                    } else if (res != undefined && res.status == false) {
                        common.showMessage(res.error.message, true);
                        subcategory.clearValues(false);
                    } else if (error != undefined && error.status == false) {
                        common.showMessage(error.error.message, true);
                        subcategory.clearValues(false);
                    }
                });
            } else {
                subcategory.saveDisabled = false;
            }

        }

    },
    clearValues: function(isshowGridDiv) {
        if (isshowGridDiv == true) {
            common.showHideDiv(true, objModules.subcategory);
            subcategory.getData();
            subcategory.subcategoryTable.destroy();
        }
        subcategory.sub_category_id = -1;
        subcategory.saveDisabled = false;
        subcategory.imageObj = {};
        common.clearValues($("#frmSubCategory"));
    },
    cancel: function() {
        subcategory.clearValues(true);
    },
    delete: function(currentRow) {
        common.deleteData(objModules.subcategory, Constants.Api.deleteSubCategory, currentRow.data().sub_category_id, function(res) {
            if (res != undefined && res.status == true) {
                currentRow.remove().draw(false);
                common.showMessage(res.message, false);
            } else {
                common.showMessage(res.errorMsg, true);
            }
        });
    },
    edit: function(currentRow) {
        event.preventDefault();
        var currentRowData = currentRow.data();
        if (currentRowData != undefined && currentRowData.sub_category_id > 0) {
            subcategory.sub_category_id = currentRowData.sub_category_id;
            common.showHideDiv(false, objModules.subcategory);
            common.fillFormValues($("#frmSubCategory"), currentRowData);
        }
    },
    add: function() {
        common.showHideDiv(false, objModules.subcategory);
        subcategory.clearValues(false);
        $('#imageSubcategory').attr("src", common.getDefaultImage);
    },
    // fileupload: function (event) {
    //     if (category.saveDisabled == false) {
    //         event.preventDefault();
    //         // $('#btnSubmit').attr('disabled', 'disabled');
    //         category.saveDisabled = true;
    //         common.uploadMedia(event.target.files[0], "image", function (res) {
    //             if (res.status) {
    //                 // $('#btnSubmit').removeAttr("disabled");
    //                 category.saveDisabled = false;
    //                 category.imageObj = res.objImage;
    //                 $('#imageCategory').attr("src", res.url);
    //             } else {
    //                 common.showMessage(res.errorMsg, true);
    //                 // $('#btnSubmit').removeAttr("disabled");
    //                 category.saveDisabled = false;
    //                 $('#imageCategory').attr("src", common.getDefaultImage);
    //             }
    //         });
    //     }

    // },
    onActiveClick: function(rowObj) {
        var data = rowObj.data();
        console.log(data);
        var status = "0";
        if (data.is_active == "0") {
            status = "1";
        }
        common.updateActiveStatus(data.sub_category_id, objModules.subcategory.tableId, status, function(res) {
            if (res != null && res.status == true) {
                subcategory.clearValues(true);
            }
        });
    }
}
$('input[name=mediaFile]').on('change', subcategory.fileupload);
