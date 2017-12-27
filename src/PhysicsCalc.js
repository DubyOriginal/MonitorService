/**
 * Created by dvrbancic on 23/11/2017.
 */

class PhysicsCalc {

  calcupatePower(temp2, temp1) {

  }

  calculateEnergy(powArr){
    // powArr -> {ts:mSensorData[i].timestamp, pow: sValPOW_CKP}
    var sumArea = 0;
    for (var i = 0; i < powArr.length-1; i += 1) {
      var t1 = powArr[i].ts;
      var t2 = powArr[i+1].ts;
      var y1 = powArr[i].pow;
      var y2 = powArr[i+1].pow;
      dArea = (t2-t1)*(y1+y2)/2;
      console.log("dArea[" + i + "] = " + dArea);
      sumArea += dArea;
    }
    return sumArea;
  }

}


module.exports = PhysicsCalc;
