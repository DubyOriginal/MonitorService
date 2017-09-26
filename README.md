# MonitorService

**http://localhost:2200**

## Route From Device:
> POST http://localhost:2200/storedevicedata
```    {
      "user_id" : "DY001", 
      "device_id" : "123456", 
      "sensors" : 
      [
        {"sensor_id":"11 33 55 77","sensor_type":"temp","sensor_value":"22.22"},
        {"sensor_id":"11 33 55 77","sensor_type":"hum","sensor_value":"60"}
      ] 
    }
```

## Route From WEB:
-  GET  [http://localhost:2200/getallsensorsdata]
-  GET  [http://localhost:2200/getsensordata/:sensor_id]
-  GET  [http://localhost:2200/getuseridsensordata/:user_id]