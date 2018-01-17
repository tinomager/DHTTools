var sensor = require('node-dht-sensor');
var fs = require('fs');

var filename = '[YOURLOGFILE]';

function logData(){
	sensor.read(22, 17, function(err, temp, hum)
		{
			if(!err){
				var time = new Date().toUTCString();
				console.log(time + ' temp: ' + temp.toFixed(2) + '| hum: ' + hum.toFixed(2));
				var datastring = time + ',' + temp + ',' + hum + '\n';
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
}

logData();

setInterval(function(){
        logData(); 
    }, 10000);