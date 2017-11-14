/**
 * Created by dvrbancic on 12/11/2017.
 */

var FCM = require('fcm-node')
var serverKey = require('../private/serviceAccountKey.json') //put the generated private key path here

const MonitorApi = require('./MonitorApi');

//let mobToken = "eBLI15_yY1Q:APA91bHD300cQgtGqb2987AFvWBWiJUrtlc_0KCEjvT1pJ7rki31rmgweymrcvfEFBxrG6LDR2BFkQhpMRbwlfPz34PW9Y3QIDA2-dc5KEg5XCfx0079TuL5SYPBdhoQNfQX8RgkgFOO";

const ERR_CODE_DB_GET_TOKEN_FOR_ORIGIN = 'ERR_CODE_DB_GET_TOKEN_FOR_ORIGIN'
const ERR_CODE_NO_TOKEN_FOR_ORIGIN = 'ERR_CODE_NO_TOKEN_FOR_ORIGIN';

var monitorApi = new FCM(serverKey);
var fcm = new FCM(serverKey);

class FCMHelper {

  /*constructor() {
    console.log("FCMHelper initialized");
    fcm = new FCM(serverKey);
    monitorApi = new MonitorApi();

  }*/

  pushMessage(user_id){
    monitorApi.getUserToken(user_id, (error, mobToken) => {
      if (!error) {
        var message = {
          to: mobToken,
          notification: {
            title: 'MONITOR PUSH',
            body: 'MONITOR PUSH - some text'
          },
          data: {
            key_1: 'value_1',
            key_2: 'value_2'
          }
        };

        fcm.send(message, function (err, response) {
          if (err) {
            console.log("fcm.send: ERROR -> " + JSON.stringify(err))
          } else {
            console.log("fcm.send: SUCCESS -> ", JSON.stringify(response))
          }
        })

      } else {
        console.log("pushMessage: ERROR -> " + JSON.stringify(error))
      }
    });
  };
}
//new FCMHelper();



//var fcmHelper = new FCMHelper();
//fcmHelper.pushMessage();

module.exports = FCMHelper;

