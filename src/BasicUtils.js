/**
 * Created by dvrbancic on 26/09/2017.
 */
'use strict'

//var mysql = require('mysql');


class BasicUtils {

    printJOSNRows(jsonRows) {
        if (jsonRows) {
            for (var i = 0; i < jsonRows.length; i++) {
                console.log("\t" + JSON.stringify(jsonRows[i]));
            }
        }
    }

}


module.exports = BasicUtils;

/*
 //message: base64.encode(JSON.stringify(payload))
 //message: base64.decode(JSON.stringify(payload.message))}

*/