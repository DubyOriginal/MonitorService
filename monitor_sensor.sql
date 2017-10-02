SELECT * FROM monitor_db.monitor_data;
SELECT * FROM monitor_db.user_params;
SELECT * FROM monitor_db.device_params;
SELECT * FROM monitor_db.sensor_params;

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
ORDER BY monitor_data.timestamp DESC;


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
WHERE sensor_id like '%00 00 00 00 00 11 12 13%' AND sensor_type like '%humi%'
ORDER BY monitor_data.timestamp DESC;


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
	sensor_id like '%11 33 55 77%' AND sensor_type like '%humi%')
    AND sensor_id like '%11 33 55 77%' AND sensor_type like '%humi%';
    
SELECT MAX(timestamp) FROM monitor_data 
where sensor_id like '%00 00 00 00 00 11 12 13%' 
	AND sensor_type like '%humi%';

SELECT ord_num, ord_amount, ord_date, agent_code
FROM orders
WHERE monitor_data.timestamp = (
SELECT MAX(timestamp) FROM monitor_data WHERE agent_code='A002');

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