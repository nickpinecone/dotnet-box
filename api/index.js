const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const { Schema, model } = mongoose;

mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.1");

const UserSchema = new Schema({
    username: String
});

const UserModel = model("User", UserSchema);

app.set('views', './views')
app.set("view engine", "ejs");

app.use(cors());

app.get("/newUser", (req, res) => {
    res.render("home.ejs", { message: "Hi from server" });
    UserModel.create({ username: "John" });
});

app.get("/test", (req, res) => {
    res.send("test ok");
});

app.listen(4000);