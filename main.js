// server.js
// load the things we need
var express = require('express');
var app = express();
const bodyParser = require("body-parser");
var fs = require('fs');

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// index page
app.get('/', function(req, res) {
    res.render('pages/index');
});

app.get('/data.json', function(req, res) {
    var item_data;
    fs.readFile('data.json', 'utf8', function (err, data) {
        if (err) throw err;
        item_data = JSON.parse(data);
        res.json(item_data);
    });
});
app.get('/configuration.json', function(req, res) {
    var config_data;
    fs.readFile('configuration.json', 'utf8', function (err, data) {
        if (err) throw err;
        config_data = JSON.parse(data);
        res.json(config_data);
    });
});

function inArray(elem,array_to_check){
    var count=array_to_check.length;
    for(var i=0;i<count;i++){
        if(array_to_check[i]===elem){return true;}
    }
    return false;
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// add recipes page
app.post('/update_items_and_colors', function(req, res) {
    var data = req.body;
    var spinning_color = data.spinning_color;
    var prize_color = data.prize_color;
    var stock = {};
    var colors = {};
    var i=1;
    for(var key in data){
        if(key.includes("stock")){
            stock[i]=data[key];
        }
        i++;
    }
    colors["rgb_spinning"]={"r":""+hexToRgb(spinning_color).r,"g":""+hexToRgb(spinning_color).g,"b":""+hexToRgb(spinning_color).b};
    colors["rgb_prize"]={"r":""+hexToRgb(prize_color).r,"g":""+hexToRgb(prize_color).g,"b":""+hexToRgb(prize_color).b};

    var fs = require('fs');
    var myJSON = JSON.stringify(stock);
    fs.writeFile("data.json", myJSON, function(err) {
        if (err) {
            console.log(err);
        }
    });
    var myJSON = JSON.stringify(colors);
    fs.writeFile("configuration.json", myJSON, function(err) {
        if (err) {
            console.log(err);
        }
    });
});

app.listen(3000);
console.log('listening on port 3000');