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

// add recipes page
app.get('/add', function(req, res) {
    res.render('pages/add');
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

// all recipes page
app.get('/show_all', function(req, res) {
    res.render('pages/show_all');
});

function inArray(elem,array_to_check){
    var count=array_to_check.length;
    for(var i=0;i<count;i++){
        if(array_to_check[i]===elem){return true;}
    }
    return false;
}

app.post('/search_result', function(req, res) {
    var checked_ingredients_json = req.body;
    //console.log(checked_ingredients_json)
    checked_ingredients_array=[];
    for(var ingredient in checked_ingredients_json){
        checked_ingredients_array.push(ingredient);
    }
    //console.log(checked_ingredients_array)

    var recipes_to_send = {}
    var fs = require('fs');
    fs.readFile('recipes.json', 'utf8', function (err, data) {
        if (err) throw err;
        var recipes_list = JSON.parse(data);
        for (var recipe in recipes_list) {
            var recipe_valid = true;
            for (var i = 0; i < recipes_list[recipe]["ingredients"].length; i++) {
                if (!inArray(recipes_list[recipe]["ingredients"][i], checked_ingredients_array)) {
                    recipe_valid = false
                }
            }
            if (recipe_valid) {
                recipes_to_send[recipe]={"recipe_link": recipes_list[recipe]["recipe_link"]}
            }
        }
        //var myJSON = JSON.stringify(recipes_to_send);
        //console.log(recipes_to_send);
        res.json(recipes_to_send);
        //res.render('pages/search_result');
    });
});

// add recipes page
app.post('/add', function(req, res) {
    var data = req.body;
    var new_recipe_name = data.recipe_name;
    var new_recipe_link = data.recipe_link;
    var new_recipe_ingredients = [];
    for(var key in data){
        if(key != "recipe_name" && key != "recipe_link"){
            new_recipe_ingredients.push(key);
        }
    }

    var fs = require('fs');
    var recipes;
    fs.readFile('recipes.json', 'utf8', function (err, data) {
        if (err) throw err;
        recipes = JSON.parse(data);

        recipes[new_recipe_name] = {"recipe_link": new_recipe_link, "ingredients": new_recipe_ingredients}
        var myJSON = JSON.stringify(recipes);

        fs.writeFile("recipes.json", myJSON, function(err) {
            if (err) {
                console.log(err);
            }
        });

        //console.log(recipes);
    });
});

app.listen(3000);
console.log('listening on port 3000');