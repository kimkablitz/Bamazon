var confirm = require("inquirer-confirm");
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
confirm("Are you a patron at Bamazon").then(
  function confirmed() {
    console.log("Welcome to Bamazon, please look at our products below");
    showProducts();
    ask();
  },
  function cancelled() {
    console.log("Sorry, please sign up with us first!");
    connection.end();
  }
);

function showProducts() {
  // console.log("Selecting all products...\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.table(res);
    // connection.end();
  });
}

function ask() {
  inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "What is the ID of the product you are looking for?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      var id = answer.item;
      var askingAmount = answer.quantity;

      connection.query(
        "SELECT product_name,stock_quantity,price FROM products WHERE item_id =" +
          id,
        function(err, res) {
          if (err) throw err;
          var availability = res.map(a => a.stock_quantity);
          var cost = res.map(a => a.price);
          var remain = availability - askingAmount;
          var spend = askingAmount * cost;
          console.log(askingAmount);
          console.log("You product will cost: " + spend);

          if (askingAmount < availability) {
            connection.query(
              "UPDATE products SET stock_quantity = " +
                remain +
                " WHERE item_id = " +
                id,
              function(err, res) {
                if (err) throw err;
                console.log("Purchase successful!");

                showProducts();
              }
            );
          } else {
            console.log(
              "insufficient stock, please choose within our availability"
            );
          }
        }
      );
    });
}

