const randomWords = require("random-words");
const fs = require("fs");

function write() {
  const word = randomWords();
  fs.appendFile("/tmp/words.log", word + "\n", function(err) {
    if (err) throw err;
    console.log("Wrote", word);
  });
  setTimeout(write, (Math.random() * 1000).toFixed(3));
}

write();
