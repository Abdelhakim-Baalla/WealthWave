const express = require("express");
const app = express();
const { utilisateurs } = require("./models");
const port = 8080;


app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/inscription', (req, res) => {
    res.render('inscription', { title: 'Inscription - WealthWave' });
});

app.get("/users", async (req, res) => {
  const users = await utilisateurs.findAll();
  res.json(users);
});

app.post("/users", async (req, res) => {
//   res.send(req.body);
  const { nom, prenom, email, password } = req.body;
  const newUser = await utilisateurs.create({ nom, prenom, email, password });
  res.json(newUser);
});

app.listen(port, () => {
  console.log("Server Connected");
});