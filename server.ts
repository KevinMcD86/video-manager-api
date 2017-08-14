var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var videosRoutes = require('./routes/videosRoutes');

var port = 3000;

var app = express();

//CORS middleware
app.use(function(req, res, next) {
    console.log("CORS: " + process.env.FRONT_END_CORS);
    res.header('Access-Control-Allow-Origin', process.env.FRONT_END_CORS);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
});

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Set Static Folder
app.use(express.static(path.join(__dirname, 'client')));

// Body Parser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api', videosRoutes);

app.listen(port, function(){
    console.log('Server started on port '+port);
});