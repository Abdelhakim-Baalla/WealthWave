const express = require("express");
const app = express();
const { utilisateurs } = require("./models");
const port = 8080;

app.use(express.json());
app.set('view engine', 'ejs');
app.set('view', './views');

app.get("/users", async (req, res) => {
  const users = await utilisateurs.findAll();
  res.json(users);
});

app.post("/users", async (req, res) => {
  const { nom, prenom, email, password } = req.body;
  const newUser = await utilisateurs.create({ nom, prenom, email, password });
  res.json(newUser);
});

app.listen(port, () => {
  console.log("Server Connected");
});