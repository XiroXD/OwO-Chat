import * as dotenv from "dotenv";
dotenv.config();

import chalk from "chalk";
import { Server } from "socket.io";
import { connect as mongoConnect, model, Schema } from "mongoose";

// Mongo
await mongoConnect(process.env.MONGO_URI).then(() => {
  console.log(chalk.bgGreenBright("Connected to mongodb"));
});

const UserSchema = new Schema({
  _id: String,

  username: String,

  muted: Boolean,
});

const User = model("User", UserSchema);

// delete all users on startup
await User.deleteMany({});

// Socket
const io = new Server(3000, {
  cors: {
    origin: "*",
  },
  pingInterval: 1000,
  pingTimeout: 2000,
});

let connectedUsers = 0;

io.use(async (socket, next) => {
  const { username } = socket.handshake.auth;
  const regex = new RegExp(/^\w+$/);

  const user = await User.findOne({
    username: { $regex: new RegExp(username, "i") },
  });

  if (!username) {
    next(new Error("Pwease pick an uwsewname >:("));
    return socket.disconnect(true);
  }

  if (!regex.test(username)) {
    next(new Error("Inyvawid usewnyame ¯\\_(ツ)_/¯"));
    return socket.disconnect(true);
  }

  if (user) {
    next(new Error("This uwsewname is awweady taken :<"));
    return socket.disconnect(true);
  }

  next();
});

io.on("connection", async (socket) => {
  const { id } = socket;

  await User.create({
    _id: id,
    username: socket.handshake.auth.username,
    muted: false,
  });

  connectedUsers++;

  socket.emit(
    "recieve_message",
    chalk.bgGreen.bold("Conynyected to OwO Chat!")
  );

  socket.emit(
    "recieve_message",
    chalk.magentaBright.bold(`
   OOOOO              OOOOO      CCCCC  hh              tt    
  OO   OO ww      ww OO   OO    CC    C hh        aa aa tt    
  OO   OO ww      ww OO   OO    CC      hhhhhh   aa aaa tttt  
  OO   OO  ww ww ww  OO   OO    CC    C hh   hh aa  aaa tt    
   OOOO0    ww  ww    OOOO0      CCCCC  hh   hh  aaa aa  tttt 
                                                              
  `)
  );

  socket.broadcast.emit(
    "user_joined",
    chalk.cyan.bold(
      `${chalk.green.bold("[IRC]")} OwO!! ${
        socket.handshake.auth.username
      } Joinyed! yayy`
    )
  );

  console.log(
    chalk.bgCyan.bold(`${socket.handshake.auth.username} Joined the chat`)
  );

  socket.on("send_message", async (message) => {
    const user = await User.findById(socket.id);

    if (!user) {
      return socket.disconnect(1);
    }

    if (user.muted) {
      socket.emit(
        "recieve_message",
        chalk.bgRed("Oopsie, it wooks wike you got muted ;<")
      );
      return;
    }

    io.emit(
      "recieve_message",
      `${chalk.bold(user.username)}:  ${chalk.green(message)}`
    );
  });

  socket.on("disconnect", async () => {
    connectedUsers--;

    await User.findByIdAndDelete(socket.id);

    socket.broadcast.emit(
      "user_left",
      chalk.blue(
        `${chalk.green.bold("[IRC]")} ${chalk.blue(
          `QwQ ${socket.handshake.auth.username} Left :<`
        )}`
      )
    );
  });
});

function isEmptyMessage(message) {
  const regex = /^\s*$/;
  return regex.test(message);
}
