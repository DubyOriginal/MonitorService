/**
 * Created by dvrbancic on 11/10/2017.
 */
testFunction = function () {
  console.log("@@@@@@ - this is test function!");
}

//isEmptyObject({})); returns 'true'
//isEmptyObject = function(object) {
  //console.log("isEmptyObject -> object: " + JSON.stringify(object));
  //let conditionA = Object.keys(object).length === 0;
  //let conditionB = object.constructor === Object;
  //let conditionC = typeof object === "undefined";
  //let conditionC = object === null;
  //console.log("isEmptyObject -> " + conditionC);
  //return (conditionC);
//}

// Speed up calls to hasOwnProperty
var hasOwnProperty = Object.prototype.hasOwnProperty;
isEmptyObject = function(obj) {
  // null and undefined are "empty"
  if (obj == null) return true;

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0)    return false;
  if (obj.length === 0)  return true;

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (typeof obj !== "object") return true;

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }

  return true;
}

