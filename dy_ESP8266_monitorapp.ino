/*
* ESP8266 WiFi - Monitoring sensors
 *   Created on: 17.09.2017
 *   by DubyOriginal
 *
 * ---------------------------------------------------------
 * -> Arduino ESP8266
 *
 * ---------------------------------------------------------
 * source: USB 5V
 *
  PINOUT (DHT11 left to right):
    1. Vcc
    2. Data (R > 1k  connect to VCC)
    3. not used
    4. GND
 * ---------------------------------------------------------
 * Programmer setup:
 *    - Tools -> Board -> NodeMCU 1.0
 */


#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include "DHT.h"
#include "BasicUtils.h"

//CONST
const char* ssid     = "SkyNet";
const char* password = "adidasneo";
const char* serverUrl   = "192.168.1.37";
const char* user_id     = "DY001";
const char* device_id   = "123456";
const unsigned long HTTP_TIMEOUT = 10000;  // max respone time from server
const int sensorNum = 4;

//STRUCT  {"sensor_id":"3563547","sensor_type":"temp","sensor_value":"22.22"}
//------------------------------------------------------------------------------------------------------------------
typedef struct{
     DeviceAddress sensor_id;
     String sensor_type;
     String sensor_value;
} TSensor;
TSensor sensorsArr[sensorNum];


//VARs

//OTHER
#define serial Serial
#define PIN_ONE_WIRE_BUS D4  // D4 -> gpio 2
OneWire oneWire(PIN_ONE_WIRE_BUS);
DallasTemperature DS18B20(&oneWire);

#define DHTTYPE DHT11       // DHT 11
#define PIN_DHT D3           // D1 -> gpio 5
DHT dht(PIN_DHT, DHTTYPE);  // Initialize DHT sensor.

WiFiClient client;

