const express = require("express");
const fs = require('fs');
const path = require("path");
const bodyParser = require("body-parser");
const portNum = 5000;

const app = express();
app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));

const file = process.argv[2].toString();
const info = fs.readFileSync(file, 'utf-8');
const data = JSON.parse(info);
const itemsList = data.itemsList;

const prompt = "Type itemsList or stop to shutdown the server: ";
console.log(`Web Server started and running at http://localhost:${portNum}`);
process.stdout.write(prompt);

process.stdin.setEncoding("utf8");
process.stdin.on('readable', () => {
    let inputCmd = process.stdin.read();
    if (inputCmd !== null) {
        let cmd = inputCmd.trim();
        switch (cmd) {
            case "stop":
                console.log("Shutting down the server");
                process.exit(0);
                break;
            case "itemsList":
                console.log(itemsList);
                break;
            default:
                console.log(`Invalid command: ${cmd}`);
                break;
        }
        process.stdout.write(prompt);
        process.stdin.resume();
    }
});

app.get("/", (request, response) => { 
    response.render("index"); 
});

app.get("/catalog", (request, response) => {
    response.render("displayItems", { itemsTable: createTable(itemsList) });
});

app.get("/order", (request, response) => {
    response.render("placeOrder", { items: createSelect(itemsList) });
});

app.post("/order", (request, response) => { 
    response.render("orderConfirmation", {
        name: request.body.name,
        email: request.body.email,
        delivery: request.body.delivery,
        orderTable: createTotal(request.body.itemsSelected, itemsList)
    });
});


app.listen(portNum);


function createTable(list) {
    let html = "<table border='1'><tr><th>Item</th><th>Cost</th></tr>";
    list.forEach(element => {
        html += `<tr><td>${element.name}</td><td>${element.cost}</td></tr>`;
    });
    return html + "</table>";
}

function createSelect(list) {
    return list.map(element => `<option value="${element.name}">${element.name}</option>`).join('');
}

function createTotal(selected, list) {
    let html = "<table border='1'><tr><th>Item</th><th>Cost</th></tr>";
    let total = 0;
    String(selected).split(",").forEach(name => {
        const found = list.find(item => item.name === name);
        if (found) {
            total += Number(found.cost);
            html += `<tr><td>${found.name}</td><td>${found.cost}</td></tr>`;
        }
    });
    html += `<tr><td>Total Cost:</td><td>${total}</td></tr>`;
    return html + "</table>";
}
