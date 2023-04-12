import * as dotenv from "dotenv"
dotenv.config()

import { io } from "socket.io-client";
import readline from "readline";
import inquirer from "inquirer";
import chalk from "chalk";

let username;

async function askName() {
  const answer = await inquirer.prompt({
    name: "username",
    type: "input",
    message: "Username",
  });

  username = answer.username;
}

await askName();

function getUserInput() {
  return new Promise((resolve) => {
    rl.question('> ', (answer) => {
      resolve(answer.trim());
    });
  });
}

const socket = io(process.env.WEBSOCKET_URL, {
  auth: {
    username,
  },
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let messages = "";

socket.on("connect", () => {
  messages = ""
  updateOutput();
});

socket.on("user_joined", (message) => {
  messages +=`${chalk.cyan.bold(message)}\n`
  updateOutput();
});

socket.on("user_left", (message) => {
  messages += `${message}\n`
  updateOutput();
})

socket.on("recieve_message", (message) => {
  messages += `${message}\n`;
  updateOutput();
});

socket.on("connect_error", (err) => {
  console.log(chalk.bgRed.white(err));
});

socket.io.on("reconnect_attempt", () => {
  console.log(chalk.green("Reconnecting..."));
});

while (true) {
  const message = await getUserInput();

  // send the message to the server
  socket.emit('send_message', message);
}

function updateOutput() {
  console.clear();
  readline.clearScreenDown(rl);
  console.log(messages);
  rl.prompt(true);
}
