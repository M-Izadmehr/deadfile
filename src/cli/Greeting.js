const chalk = require("chalk");
const boxen = require("boxen");

class Greeting {
  print() {
    const greeting = `${chalk.white.bold("Dead File!")}

Simply find the unused files in your javascript project.
Press --help for help.`;

    const boxenOptions = {
      padding: 1,
      margin: 1,
      align: "center",
      borderStyle: "round",
      borderColor: "green",
      backgroundColor: "#555555",
    };
    const msgBox = boxen(greeting, boxenOptions);

    console.log(msgBox);
  }

  printHelp() {}
}

module.exports = Greeting;
