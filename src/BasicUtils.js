/**
 * Created by dvrbancic on 26/09/2017.
 */
'use strict'

//var mysql = require('mysql');


class BasicUtils {

    printJOSNRows(jsonRows, printRowCnt) {
        if (jsonRows) {
            let forCnt = (printRowCnt === 0) ? jsonRows.length : printRowCnt;
            for (var i = 0; i < forCnt; i++) {
                console.log("\t" + i + ": " + JSON.stringify(jsonRows[i]));
            }
        }
    }

    printJOSNRowsWithPrefixText(prefixText, jsonRows, printRowCnt) {
        if (jsonRows) {
            let forCnt = (printRowCnt === 0) ? jsonRows.length : printRowCnt;
            for (var i = 0; i < forCnt; i++) {
                console.log(prefixText + ": \t" + i + ": " + JSON.stringify(jsonRows[i]));
            }
        }
    }

}


module.exports = BasicUtils;

/*
 //message: base64.encode(JSON.stringify(payload))
 //message: base64.decode(JSON.stringify(payload.message))}



                console.log("MonitorApi: getCalculatedConsumptionDataForRange - consumptionData: " +
                    "\n   0:  " + JSON.stringify(consumptionData[0]) +
                    "\n   1:  " + JSON.stringify(consumptionData[1]) +
                    "\n   2:  " + JSON.stringify(consumptionData[2]) +
                    "\n   3:  " + JSON.stringify(consumptionData[3]) +
                    "\n   4:  " + JSON.stringify(consumptionData[4]) +
                    "\n   5:  " + JSON.stringify(consumptionData[5]) +
                    "\n   6:  " + JSON.stringify(consumptionData[6]) +
                    "\n   7:  " + JSON.stringify(consumptionData[7]) +
                    "\n   8:  " + JSON.stringify(consumptionData[8])
                );
*/