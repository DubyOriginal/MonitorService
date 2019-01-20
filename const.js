module.exports = {

    // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    APP_NAME: 'MonitorServive',
    APP_VERSION: '2019.01.19',

    // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // @@@.S - JUST TEMPORARY -> this data should be accessed only from DB
    SENSOR_PARAMS: [
        {ID: 100, CODE: "s6", NAME: "puffer 4",   ADDRESS: "28 06 fe 5b 05 00 00 d1"},
        {ID: 101, CODE: "s5", NAME: "rad topla",  ADDRESS: "28 29 a0 5b 05 00 00 74"},
        {ID: 102, CODE: "s7", NAME: "puffer 3",   ADDRESS: "28 ff 88 f1 30 17 04 7e"},
        {ID: 103, CODE: "s4", NAME: "rad hladna", ADDRESS: "28 ff 8a 22 31 17 04 df"},
        {ID: 104, CODE: "s1", NAME: "ckp core",   ADDRESS: "28 ff 4e 6c 31 17 03 94"},
        {ID: 105, CODE: "s2", NAME: "ckp pol",    ADDRESS: "28 ff 95 1a 31 17 04 98"},
        {ID: 106, CODE: "s8", NAME: "puffer 2",   ADDRESS: "28 ff c7 0c 31 17 03 3c"},
        {ID: 107, CODE: "s3", NAME: "ckp pov",    ADDRESS: "28 ff b7 b8 30 17 04 e6"},
        {ID: 108, CODE: "s9", NAME: "puffer 1",   ADDRESS: "28 ff 2f 15 31 17 03 73"},
        {ID: 109, CODE: "s10", NAME: "soba",      ADDRESS: "28 ff b8 1c 31 17 04 85"},
        {ID: 110, CODE: "s11", NAME: "vani",      ADDRESS: "28 ff 67 b6 30 17 04 ad"}
    ],

    // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    ROUTE: {
        //EXPLORER
        URL_EXP_GET_LIST: '/exp_get_list/:path',
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
    },

    // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    ERR_MSG: {
        GENERAL: {
            INTERNAL_SERVER_ERROR: 'Something went wrong please try again.',
        },

        EXPLORER: {
            UNKNOWN: 'Unknown error',
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
    },

    getNameForSensorID(sensorID) {

        //for (var i in SENSOR_PARAMS) {
        //    alert(SENSOR_PARAMS[i]);
        //}
        let sName = "unknown";
        for (const sensor of this.SENSOR_PARAMS) {
            if (sensor.ID == sensorID){
                sName = sensor.NAME;
                break;
            }
        }
        return sName;
    }


};

