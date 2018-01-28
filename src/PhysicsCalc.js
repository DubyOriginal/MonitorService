/**
 * Created by dvrbancic on 23/11/2017.
 */

class PhysicsCalc {

    calculatePower(ckp_pol, ckp_pov) {
        //P = Q * Cp * ro * dT;     Q[m3/s], Cp[J/kg°C], ro[kg/m3], dT[T2-T1]
        const dt_ckp = ckp_pol - ckp_pov;
        const Q_ckp = 2.2 / 60 / 60;    //flow -> 1.7 m3/h
        const Cp = 4200;            //heat capacity of water
        const ro = 1000;            //water density
        var result = Q_ckp * Cp * ro * dt_ckp / 1000;
        result = result.toFixed(3);

        return parseInt(result);
    }

    //powArr = [{ts:1515677890, pow:43},....]
    calculateEnergy(powArr) {
        // powArr -> {ts:mSensorData[i].timestamp, pow: sValPOW_CKP}
        //console.log("PhysicCalc: calculateEnergy.powArr = " + JSON.stringify(powArr));
        var sumArea = 0.;
        for (var i = 0; i < powArr.length - 1; i += 1) {
            var t1 = powArr[i + 1].ts;
            var t2 = powArr[i].ts;
            var y1 = powArr[i + 1].pow;
            var y2 = powArr[i].pow;
            var dArea = Math.floor((t2 - t1) * (y1 + y2) / 2);
            //console.log("var[" + i + "]    t1=" + t1 + ", t2=" + t2 + ", y1=" + y1 + ", y2=" + y2);
            //console.log("dArea[" + i + "] = " + dArea);
            sumArea += dArea;
        }
        sumArea = sumArea * 1000;  //to kW
        return sumArea;
    }

    convertJ2Wh(inEnergy){
        return inEnergy / 3600;
    }

    convertJ2Mass(inEnergy){
        let energyMassFactor = 4;   //1kg -> 4kWh
        let firewoodWeight = Math.floor(inEnergy / (3600 * 1000 * energyMassFactor));
        return firewoodWeight;
    }

    convertJ2Volume(inEnergy){
        let energyVolumeFactor = 300;     //1m3 -> 300kWh
        let firewoodVolume = Math.floor(inEnergy / (3600 * 1000 * energyVolumeFactor));
        return firewoodVolume;
    }

    //num: input number; digits: number of decimal places
    //console.log("nFormatter(96316, 3) -> " + nFormatter(96316, 3));
    //console.log("nFormatter(299792458, 3) -> " + nFormatter(299792458, 3));
    //console.log("nFormatter(1234, 1) -> " + nFormatter(1234, 1));
    //console.log("nFormatter(100400, 2) -> " + nFormatter(100400, 2));
    nFormatter(num, digits) {
        var si = [
            {value: 1, symbol: ""},
            {value: 1E3, symbol: "k"},
            {value: 1E6, symbol: "M"},
            {value: 1E9, symbol: "G"},
            {value: 1E12, symbol: "T"},
            {value: 1E15, symbol: "P"},
            {value: 1E18, symbol: "E"}
        ];
        var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var i;
        for (i = si.length - 1; i > 0; i--) {
            if (num >= si[i].value) {
                break;
            }
        }
        return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
    }

}


module.exports = PhysicsCalc;