//******************************************************************************************************************************
void setup() {
  serial.begin(115200);
  while (!serial) {;}   //Initialize serial and wait for port to open:
  serial.println("");
  serial.println("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
  serial.println("ESP8266 WiFi - Monitoring sensors");
  delay(100);

  defineDeviceSensors();

  // Initialize measurement library
  DS18B20.begin();
  dht.begin();

  //init WiFi
  //----------------------------------------------------------
  WiFi.begin (ssid, password);
  while ( WiFi.status() != WL_CONNECTED ) {
    delay ( 500 );
    serial.print ( "." );
  }
  serial.println ("");
  serial.println ("Connected to " + String(ssid));
  serial.println("device IP address: " + String(WiFi.localIP()));


  //  test
  //----------------------------------------------------------

}

void defineDeviceSensors(){
    // add values to sensor:    sensor_id  |  sensor_type  |  sensor_value;
    //DeviceAddress -> typedef uint8_t DeviceAddress[8];
    sensorsArr[0] = (TSensor) {{0x28, 0x06, 0xfe, 0x5b, 0x05, 0x00, 0x00, 0xd1}, "temp", "-"};
    sensorsArr[1] = (TSensor) {{0x28, 0x29, 0xa0, 0x5b, 0x05, 0x00, 0x00, 0x74}, "temp", "-"};
    sensorsArr[2] = (TSensor) {{0x00, 0x00, 0x00, 0x00, 0x00, 0x11, 0x12, 0x13}, "temp", ""};
    sensorsArr[3] = (TSensor) {{0x00, 0x00, 0x00, 0x00, 0x00, 0x11, 0x12, 0x13}, "humi", ""};

}

String getStringFromDeviceAddress(DeviceAddress devAdr){
  //String result = String(devAdr[5], HEX) + "-" + String(devAdr[6], HEX) + "-" + String(devAdr[7], HEX);
  //String result = getFormatedStrFromHex8(&devAdr[5],1) + "-" + getFormatedStrFromHex8(&devAdr[6],1) + "-" + getFormatedStrFromHex8(&devAdr[7],1);
  String result = getFormatedStrFromHex8(devAdr, 8);
  return result;
}


float readSensorDHT11Temp(){
   float tempVal = dht.readTemperature();
   if (isnan(tempVal)) {
      serial.println("readSensorDHT11Temp - FAILED!");
   }else{
      serial.println("readSensorDHT11Temp " + String(tempVal));
   }
   return tempVal;
}

float readSensorDHT11Humidity(){
   float humVal = dht.readHumidity();
      if (isnan(humVal)) {
      serial.println("readSensorDHT11Humidity - FAILED!");
   }else{
      serial.println("readSensorDHT11Humidity " + String(humVal));
   }
   return humVal;
}

void calculateDHT11Vals(float rawTemp, float rawHum){
  // Computes temperature values in Celsius and Humidity
  float hic = dht.computeHeatIndex(rawTemp, rawHum, false);
  serial.println("calculateDHT11Vals -> " + String(hic));
}

float readSensorDS18ByIndex(int index){    //DeviceAddress deviceAddress){
   float tempVal = DS18B20.getTempCByIndex(index);
   Serial.println("readSensorDS18ByIndex[" + String(index) + "] " + String(tempVal));
   return tempVal;
}


float readSensorDS18ByDeviceAddress(DeviceAddress deviceAddress){
   float tempC = DS18B20.getTempC(deviceAddress);
   if (tempC <= -127.00) {
      serial.println("Error getting temperature  ");
   } else{
      serial.println("readSensorDS18ByDeviceAddress: " + String(tempC));
   }
   return tempC;
}


void readSensors(){
  serial.println("readSensors");
  DS18B20.requestTemperatures();

  // DS1820
  //-------------------------------------------------------------------------
  float sensVal0 = readSensorDS18ByDeviceAddress(sensorsArr[0].sensor_id);
  if (!isnan(sensVal0)){
    sensorsArr[0].sensor_value = String(sensVal0);
  }

  float sensVal1 = readSensorDS18ByDeviceAddress(sensorsArr[1].sensor_id);
  if (!isnan(sensVal1)){
    sensorsArr[1].sensor_value = String(sensVal1);
  }

  // DHT11
  //-------------------------------------------------------------------------
  float sensVal2 = readSensorDHT11Temp();
  if (!isnan(sensVal2)){
    sensorsArr[2].sensor_value = String(sensVal2);
  }

  float sensVal3 = readSensorDHT11Humidity();
  if (!isnan(sensVal3)){
    sensorsArr[3].sensor_value = String(sensVal3);
  }

}

// Open connection to the HTTP server
bool connect(const char* hostName, unsigned port) {
  serial.println("Connect to " + String(hostName));
  bool ok = client.connect(hostName, port);
  serial.println(ok ? "Connected" : "Connection Failed!");
  return ok;
}

// Send the HTTP GET request to the server
bool sendRequest(const char* host, const char* route) {
  serial.println("POST " + String(route));
  //String postData = "{\"user_id\" : \"DY001\", \"device_id\" : \"123456\", \"sensor_id\" : \"3563547\", \"sensor_value\" : \"6666\"}";
  //serial.println("postData " + String(postData));

  String postData = prepareJOSNStringFromSensorsArr();
  serial.println("postData " + String(postData));

  client.print("POST ");
  client.print(route);
  client.println(" HTTP/1.1");
  client.print("Host: ");
  client.println(host);
  client.println("Cache-Control: no-cache");
  client.println("Content-Type: application/json");
  client.print("Content-Length: ");
  client.println(postData.length());
  client.println();
  client.println(postData);

  return true;
}

String prepareJOSNStringFromSensorsArr(){
  String jsonStr = "{ \"user_id\" : \"" + String(user_id) + "\", \"device_id\" : \"" + String(device_id) + "\", ";
  jsonStr += "\"sensors\": [";

  serial.println("numOfSensors -> " + String(sensorNum));
  String sens = "";
  for (int i=0; i < sensorNum; i++){
    String sens_id = getStringFromDeviceAddress(sensorsArr[i].sensor_id);    //"FD14433";    //String(sensorsArr[i].sensor_id);
    sens = sens + "{\"sensor_id\":\"" + sens_id + "\",\"sensor_type\":\"" + String(sensorsArr[i].sensor_type) + "\",\"sensor_value\":\"" + String(sensorsArr[i].sensor_value) + "\"}";
    if (i < (sensorNum-1)){
      sens += ",";
    }
  }
  jsonStr += sens;
  jsonStr += "]";   //end of sens array
  jsonStr += "}";   //end of json object

  return jsonStr;
}


// Skip HTTP headers so that we are at the beginning of the response's body
bool skipResponseHeaders() {
  // HTTP headers end with an empty line
  char endOfHeaders[] = "\r\n\r\n";

  client.setTimeout(HTTP_TIMEOUT);
  bool ok = client.find(endOfHeaders);

  if (!ok) {
    Serial.println("No response or invalid response!");
  }

  return ok;
}

void readReponseContent() {
    // if there are incoming bytes available from the server, read them and print them:
  //while (client.available()) {
   // char response = client.read();
   // serial.println("server response: " + response);
  //}
}

// Close the connection with the HTTP server
void disconnect() {
  Serial.println("Disconnect");
  client.stop();
}

// Pause for a 1 minute
void wait() {
  Serial.println("Wait 10 seconds");
  delay(10000);
}

//******************************************************************************************************************************
void loop() {

  readSensors();  //after readings is complete value is stored in sensorsArr[TSensor]

  if (connect(serverUrl, 2200)) {
    if (sendRequest(serverUrl, "/write") && skipResponseHeaders()) {
      readReponseContent();
    }
  }
  disconnect();
  wait();
}



/*
{
  "user_id" : "DY001",
  "device_id" : "123456",
  "sensors" :
  [
    {"sensor_id":"28 06 fe 5b 05 00 00 d1","sensor_type":"temp","sensor_value":"21.12"},
    {"sensor_id":"28 29 a0 5b 05 00 00 74","sensor_type":"temp","sensor_value":"27.13"},
    {"sensor_id":"00 00 00 00 00 11 12 13","sensor_type":"temp","sensor_value":"18.00"},
    {"sensor_id":"00 00 00 00 00 11 12 13","sensor_type":"humi","sensor_value":"39.00"}
  ]
}
*/