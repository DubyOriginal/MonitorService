/**
 * Created by dvrbancic on 01/11/2017.
 */

var configLive = require('config.json')('./config/live.json');
var configDevelop = require('config.json')('./config/develop.json');

//ENVIROMENT is setted in 'gulpfile.js' /

module.exports = function(){
  switch(process.env.NODE_ENV){
    case 'DEVELOP':
      return {configDevelop}.configDevelop;

    case 'LIVE':
      return {configLive}.configLive;

    default:
      return {configDevelop}.configDevelop;
  }
};