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
    connection;

connection = mysql.createConnection({
  host: 'soiltest',
  user: 'root',
  password: 'Blue$apph1re#2',
  database: 'agdbmysql'
});

connection.connect(function(err) {
  if (!err) {
    console.log('Database is connected ... ');
    console.log("NODE_ENV : ", process.env.NODE_ENV);
  } else {
    console.log('Error connecting database ... ');
  }
});

router.use(bodyParser.urlencoded({
  extended: true
}));

function fldValue(row, fld) {
  var val = row[fld.name];

  if(fld.type === 12) {  //datetime
    return moment(val).format('MM/DD/YYYY');
  } else if(val === null) {
    return '';
  } else {
    return val;
  }
} //fldValue

function json(rows, fields) {
  rows.forEach(function(row) {
    fields.forEach(function(fld) {
      row[fld.name] = fldValue(row, fld);
    });
  });

  return JSON.stringify(rows);
} //json

function text(rows, fields, fldnames, data) {
  var s = '';

  if(fldnames) {
    fields.forEach(function(fld) {  //field names
      s += fld.name + '|';
    });
    s += '\n';
  }

  if(data) {
    rows.forEach(function(row) {   //data
      fields.forEach(function(fld) {
        s += fldValue(row, fld) + '|';
      });
      s += '\n';
    });
  }

  return s;
} //text

function table(rows, fields, fldnames, data) {
  var s = '<table><tr>';

  if(fldnames) {
    fields.forEach(function(fld) {
      s += '<th>' + fld.name;
    });
  }

  if(data) {
    rows.forEach(function(row) {
      s += '<tr>';
      fields.forEach(function(fld) {
        s += '<td>' + fldValue(row, fld);
      });
    });
  }
  s += '</table>';

  return s;
} //table

router.post('/', function(req, res, next) {
  var sql = req.body.query,
      type = req.body.type || 'text'
      fldnames = req.body.fldnames || 'true',
      data = req.body.data || 'true';

  connection.query(sql, function(err, rows, fields) {
    if(!err) {
      if(type === 'json') {
        res.send(json(rows, fields));
      } else if(type === 'text') {
        res.send(text(rows, fields, fldnames, data));
      } else if(type === 'table') {
        res.send(table(rows, fields, fldnames, data));
      }
    } else if(/172.18.186/.test(req.connection.remoteAddress)) {
      res.status(500).send('Error while performing query:\n' + sql + '\n' + err);
    } else {
      res.end('<script>window.location.replace("http://aesl.ces.uga.edu");</script>');
    }
  }); //connection.query
}); //router.post

module.exports = router;
