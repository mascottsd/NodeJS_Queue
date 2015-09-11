var express = require('express');
var router = express.Router();

/* GET joblist */
router.get('/joblist', function(req, res) {
    var db = req.db;
    var collection = db.get('joblist');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/* GET Job */
router.get('/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('joblist');
    var jobId = req.params.id;
    collection.findOne({_id: jobId}, function(e, result){
        if (e) return next(e)
        res.send(result)
    });
});

/* POST Job */
router.post('/', function(req, res) {
    var db = req.db;
    var collection = db.get('joblist');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/* PUT (Update) Job */
router.put('/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('joblist');
    collection.update(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/* DELETE Job */
router.delete('/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('joblist');
    var jobToDelete = req.params.id;
    collection.remove({ '_id' : jobToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
