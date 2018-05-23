// server.js
// load the things we need
var express = require('express');
var app = express();
const bodyParser = require("body-parser");
var fs = require('fs');

var Gpio = require('onoff').Gpio;
var LEDstrip=[];
LEDstrip[0] = new Gpio(4, 'out');
LEDstrip[1] = new Gpio(14, 'out');
LEDstrip[2] = new Gpio(15, 'out');
LEDstrip[3] = new Gpio(17, 'out');
LEDstrip[4] = new Gpio(18, 'out');
LEDstrip[5] = new Gpio(27, 'out');
LEDstrip[6] = new Gpio(22, 'out');
LEDstrip[7] = new Gpio(23, 'out');
LEDstrip[8] = new Gpio(24, 'out');

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

app.post('/run',  function(req, res) {
    var result = Math.floor((Math.random() * 8) + 1);
    console.log(result);
    for(var number_of_rolls=0;number_of_rolls<10;number_of_rolls++){
        for(var index_roll=0;index_roll<9;index_roll++){
            allLEDoff();
            LEDstrip[index_roll].writeSync(1);
            sleep(50);
        }
    }
    var sleep_increment=10;
    for(var number_of_rolls=0;number_of_rolls<3;number_of_rolls++){
        for(var index_roll=0;index_roll<9;index_roll++){
            allLEDoff();
            LEDstrip[index_roll].writeSync(1);
            sleep(sleep_increment+50);
            sleep_increment+=10;
        }
    }
    for(var index_roll=0;index_roll<result;index_roll++){
        allLEDoff();
        LEDstrip[index_roll].writeSync(1);
        sleep(sleep_increment+50);
    }
});

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

function allLEDoff(){
    LEDstrip[0].writeSync(0);
    LEDstrip[1].writeSync(0);
    LEDstrip[2].writeSync(0);
    LEDstrip[3].writeSync(0);
    LEDstrip[4].writeSync(0);
    LEDstrip[5].writeSync(0);
    LEDstrip[6].writeSync(0);
    LEDstrip[7].writeSync(0);
    LEDstrip[8].writeSync(0);
}

function rollLED() { //function to start blinking
    allLEDoff();
    //console.log(index_roll);
    LEDstrip[index_roll].writeSync(1);
    if(index_roll<8){
        index_roll++;
    }
    else{
        index_roll=0;
    }
}

function endRoll() { //function to stop blinking
    console.log("stopped_interval");
    clearInterval(rollInterval); // Stop blink intervals
    //LED.writeSync(0); // Turn LED off
    LEDstrip[0].unexport();
    LEDstrip[1].unexport();
    LEDstrip[2].unexport();
    LEDstrip[3].unexport();
    LEDstrip[4].unexport();
    LEDstrip[5].unexport();
    LEDstrip[6].unexport();
    LEDstrip[7].unexport();
    LEDstrip[8].unexport();
}

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