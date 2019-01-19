module.exports = {

    // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    APP_NAME: 'MonitorServive',
    APP_VERSION: '2019.01.19',

    // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    ROUTE: {
        //EXPLORER
        URL_EXP_GET_LIST: '/exp_get_list/:path',
        URL_EXP_CREATE_FILE: '/exp_create_file',
        URL_EXP_CREATE_FOLDER: '/exp_create_folder',
    },

    // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    HTTP: {
        OK: 200,
        NO_CONTENT: 204,

        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        CONFLICT: 409,

        INTERNAL_SERVER_ERROR: 500
    },

    // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    MESSAGE: {
        EXP_FOLDER_CREATED: 'Folder successfully created!',
        EXP_ITEM_RENAMED: 'Item successfully renamed!',
        EXP_SUCCESSFULLY_UPLOADED: 'Successfully uploaded!',
    },

    // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    ERR_MSG: {
        GENERAL: {
            INTERNAL_SERVER_ERROR: 'Something went wrong please try again.',
        },

        EXPLORER: {
            UNKNOWN: 'Unknown error',
            FOLDER_ALREADY_EXISTS: 'Folder %s already exists',
            DELETED_ITEM: 'Successfully deleted item: %s',
            ITEM_NOT_EXISTS: 'Following item does not exists! -> %s',
            INVALID_ITEM_NAME: 'Invalid item name',
            PATH_IS_NOT_DIRECTORY: 'Following path is not directory! -> %s',
        },
    },

    KEY: {
        FILE_UPLOAD_PATH: 'file_upload_path'
    },




    // *****************************************************************************************************************************************************************************
    // FUNCTIONS
    // *****************************************************************************************************************************************************************************
    isRouteProtected: function (route) {
        return true;
    }


};

