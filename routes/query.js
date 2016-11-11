/**
 * Created by Oscar Valdes on 10/26/16.
 */
var express = require('express'),
    mysql = require('mysql'),
    fs = require('fs'),
    router = express.Router(),
    ff = require('fluent-ffmpeg'),
    bodyParser = require('body-parser'),
    path = require('path'),
    moment = require('moment'),
    tableify = require('tableify'),
    tableName,
    sql;

var connection = mysql.createConnection({
    host: 'IP',
    user: 'root',
    password: 'password',
    database: 'DB'
});

connection.connect(function(err) {
    if (!err) {
        console.log('Database is connected ... ');
    } else {
        console.log('Error connecting database ... ');
    }
});

router.use(bodyParser.urlencoded({
    extended: true
}))

router.post('/', function(req, res, next) {

    // tableName = req.body.tName;
    // console.log(tableName);
    // console.log(req.body);
  sql = req.body.tName;
    console.log(sql);
    console.log(req.body);
    //tableName= req.query.tName;

      connection.query(sql, function(err, rows, fields) {
  //  connection.query('SELECT * FROM agdbmysql.' + '`' + tableName + '`', function(err, rows, fields) { //copy of periodic
        if (!err) {

            //***To render server-side***
            // var html = tableify({
            //     rows
            // });

            res.json(rows);
            //console.log(html); DO NOT LOG BIG DATA SETS!
            //res.send(html);

            // res.write(html);
            // res.end();
            //console.log(rows);

            // var json = JSON.stringify(rows);
            // fs.writeFile('/example.json', json, 'utf8');
            // res.end();


        } else {
            res.sendStatus(500);
            console.log('Error while performing Query.' + err);
        }

    });
});

module.exports = router;
