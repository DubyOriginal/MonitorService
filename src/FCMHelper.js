/**
 * Created by dvrbancic on 12/11/2017.
 */
'use strict';

var FCM = require('fcm-node')
var serverKey = require('../private/serviceAccountKey.json') //put the generated private key path here

const MonitorApi = require('./MonitorApi');

//let mobToken = "eBLI15_yY1Q:APA91bHD300cQgtGqb2987AFvWBWiJUrtlc_0KCEjvT1pJ7rki31rmgweymrcvfEFBxrG6LDR2BFkQhpMRbwlfPz34PW9Y3QIDA2-dc5KEg5XCfx0079TuL5SYPBdhoQNfQX8RgkgFOO";


var fcm = new FCM(serverKey);

class FCMHelper {

  constructor() {
    console.log("FCMHelper initialized");

  }

  pushMessage(mobToken, msgTitle, msgDescription, msgData) {
    console.log(">>>>>>>> pushMessage: [msgTitle: " + msgTitle + ", msgDescription: " + msgDescription + "]")

    var message = {
      to: mobToken,
      notification: {
        title: msgTitle,
        body: msgDescription,
        sound: "default"
      },
      data: {
        sensor_id: msgData.sensor_id,
        sensor_value: msgData.sensor_value,
        sensor_alarm_min: msgData.sensor_alarm_min,
        sensor_alarm_max: msgData.sensor_alarm_max
      }
    };

    console.log("fcm.send: message -> " + JSON.stringify(message))

    fcm.send(message, function (err, response) {
      if (err) {
        console.log("fcm.send: ERROR -> " + JSON.stringify(err))
      } else {
        console.log("fcm.send: SUCCESS");  // -> ", JSON.stringify(response))
      }
    })
  };
}
//new FCMHelper();

module.exports = FCMHelper;

