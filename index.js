const TailLib = require('tail').Tail;
const config = require("./config.json");

const tail = new TailLib(config.source);

let numberOfLines = 0;
tail.on("line", function(data) {
    numberOfLines++;
    console.log(data);
});

tail.on("error", function(error) {
    console.log('ERROR: ', error);
});
