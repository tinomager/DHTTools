var sensor = require('node-dht-sensor');
var fs = require('fs');

var filename = '[YOURFILENAME]';

sensor.read(22, 17, function(err, temp, hum)
	{
		if(!err){
			console.log('temp: ' + temp.toFixed(2) + '| hum: ' + hum.toFixed(2));
			var datastring = new Date().toUTCString() + ',' + temp + ',' + hum;
			fs.appendFile(filename, datastring, function (err) {
		  		if (err) {
					console.log('could not save data to file' + err);
				}
		  		console.log('Saved data to file!');				
			});
		}
		else{
			console.log('error reading values');
		}
	});