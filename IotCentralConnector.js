'use strict';

var clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;
var Message = require('azure-iot-device').Message;
var sensor = require('node-dht-sensor');
var fs = require('fs');

var connectionString = '[IOTHUBCONNECTIONSTRING]';
var deviceId = '[DEVICEID]'
var logfile = '[YOURLOGFILEPATH]';
var gpiopin = 17;


var client = clientFromConnectionString(connectionString);
console.log('Try to connect to IoTHub ... ');
var sendData = [];

function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}

function saveSendDataToFile(){
	var datastring = '';
	for (var i = 0, len = sendData.length; i < len; i++) {
  		datastring += sendData[i].deviceId + ',' + sendData[i].temp + ',' + sendData[i].hum + ',' + sendData[i].sendtime + '\n';
	}
	fs.appendFile(logfile, datastring, function (err) {
  		if (err) {
			console.log('could not save data to file' + err);
		}
  		console.log('Saved send data to file!');
		sendData.length = 0;
	});
}

function sendTemperature(){
	sensor.read(22, gpiopin, function(err, temp, hum)
	{
		if(!err){
			console.log('temp: ' + temp.toFixed(2) + '| hum: ' + hum.toFixed(2));
			var dataobject = { deviceId: deviceId, temp: temp, hum: hum };
			var data = JSON.stringify(dataobject);
        		var message = new Message(data);
        		console.log("Sending message: " + message.getData());
        		client.sendEvent(message, printResultFor('send'));
			dataobject.sendtime = new Date().toUTCString();
			sendData.push(dataobject); 
		}
		else{
			console.log('error reading values');
		}
	});
}

var connectCallback = function (err) {
  if (err) {
    console.log('Could not connect: ' + err);
  } else {
    console.log('Client connected');

    // Create a message and send it to the IoT Hub every 10 seconds
    setInterval(function(){
        sendTemperature(); 
    }, 10000);

    //save messages all 5 minutes
    setInterval(function(){
        saveSendDataToFile();
    }, 300000);
  }
};

client.open(connectCallback);