/**
 * Created by dvrbancic on 23/11/2017.
 */

class PhysicsCalc {

    calcupatePower(ckp_pol, ckp_pov) {
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
        console.log("PhysicCalc: calculateEnergy.powArr = " + JSON.stringify(powArr));
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

}


module.exports = PhysicsCalc;
