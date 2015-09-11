var express = require('express');
var router = express.Router();

/* GET joblist */
router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('/');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/* GET jobq - all the jobs with empty html */
router.get('/jobq', function(req, res) {
    var db = req.db;
    var collection = db.get('/');
    collection.find({html: ''},{},function(e,docs){
        res.json(docs);
    });
});

/* GET Job */
router.get('/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('/');
    var jobId = req.params.id;
    collection.findOne({_id: jobId}, function(e, result){
        if (e) return next(e);
		result.html = decodeHTMLEntities(result.html);
        res.json(result);
    });
});

/* POST Job */
router.post('/', function(req, res) {
    var db = req.db;
    var collection = db.get('/');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/* PUT (Update) Job */
router.put('/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('/');
    var setObj = { _id: req.params.id };
	var htmlTxt = req.body.html;
	if (!htmlTxt) htmlTxt = '(Empty Page)';
	var data = {$set: {html: htmlTxt} };
    collection.update(setObj, data, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/* DELETE Job */
router.delete('/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('/');
    var jobToDelete = req.params.id;
    collection.remove({ '_id' : jobToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

function decodeHTMLEntities(text) {
	var entities = [
		['amp', '&'],
		['quot', '"'],
		['apos', '\''],
		['lt', '<'],
		['gt', '>'],
	];

	for (var i=0; i < entities.length; i++) 
		text = text.replace(new RegExp('&'+entities[i][0]+';', 'g'), entities[i][1]);
	text = text.replace(new RegExp('&'+entities[0][0]+';', 'g'), entities[0][1]); //do &amp; again (not sure why it's not working in the loop)

	return text;
}

module.exports = router;
