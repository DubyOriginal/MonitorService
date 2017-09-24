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
 * ---------------------------------------------------------
 * Programmer setup:
 *    - Tools -> Board -> NodeMCU 1.0
 */
#include <ESP8266WiFi.h> 
#include <ArduinoJson.h>
#include <OneWire.h>
#include <DallasTemperature.h>

//CONST
const char* ssid     = "SkyNet";
const char* password = "adidasneo";
const char* serverUrl   = "192.168.1.53";
const char* user_id     = "DY001";
const char* device_id   = "123456";
const unsigned long HTTP_TIMEOUT = 10000;  // max respone time from server

//VARs
float   tempVal = 0 ;
StaticJsonBuffer<2000> jsonBuffer;           //Reserve memory space
JsonObject& root = jsonBuffer.createObject();
JsonArray& sensorsArr = root.createNestedArray("sensors");
//JsonObject& sensor = sensors.createNestedObject();

//OTHER
#define serial Serial
#define ONE_WIRE_BUS 2  // D4 -> gpio 2 
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature DS18B20(&oneWire);
WiFiClient client;

//******************************************************************************************************************************
void setup() {
  serial.begin(115200);
  while (!serial) {;}   //Initialize serial and wait for port to open:
  serial.println("");
  serial.println("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
  serial.println("ESP8266 WiFi - Monitoring sensors");
  delay(100);
  
  // Initialize the Temperature measurement library
  DS18B20.begin();

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
  root["user_id"] = user_id;
  root["device_id"] = device_id;
  //root["sensor_id"] = "3563547";
  //root["sensor_value"] = "9999";
  
  //addValues2Sensor("3563547", "1234");
  //addValues2Sensor("3563547", "5678");
  //addValues2Sensor("3563547", "3333");
  //addValues2Sensor("3563547", "4444");
  
  root.prettyPrintTo(Serial); //root.printTo(Serial); 


}

float readSensor(int index){    //DeviceAddress deviceAddress){
   /*
    float tempC = sensors.getTempC(deviceAddress);
   if (tempC <= -127.00) {
      serial.println("Error getting temperature  ");
   } else{
      serial.println("readSensor: " + String(tempC));
   }
    */
     
   float tempVal = DS18B20.getTempCByIndex(index);
   Serial.println("readSensor[" + String(index) + "] " + String(tempVal));
   return tempVal;
}

void readSensors(){
  int numOfSensors = DS18B20.getDeviceCount();
  serial.println("Getting temperatures for: " + String(numOfSensors) + " sensors");
  
  DS18B20.requestTemperatures(); 

  clearSensorsArr();
  
  for (int i=0; i < numOfSensors; i++){
    String sensValStr = String(readSensor(i));
    String sensID = "0220_" + String(i);
    addValues2Sensor(sensID, sensValStr);
  } 
}

void addValues2Sensor(String sensor_id, String sensor_value) {
  JsonObject& object = sensorsArr.createNestedObject();
  object["sensor_id"] = sensor_id;
  object["sensor_value"] = sensor_value;
}

void clearSensorsArr(){
 int sensorsArrLength = sensorsArr.measureLength() + 1;
 serial.println("------------------");
 root.prettyPrintTo(Serial);
 //root.remove(0);
  for (int i = 0; i <= sensorsArrLength; i++) {
    sensorsArr.remove(i);
    delay(100);
  }
  root.prettyPrintTo(Serial);
  serial.println("------------------");
  
  //serial.println("sensorsArr before cleaning: " + String(sensorsArrLength));
  //serial.println("sensorsArr after cleaning: " + String(sensorsArr.measureLength()));
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

  String postData = getStringFromJsonObject();
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

String getStringFromJsonObject(){
  //root -> JsonObject
  int rootLength = root.measureLength();
  char jsonChar[rootLength];
  //serial.println("rootLength " + String(rootLength));
  root.printTo((char*)jsonChar, rootLength + 1);
  String jsonString = jsonChar;
  return jsonString; 
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

  readSensors();  //after readings is complete value is stored to sensorsSrr
  
  if (connect(serverUrl, 2200)) {
    if (sendRequest(serverUrl, "/write") && skipResponseHeaders()) {
      readReponseContent();
    }
  }
  disconnect();
  wait();
}



/*
void loop() {
  //tempVal = readSensor();
  //  init WiFiClient
  //----------------------------------------------------------
  if (client.connect(serverUrl, 2200)) {
    client.println("POST /posts HTTP/1.1");
    client.println("Host: dubyoriginal.com");
    client.println("Cache-Control: no-cache");
    client.println("Content-Type: application/json");
    client.print("Content-Length: ");
    client.println(PostData.length());
    client.println();
    client.println(PostData);
    
    long interval = 2000;
    unsigned long currentMillis = millis(), previousMillis = millis();
    
    while(!client.available()){
      if( (currentMillis - previousMillis) > interval ){
    
        Serial.println("Timeout");
        blinkLed.detach();
        digitalWrite(2, LOW);
        client.stop();     
        return;
      }
      currentMillis = millis();
    }
    
    while (client.connected())
    {
      if ( client.available() )
      {
        char str=client.read();
       Serial.println(str);
      }      
    }
  }
}*/
