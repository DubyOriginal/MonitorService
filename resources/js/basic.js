/**
 * Created by dvrbancic on 11/10/2017.
 */
testFunction = function () {
  console.log("@@@@@@ - this is test function!");
}

//isEmptyObject({})); returns 'true'
isEmptyObject = function(object) {
  return (Object.keys(object).length === 0 && object.constructor === Object);
}

isEmptyObjectAngular = function(angular, object) {
  return angular.equals({}, object);
}