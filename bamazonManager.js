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

function managerTasks() {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        type: "list",
        name: "task",
        message: "What do you want to do?",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Products"
        ]
      }
    ])
    .then(function(manager) {
      switch (manager.task) {
        case "View Product for Sale":
          showProducts();
          break;
        case "View Low Inventory":
          showLowInventory();
          break;
        case "Add to Inventory":
          addToInventory();
          break;
        case "Add New Products":
          addNewProduct();
          break;
        default:
          showProducts();
      }
    });
}
managerTasks();

function showProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.table(res);
  });
}

function showLowInventory() {
  connection.query(
    "SELECT * FROM products WHERE stock_quantity BETWEEN 0 AND 10",
    function(err, res) {
      if (err) throw err;
      console.table(res);
    }
  );
}
function addToInventory() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "itemID",
          type: "input",
          message:
            "What is the id of the item that you want to update its quantity"
        },
        {
          name: "amount",
          type: "input",
          message: "How many do you want to add"
        }
      ])
      .then(function(input) {
        //check the current stock
        var currentAmount = res.map(a => a.stock_quantity);
        var newAmount = parseInt(input.amount) + parseInt(currentAmount);
        console.log(newAmount);
        connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: newAmount
            },
            {
              item_id: input.itemID
            }
          ],
          function(err, res) {
            if (err) throw err;
            console.log("The product was updated successfully!");
            showProducts();
          }
        );
      });
  });
}

function addNewProduct() {
//   connection.query("SELECT * FROM products", function(err, res) {
//     if (err) throw err;
    inquirer
      .prompt([
        {
          name: "itemName",
          type: "input",
          message: "What is the name of the item?"
        },
        {
          name: "department",
          type: "input",
          message: "Which department does this item belong to?"
        },
        {
          name: "quantity",
          type: "input",
          message: "How many?"
        },
        {
          name: "price",
          type: "input",
          message: "How much do we want to sell for each?",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(function(answer) {
        connection.query(
          "INSERT INTO products SET ?",
          {
            product_name: answer.itemName,
            department_name: answer.department,
            stock_quantity: answer.quantity,
            price: answer.price
          },
          function(err, res) {
            if (err) throw err;
            console.table("The new product has been added successfully!");
            showProducts();
          }
        );
      });
    }
//   });
// }
