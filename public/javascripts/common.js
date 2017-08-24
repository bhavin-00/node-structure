/**
 * CBT:this is used to display Title in Grid ,
 * when active/deactive user request it used to send table id
 * @type {Object}
 */
objModules = {};

objModules.category = {
    name: "category",
    displayName: "Category",
    tableId: "2"
};

objModules.adminUser = {
    name: "adminUser",
    displayName: "AdminUser",
    tableId: "3"
};

objModules.role = {
    name: "role",
    displayName: "Role",
    tableId: "4"
};
objModules.module = {
    name: "module",
    displayName: "",
    tableId: "5"
};





common = {
    getDefaultImage: "images/noimage.jpg",
    /**
     * CBT:logout function when user click on logout
     * @return {[type]} [description]
     */
    logout: function () {
        var headers = {
            Authorization: $.cookie(Constants.User.authToken)
        };
        var data = {};
        Api.post(Constants.Api.signout, headers, data, function (error, res) {
            if (res != undefined && res.status == true) {
                $.removeCookie(Constants.User.authToken);
                window.location.replace('/');
            } else if (error.status == false) {
                $("#btnError").attr("data-message", error.error.message);
                $('#btnError').click();
            }
        });
    },
    /**
     * CBT:this function is for show/hide loader image
     * @return {[type]} [description]
     */
    blockUI: function () {
        $.blockUI({
            message: '<div class="loader"></div>'
        });
        var navHieght = $(".navbar").height();
        $(".loader").css("top", navHieght);
        $(".loader").fadeIn();
    },
    unblockUI: function () {
        $.unblockUI();
        $(".loader").fadeOut();
    },
    /**
     * CBT:common method for bind data table
     * @param  {[type]} data        [description]
     * @param  {[type]} objColumns  [description]
     * @param  {[type]} datatableID [description]
     * @param  {[type]} moduleName  [description]
     * @return {[type]}             [description]
     */
    bindCommonDatatable: function (data, objColumns, datatableID, moduleName) {
        var columns = [];
        var columnDefs = [];
        var events = [];
        objColumns.forEach(function (column) {
            var objColumnDefs = {};
            if (column.isVisible == undefined || column.isVisible == true) {
                if (column.targets != undefined) {
                    objColumnDefs.targets = column.targets;
                }
                if (column.width != undefined) {
                    objColumnDefs.width = column.width;
                }
                if (column.orderable != undefined) {
                    objColumnDefs.orderable = column.orderable;
                }
                if (column.searchable != undefined) {
                    objColumnDefs.searchable = column.searchable;
                }
                if (column.isActionButton != undefined && column.isActionButton == true) {
                    objColumnDefs.render = function (data, type, full, meta) {
                        var buttons = "";
                        for (var i = 0; i < column.buttons.length; i++) {
                            if (column.buttons[i].dataRowField == "" || column.buttons[i].dataRowField == undefined && column.buttons[i].compareValue == "" || column.buttons[i].compareValue == undefined) {
                                buttons += column.buttons[i].buttonObj.html;

                                if (column.buttons[i].idName != undefined && column.buttons[i].idName != null && column.buttons[i].idName != "") {
                                    buttons = $(buttons).attr("id", column.buttons[i].idName + full[column.buttons[i].idField]);
                                    buttons = buttons.prop("outerHTML");
                                }
                            } else {
                                if (full[column.buttons[i].dataRowField] == column.buttons[i].compareValue) {
                                    buttons += column.buttons[i].buttonObj.html;
                                }
                            }
                        }
                        return buttons;
                    }
                }
                columnDefs.push(objColumnDefs);
            }
            var objColumn = {};
            objColumn.data = column.name;
            columns.push(objColumn);
        });


        var tableObj = $('#' + datatableID).DataTable({
            data: data,
            columns: columns,
            responsive: true,
            "scrollX": false,
            "autoWidth": false,
            columnDefs: columnDefs,
            order: [0, 'asc'],
            bFilter: true,
            bLengthChange: true,
            pagingType: "simple",
            "paging": true,
            "searching": true,
            "language": {
                "info": " _START_ - _END_ of _TOTAL_ ",
                "sLengthMenu": "<span class='custom-select-title'>Rows per page:</span> <span class='custom-select'> _MENU_ </span>",
                "sSearch": "",
                "sSearchPlaceholder": "Search",
                "paginate": {
                    "sNext": " ",
                    "sPrevious": " "
                },
            },
            dom: "<'pmd-card-title'<'data-table-title'><'search-paper pmd-textfield'f>>" +
            "<'custom-select-info'<'custom-select-item'><'custom-select-action'>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'pmd-card-footer' <'pmd-datatable-pagination' l i p>>",
        });

        /// Select value
        $('.custom-select-info').hide();
        $('#' + datatableID + '_wrapper').find("div.data-table-title").html('<h2 class="pmd-card-title-text">' + moduleName.displayName + ' Table</h2>');
        // $("div.data-table-title").html('<h2 class="pmd-card-title-text">' + moduleName.displayName + ' Table</h2>');
        $('#' + datatableID + ' tbody').unbind("click");

        objColumns.forEach(function (column) {
            if (column.isActionButton != undefined && column.isActionButton == true) {
                for (var i = 0; i < column.buttons.length; i++) {
                    if (column.buttons[i].onClickEvent != "" && column.buttons[i].onClickEvent != undefined) {
                        clickHandler(column.buttons[i])
                    }
                }
            }
        })

        function clickHandler(btnObj) {
            $('#' + datatableID + ' tbody').on('click', btnObj.buttonObj.targetClass, function () {
                btnObj.onClickEvent(tableObj.row($(this).parents('tr')));
            });
        }
        return tableObj;
    },
    /**
     * CBT:this function clear values of form given as argument
     * @param  {[type]} formObject [description]
     * @return {[type]}            [description]
     */
    clearValues: function (formObject) {
        var values = {};
        formObject.find("input,select,textarea").each(function () {
            $(this).val("");
        });
        formObject.find("input[type=checkbox],input[type=radio]").each(function (e) {
            this.checked = false;
        });
        formObject.find("span").each(function () {
            if ($(this).attr("id") != undefined && $(this).attr("id") != null && $(this).attr("id") != "") {
                var elementId = $(this).attr("id").split("_")[1];
                if (elementId.toLowerCase() == "validation") {
                    $(this).hide();
                }
            }

        });
    },
    /**
     * CBT:this function fill values in form's components using values given as argument
     * @param  {[type]} formObject [description]
     * @param  {[type]} objData    [description]
     * @return {[type]}            [description]
     */
    fillFormValues: function (formObject, objData) {
        var values = {};
        formObject.find("input,select,textarea").each(function () {
            var inputObject = $(this);
            var fieldName = inputObject.attr("name");
            if (inputObject.attr("type") == "checkbox" || inputObject.attr("type") == "radio") { } else if (inputObject.attr("type") == "text") {
                $("input[name$='" + fieldName + "']").val(objData[fieldName]);
            } else if (inputObject.is("textarea")) {
                $("textarea[name$='" + fieldName + "']").val(objData[fieldName]);
            } else if (inputObject.is("select")) {
                $("select[name$='" + fieldName + "']").val(objData[fieldName]);
            }
        });
    },
    /**
     * CBT:get values of form given as argument in JSON format
     * @param  {[type]} formObject [description]
     * @return {[type]}            [description]
     */
    getFormValues: function (formObject) {
        var values = {};
        formObject.find("input,select,textarea").each(function () {
            var inputObject = $(this);
            var fieldName = inputObject.attr("name");
            var fieldValue = $.trim(inputObject.val());
            if (inputObject.attr("type") == "checkbox") {
                // auto set data type for checkbox
                if (!inputObject.attr("data-type")) {
                    // single checkbox with that name means dataType="BOOL" else it is "ARRAY"
                    if (formObject.find("input[name='" + fieldName + "']").length == 1) {
                        dataType = "BOOL";
                    } else {
                        dataType = "ARRAY";
                    }
                }
                if (dataType == "BOOL") fieldValue = inputObject.is(":checked");
                if (dataType == "ARRAY") fieldValue = inputObject.is(":checked") ? fieldValue : "";
                if (dataType == "ARRAY") {
                    if ($.isArray(values[fieldName]) && values[fieldName].length != 0) {
                        if (fieldValue != "") {
                            values[fieldName].push(fieldValue)
                        }
                    } else {
                        values[fieldName] = [];
                        if (fieldValue != "") {
                            values[fieldName].push(fieldValue)
                        }
                    }
                } else {
                    values[fieldName] = fieldValue;
                }
            } else if (inputObject.attr("type") == "radio") {
                if (inputObject.is(":checked")) {
                    values[fieldName] = $.trim(fieldValue);
                }
            } else {
                values[fieldName] = $.trim(fieldValue);
            }
        });

        return values;
    },
    /**
     * CBT:this function is used to show hide div based on argument
     * @param  {[type]} isshowGrid [description]
     * @param  {[type]} moduleName [description]
     * @return {[type]}            [description]
     */
    showHideDiv: function (isshowGrid, moduleName) {
        if (isshowGrid == true) {
            $('#divAdd' + moduleName.displayName).hide();
            $('#add' + moduleName.displayName).show();
            $('#div' + moduleName.displayName).show();
        } else {
            $('#divAdd' + moduleName.displayName).show();
            $('#add' + moduleName.displayName).hide();
            $('#div' + moduleName.displayName).hide();
        }
    },
    /**
     * CBT:common function to remove data based on id
     * @param  {[type]} moduleName [description]
     * @param  {[type]} APIURL     [description]
     * @param  {[type]} dataID     [description]
     * @param  {[type]} callBack   [description]
     * @return {[type]}            [description]
     */
    deleteData: function (moduleName, APIURL, dataID, callBack) {
        if (confirm("Are you sure you want to delete " + moduleName.displayName + "?")) {

            if (dataID > 0) {
                var deleteURL = APIURL + dataID;
                var headers = {
                    Authorization: $.cookie(Constants.User.authToken)
                };

                Api.remove(deleteURL, headers, "", function (error, res) {
                    if (res != undefined && res.status == true) {
                        if (callBack) {
                            callBack({
                                status: true,
                                message: res.data.message
                            });
                        }
                    } else if (error.status == false) {
                        if (callBack) {
                            callBack({
                                status: false,
                                errorMsg: error.error.message
                            });
                        }
                    }
                });
            } else {
                if (callBack) {
                    callBack({
                        status: false,
                        errorMsg: "Invalid" + moduleName.displayName + " ID"
                    });
                }
            }
        }
    },
    /**
     * CBT:common method to show error and success message
     * @param  {[type]}  message [description]
     * @param  {Boolean} isError [description]
     * @return {[type]}          [description]
     */
    showMessage: function (message, isError) {
        if (isError == true) {
            $("#btnError").attr("data-message", message);
            $('#btnError').click();
        } else {
            $("#btnSuccess").attr("data-message", message);
            $("#btnSuccess").click();
        }
    },
    /**
     * CBT:common method to fill dropdown values
     * @param  {[type]} data      [description]
     * @param  {[type]} element   [description]
     * @param  {[type]} keyName   [description]
     * @param  {[type]} valueName [description]
     * @return {[type]}           [description]
     */
    fillDropdown: function (data, element, keyName, valueName) {
        for (var i = 0; i < data.length; i++) {
            $("#" + element).append('<option value="' + data[i][keyName] + '">' + data[i][valueName] + '</option>');
        }
    },
    /**
     * CBT:this function is used to show loading message
     * @param  {[type]} status  [description]
     * @param  {[type]} message [description]
     * @return {[type]}         [description]
     */
    showLoader: function (status, message) {
        if (message == "") {
            message = "Please Wait...";
        }
        var loader = "<div id='loaderOverlay' style='position: fixed;top: 0;width: 100%;height: 100%;background: rgba(255, 255, 255, 0.78);z-index: 1000;'>" +
            "<div style='left: 40%;top:40%;position:fixed;width: 250px;text-align: center;'>" +
            "<img src='themes/images/newloader.gif' style='width:70px;'>" +
            "<p>" + message + "</p>" +
            "</div>" +
            "</div>";
        if ($("#loaderOverlay").length == 0) {
            $("body").append(loader);
        }
        if (status) {
            $("#loaderOverlay").show();
        } else {
            $("#loaderOverlay").hide();
        }
    },
    /**
     * CBT:common method to make status active/deactive
     * @param  {[type]}   id        [description]
     * @param  {[type]}   tableCode [description]
     * @param  {[type]}   status    [description]
     * @param  {Function} cb        [description]
     * @return {[type]}             [description]
     */
    updateActiveStatus: function (id, tableCode, status, cb) {
        var headers = {
            Authorization: $.cookie(Constants.User.authToken)
        };
        var data = {
            "id": id,
            "tbl_code": tableCode,
            "is_active": status
        }
        Api.post(Constants.Api.updateActiveStatus, headers, data, function (error, res) {
            if (res != undefined && res.status == true) {
                common.showMessage(res.data.message, false);
                cb(res);
            } else if (res != undefined && res.status == false) {
                common.showMessage(res.error.message, true);
                cb(res);
            } else if (error != undefined && error.status == false) {
                common.showMessage(error.error.message, true);
                cb(res);
            }
        });
    },
    uploadMedia: function (mediaFiles, fileType, callBack) {
        if (mediaFiles != undefined && mediaFiles.constructor === File) {
            var fileName = mediaFiles.name;
            var ext = fileName.substr(fileName.lastIndexOf(".") + 1, fileName.length);
            var fileTypeObj = Constants.supportedFile[fileType];
            if (fileTypeObj.extension.indexOf(ext) == -1) {
                var errMsg = (fileTypeObj.errorMsg != undefined && fileTypeObj.errorMsg != "") ? fileTypeObj.errorMsg : Constants.supportedFile.defaultMessage;
                callBack({
                    status: false,
                    errorMsg: errMsg
                });
                return;
            }
            var mediaData = new FormData();
            mediaData.append("file", mediaFiles);
            Constants.ImageObj.data = mediaData;
            Constants.ImageObj.headers = HeaderSettings.headerSetting;
            var requestMedia = $.ajax(Constants.ImageObj);
            requestMedia.done(function (data) {
                if (data.status) {
                    if (callBack) {
                        callBack({
                            status: true,
                            objImage: data.fileObj,
                            url: data.url
                        });
                    }
                }
            });
            requestMedia.fail(function (jqXHR, textStatus) {
                if (callBack) {
                    callBack({
                        status: false,
                        errorMsg: data.error.message
                    });
                }
            });
        }
    },

}

$.extend({
    getUrlVars: function () {
        var vars = [],
            hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    getUrlVar: function (name) {
        return $.getUrlVars()[name];
    }
});
