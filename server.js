var request = require('request');
// Database
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/NodeRestQ');

//encodeHTMLEntities - helper function
function encodeHTMLEntities(text) {
	var entities = [
		['amp', '&'],
		['quot', '"'],
		['apos', '\''],
		['lt', '<'],
		['gt', '>'],
	];
	for (var i=0; i < entities.length; i++) 
		text = text.replace(new RegExp(entities[i][1], 'g'), '&'+entities[i][0]+';');
	return text;
}

var homeBase = 'http://localhost:3000/jobs/';
var outputWaiting = 1; //when we don't do any work, tell them we're waiting
//GET THE NEXT JOB IN THE LIST...
function MainFn() {
//	console.log('Getting jobs...');
	request( homeBase + 'jobq', function(error, response,  data ) {
		var job = JSON.parse(data)[0];
		if (job) {
			outputWaiting = 1;
			//SCRAPE THE URL...
			var url = job.url;
			var jobId = job._id;
			if ( url.substr(0, 4) != 'http')
				url = "http://"+ url;

			console.log( "Retrieving Job "+ jobId +": "+ url +"..." );
			request( url, function(error, response, html) {
				if (!error){
					//SAVE THE HTNL TO THE DATABASE
					//console.log('...DONE. Waiting...');
					//console.log(html);
					job.html = encodeHTMLEntities(html);
					request({ url: (homeBase + jobId), method: 'PUT', json: job });
					//var sqlTxt = "UPDATE tbl_jobs SET html=\""+ html +"\" WHERE id="+ jobId;
					//db.query(sqlTxt);
				} else {
					console.log('Error: '+ error);
				}
			});
			
		} else {
			if (outputWaiting)
				console.log('No jobs left to perform. Waiting...');
			outputWaiting = 0;
		}
		setTimeout(MainFn, 3000);
	});
}

MainFn();