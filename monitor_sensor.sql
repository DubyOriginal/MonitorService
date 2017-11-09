SELECT * FROM monitor_db.monitor_data;
SELECT * FROM monitor_db.user_params;
SELECT * FROM monitor_db.device_params;
SELECT * FROM monitor_db.sensor_params;
SELECT * FROM monitor_db.screen_sensor;

SELECT CONVERT_TZ(NOW(), @@session.time_zone, '+02:00');
#readAllSensors
SELECT 
	monitor_data.id, 
	FROM_UNIXTIME(timestamp, '%d.%m.%Y. - %H:%i:%s') as rtimestamp, 
    timestamp, 
    user_id, 
    user_name,
    device_id,
    device_name,
    sensor_id,
    sensor_type,
    sensor_mid,
    sensor_address,
    sensor_name,
    sensor_value
FROM monitor_db.monitor_data
LEFT JOIN monitor_db.user_params ON monitor_db.monitor_data.user_id = monitor_db.user_params.id
LEFT JOIN monitor_db.device_params ON monitor_db.monitor_data.device_id = monitor_db.device_params.id
LEFT JOIN monitor_db.sensor_params ON monitor_db.monitor_data.sensor_id = monitor_db.sensor_params.id
ORDER BY monitor_data.timestamp DESC LIMIT 40;


#getSensorDataWithRange
#192.168.1.26:2200/getsensordatawithrange/104/1509883979.931/1509905579.931
SELECT 
	monitor_data.id, 
	FROM_UNIXTIME(timestamp, '%d.%m.%Y. - %H:%i:%s') as rtimestamp, 
    timestamp, 
    user_id, 
    user_name,
    device_id,
    device_name,
    sensor_id,
    sensor_type,
    sensor_mid,
    sensor_address,
    sensor_name,
    sensor_value
FROM monitor_db.monitor_data
LEFT JOIN monitor_db.user_params ON monitor_db.monitor_data.user_id = monitor_db.user_params.id
LEFT JOIN monitor_db.device_params ON monitor_db.monitor_data.device_id = monitor_db.device_params.id
LEFT JOIN monitor_db.sensor_params ON monitor_db.monitor_data.sensor_id = monitor_db.sensor_params.id
      WHERE sensor_id like 104
      AND ((timestamp >= 1508583979.931) AND (timestamp < 1508905579.931)) 
      ORDER BY monitor_data.timestamp DESC 
      LIMIT 100000;


# get Basement Screen Sensor Data
SELECT 
	monitor_data.sensor_id,
	FROM_UNIXTIME(timestamp, '%d.%m.%Y. - %H:%i:%s') as rtimestamp, 
    screen_sensor.screen_id,
    sensor_params.sensor_type,
    sensor_params.sensor_mid,
    sensor_params.sensor_name,
    monitor_data.sensor_value
FROM monitor_db.monitor_data
LEFT JOIN monitor_db.user_params ON monitor_db.monitor_data.user_id = monitor_db.user_params.id
LEFT JOIN monitor_db.device_params ON monitor_db.monitor_data.device_id = monitor_db.device_params.id
LEFT JOIN monitor_db.sensor_params ON monitor_db.monitor_data.sensor_id = monitor_db.sensor_params.id
LEFT JOIN monitor_db.screen_sensor ON monitor_db.monitor_data.sensor_id = monitor_db.screen_sensor.sensor_id
WHERE
	monitor_data.timestamp = (SELECT MAX(timestamp) FROM monitor_data);

# log specific sensor
SELECT 
	monitor_data.id, 
	FROM_UNIXTIME(timestamp, '%d.%m.%Y. - %H:%i:%s') as rtimestamp, 
    device_name,
    sensor_id,
    sensor_type,
    sensor_mid,
    sensor_name,
    sensor_value
FROM monitor_db.monitor_data
LEFT JOIN monitor_db.user_params ON monitor_db.monitor_data.user_id = monitor_db.user_params.id
LEFT JOIN monitor_db.device_params ON monitor_db.monitor_data.device_id = monitor_db.device_params.id
LEFT JOIN monitor_db.sensor_params ON monitor_db.monitor_data.sensor_id = monitor_db.sensor_params.id
WHERE sensor_id like '%104%'
ORDER BY monitor_data.timestamp ASC;


# get Latest Sensor Value
SELECT 
	monitor_data.id, 
	FROM_UNIXTIME(timestamp, '%d.%m.%Y. - %H:%i:%s') as rtimestamp, 
    device_name,
    sensor_id,
    sensor_type,
    sensor_mid,
    sensor_name,
    sensor_value
FROM monitor_db.monitor_data
LEFT JOIN monitor_db.user_params ON monitor_db.monitor_data.user_id = monitor_db.user_params.id
LEFT JOIN monitor_db.device_params ON monitor_db.monitor_data.device_id = monitor_db.device_params.id
LEFT JOIN monitor_db.sensor_params ON monitor_db.monitor_data.sensor_id = monitor_db.sensor_params.id
WHERE
	monitor_data.timestamp = (SELECT MAX(timestamp) FROM monitor_data where
	sensor_id like '%101%')
    AND sensor_id like '%101%';
    
SELECT MAX(timestamp) FROM monitor_data where sensor_id like '%101%';


# log specific user
SELECT 
	monitor_data.id, 
	FROM_UNIXTIME(timestamp, '%d.%m.%Y. - %H:%i:%s') as rtimestamp, 
	user_id, 
    user_name,
    device_name,
    sensor_id,
    sensor_type,
    sensor_mid,
    sensor_name,
    sensor_value
FROM monitor_db.monitor_data
LEFT JOIN monitor_db.user_params ON monitor_db.monitor_data.user_id = monitor_db.user_params.id
LEFT JOIN monitor_db.device_params ON monitor_db.monitor_data.device_id = monitor_db.device_params.id
LEFT JOIN monitor_db.sensor_params ON monitor_db.monitor_data.sensor_id = monitor_db.sensor_params.id
WHERE user_id like '%DY001%'
ORDER BY monitor_data.timestamp DESC;

#******************************************************************************

INSERT INTO monitor_data (id, timestamp, user_id, device_id, sensor_id, sensor_type, sensor_value) 
VALUES (null,'1505756983', 'DY001', '123456', '3563547', 'temp', '4433');

INSERT INTO user_params (id, user_name) 
VALUES ('DY001', 'duby');

INSERT INTO device_params (id, device_name) 
VALUES ('123456', 'uređaj 1');

INSERT INTO sensor_params (id, sensor_type, sensor_mid, sensor_name) 
VALUES ('3563547', 'temp', 'DS1820', 'dnevna soba');


######################################################################################################
######################################################################################################
SELECT * FROM monitor_db.monitor_data WHERE sensor_id = 104;

DELETE FROM monitor_db.monitor_data WHERE sensor_id = 104 AND sensor_value IS NULL;
