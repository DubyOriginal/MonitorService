SELECT * FROM monitor_db.monitor_sensor;
SELECT * FROM monitor_db.device_data;
SELECT * FROM monitor_db.user_data;
SELECT * FROM monitor_db.sensor_data;

SELECT CONVERT_TZ(NOW(), @@session.time_zone, '+02:00');
SELECT 
	monitor_sensor.id, 
	FROM_UNIXTIME(timestamp, '%d.%m.%Y. - %H:%i:%s') as rtimestamp, 
    timestamp, 
    user_id, 
    user_name,
    device_id,
    device_name,
    sensor_id,
    sensor_type,
    sensor_mid,
    sensor_name,
    sensor_value
FROM monitor_db.monitor_sensor
LEFT JOIN monitor_db.user_data ON monitor_db.monitor_sensor.user_id = monitor_db.user_data.id
LEFT JOIN monitor_db.device_data ON monitor_db.monitor_sensor.device_id = monitor_db.device_data.id
LEFT JOIN monitor_db.sensor_data ON monitor_db.monitor_sensor.sensor_id = monitor_db.sensor_data.id
ORDER BY monitor_sensor.timestamp DESC;


# log specific sensor
SELECT 
	monitor_sensor.id, 
	FROM_UNIXTIME(timestamp, '%d.%m.%Y. - %H:%i:%s') as rtimestamp, 
    device_name,
    sensor_id,
    sensor_type,
    sensor_mid,
    sensor_name,
    sensor_value
FROM monitor_db.monitor_sensor
LEFT JOIN monitor_db.user_data ON monitor_db.monitor_sensor.user_id = monitor_db.user_data.id
LEFT JOIN monitor_db.device_data ON monitor_db.monitor_sensor.device_id = monitor_db.device_data.id
LEFT JOIN monitor_db.sensor_data ON monitor_db.monitor_sensor.sensor_id = monitor_db.sensor_data.id
WHERE sensor_id like '%00 00 00 00 00 11 12 13%' AND sensor_type like '%humi%'
ORDER BY monitor_sensor.timestamp DESC;

#******************************************************************************

INSERT INTO monitor_sensor (id, timestamp, user_id, device_id, sensor_id, sensor_type, sensor_value) 
VALUES (null,'1505756983', 'DY001', '123456', '3563547', 'temp', '4433');

INSERT INTO user_data (id, user_name) 
VALUES ('DY001', 'duby');

INSERT INTO device_data (id, device_name) 
VALUES ('123456', 'uređaj 1');

INSERT INTO sensor_data (id, sensor_type, sensor_mid, sensor_name) 
VALUES ('3563547', 'temp', 'DS1820', 'dnevna soba');