const maxProductImage = 10;
const maxProductHeight = 1000;
const maxProductWidth = 1000;
const maxBannerWidth = 924;
const maxBannerHeight = 254;

Constants = {
    Api: {
        baseUrl: "/api/v1",
        apiKey: 1,
        signin: "/user/user-signin-admin/",
        signout: "/user/signout",
        signup: "/user/user-signup",
        getCategory: "/category/get-category/",
        addUpdateCategory: "/category/addupdate-category/",
        deleteCategory: "/category/remove-category/",
        getAdminUser: "/user/get-adminuser/",
        removeAdminUser: "/user/remove-adminuser/",
        getRoles: "/user/get-userrole/",
        addUpdateAdminUser: "/user/addupdate-adminuser",
        getUserByRole: "/user/get-userlist/",
        getUsertType: "/user/get-usertype",
        updateActiveStatus: "/other/active",
        getModule: "/other/getModule",
        addRole: "/role/addupdate-role",
        getRoleModuleMapping: "/role/get-roleModuleMapping/",
        removeRole: "/role/remove-role/",
    },
    User: {
        currentUser: "current_user",
        authToken: "Authorization",
        udid: "udid"
    },
    walletRequestStatus: {
        0: "Pending",
        1: "Approved",
        2: "Rejected",
    },
    storeType: [{
        type: "Vegetable",
        shortDesc: "VE",
        image: ""
    }, {
        type: "Mall",
        shortDesc: "MA",
        image: ""
    }, {
        type: "Grocery",
        shortDesc: "GR",
        image: ""
    }, {
        type: "Other",
        shortDesc: "OT",
        image: ""
    }],
    ImageObj: {
        url: "http://localhost:3000/api/v1/other/upload",
        type: "POST",
        data: '',
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
        headers: ''
    },
    productMeasure: [{
        id: "1",
        measure: "Kg/Gm"
    }, {
        id: "2",
        measure: "Lt/Ml"
    }, {
        id: "3",
        measure: "Unit"
    }],
    maxProductImage: maxProductImage,
    maxProductWidth: maxProductWidth,
    maxProductHeight: maxProductHeight,
    maxBannerWidth: maxBannerWidth,
    validImageFormats: ["jpeg", "jpg", "png"],
    commonMessage: {
        "MAX_PRODUCT_IMAGE_LIMIT": "Maximum " + maxProductImage + " images are allowed",
        "ERR_INVALID_PRODUCT_IMAGE_RESOLUTION": "Image resolution should be " + maxProductWidth + " X " + maxProductHeight,
        "ERR_INVALID_BANNER_IMAGE_RESOLUTION": "Image resolution should be " + maxBannerWidth + " X " + maxBannerHeight,
        "ERR_NO_IMAGE_SELECTED": "No Image Selected",
        "ERR_INVALID_IMAGE_FILE": "Please select image file only"
    },
    offerType: [{
        id: "1",
        offer: "Pramotional"
    }],
    discountType: [{
        id: "1",
        discount: "Cashback"
    },
    {
        id: "2",
        discount: "Instant Discount"
    }
    ],
    discountIn: [{
        id: "1",
        name: "In Rs"
    },
    {
        id: "2",
        name: "In Percent"
    }
    ],
    staticHtml: {
        approveButton: {
            html: '<button class="btn btn-sm pmd-btn-fab pmd-btn-flat pmd-ripple-effect btn-primary btn-success btnApprove" type="button"><i class="material-icons pmd-sm">check</i></button>',
            targetClass: 'button.btnApprove'
        },
        rejectButton: {
            html: '<button class="btn btn-sm pmd-btn-fab pmd-btn-flat pmd-ripple-effect btn-primary btn-danger btnReject" type="button" ><i class="material-icons pmd-sm">clear</i></button>',
            targetClass: 'button.btnReject'
        },
        editButton: {
            html: '<button class="btn btn-sm pmd-btn-fab pmd-btn-flat pmd-ripple-effect btn-primary btnEdit" type="button"><i class="material-icons pmd-sm">edit</i></button>',
            targetClass: 'button.btnEdit'
        },
        deleteButton: {
            html: '<button class="btn btn-sm pmd-btn-fab pmd-btn-flat pmd-ripple-effect btn-danger btnDelete"  type="button"><i class="material-icons pmd-sm">delete</i></button>',
            targetClass: 'button.btnDelete'
        },
        checkBoxCanView: {
            html: "<input type='checkBox' class='chkCanView'/>"
        },
        checkBoxCanAddEdit: {
            html: "<input type='checkBox' class='chkCanAddEdit'/>"
        },
        checkBoxCanDelete: {
            html: "<input type='checkBox' class='chkCanDelete'/>"
        },
    },
    supportedFile: {
        spreadSheet: {
            extension: ["csv", "CSV", "xlsx", "XLSX"],
            errorMsg: "Invalid File please select .csv or .xlsx file"
        },
        image: {
            extension: ["jpg", "JPG", "png", "PNG"],
            errorMsg: "Invalid Image file please select .jpg or .png file"
        },
        defaultMessage: "Invalid File Selected"
    }
}
