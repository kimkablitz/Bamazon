var confirm = require('inquirer-confirm');
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazonDB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
});

//Step 1:  validate and greet the customer
confirm('Are you a patron at Bamazon')
.then(function confirmed(){
  console.log("Welcome to Bamazon, please look at our products below");
  showProducts();
  ask();
}, function cancelled(){
  console.log("Sorry, please sign up with us first!");
  connection.end();
})


function showProducts() {
  // console.log("Selecting all products...\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.table(res);
    // connection.end();
  });
}


function ask(){
  inquirer
  .prompt([
    {
      name:"item",
      type:"input",
      message: "What is the ID of the product you are looking for?",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    },
    {
      name:'quantity',
      type:'input',
      message:'How many would you like?',
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    }
  ]).then(function(answer){
    var id = answer.item;
    var askingAmount = answer.quantity;
    

  
    connection.query("SELECT product_name,stock_quantity,price FROM products WHERE item_id =" + id, function(err,res){
      if (err) throw err;
      var availability =res.map(a => a.stock_quantity);
      var cost = res.map(a => a.price);
      var remain = availability - askingAmount;
      var spend = askingAmount*cost;
      console.log(askingAmount);
      console.log("You product will cost: " + spend);

      if (askingAmount < availability){
        
      connection.query("UPDATE products SET stock_quantity = "+remain+ " WHERE item_id = " + id,function(err,res){
        if (err) throw err;
        console.log("Purchase successful!")
        
        showProducts();
      })
      }
      
      else{
        console.log('insufficient stock, please choose within our availability');
      }
    });

   
  })
}






//     UPDATE CUSTOMERS
// SET ADDRESS = 'Pune'
// WHERE ID = 6


// connection.end();
//if that is true, tell them to enter the id of the product they search for
//once they entered the id, show the product to them and ask how many they want, there are are 3left for example
//if they choose a number greater than availability, console.log("out of stock"), there are only "..."
//if they choose a proper amount, update table with the quantity - customers input
//show the cost of the product = item price * customer amount input


// function runSearch() {
//   inquirer
//     .prompt({
//       name: "action",
//       type: "list",
//       message: "What would you like to do?",
//       choices: [
//         "Find songs by artist",
//         "Find all artists who appear more than once",
//         "Find data within a specific range",
//         "Search for a specific song"
//       ]
//     })
//     .then(function(answer) {
//       switch (answer.action) {
//       case "Find songs by artist":
//         artistSearch();
//         break;

//       case "Find all artists who appear more than once":
//         multiSearch();
//         break;

//       case "Find data within a specific range":
//         rangeSearch();
//         break;

//       case "Search for a specific song":
//         songSearch();
//         break;
//       }
//     });
// }

// function artistSearch() {
//   inquirer
//     .prompt({
//       name: "artist",
//       type: "input",
//       message: "What artist would you like to search for?"
//     })
//     .then(function(answer) {
//       var query = "SELECT position, song, year FROM top5000 WHERE ?";
//       connection.query(query, { artist: answer.artist }, function(err, res) {
//         // for (var i = 0; i < res.length; i++) {
//         //   console.log("Position: " + res[i].position + " || Song: " + res[i].song + " || Year: " + res[i].year);
//         // }
//         console.table(res)
//         // runSearch();
//       });
//     });
// }

// function multiSearch() {
//   var query = "SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1";
//   connection.query(query, function(err, res) {
//     for (var i = 0; i < res.length; i++) {
//       console.log(res[i].artist);
//     }
//     runSearch();
//   });
// }

// function rangeSearch() {
//   inquirer
//     .prompt([
//       {
//         name: "start",
//         type: "input",
//         message: "Enter starting position: ",
//         validate: function(value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         }
//       },
//       {
//         name: "end",
//         type: "input",
//         message: "Enter ending position: ",
//         validate: function(value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         }
//       }
//     ])
//     .then(function(answer) {
//       var query = "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
//       connection.query(query, [answer.start, answer.end], function(err, res) {
//         for (var i = 0; i < res.length; i++) {
//           console.log(
//             "Position: " +
//               res[i].position +
//               " || Song: " +
//               res[i].song +
//               " || Artist: " +
//               res[i].artist +
//               " || Year: " +
//               res[i].year
//           );
//         }
//         runSearch();
//       });
//     });
// }

// function songSearch() {
//   inquirer
//     .prompt({
//       name: "song",
//       type: "input",
//       message: "What song would you like to look for?"
//     })
//     .then(function(answer) {
//       console.log(answer.song);
//       connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function(err, res) {
//         console.log(
//           "Position: " +
//             res[0].position +
//             " || Song: " +
//             res[0].song +
//             " || Artist: " +
//             res[0].artist +
//             " || Year: " +
//             res[0].year
//         );
//         runSearch();
//       });
//     });
// }