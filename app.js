const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const app = express();
const { utilisateurs } = require("./models");
const port = 8080;

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "key18",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

function estConnecte(req, res, next) {
  if (req.session.utilisateurId) {
    next();
  } else {
    res.redirect("/connexion");
  }
}

function nonConnecte(req, res, next) {
  if (req.session.utilisateurId) {
    res.redirect("/dashboard");
  } else {
    next();
  }
}

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/inscription", nonConnecte, (req, res) => {
  res.render("inscription", { title: "Inscription - WealthWave" });
});

app.get("/users", async (req, res) => {
  const users = await utilisateurs.findAll();
  res.json(users);
});

app.post("/users", async (req, res) => {
  try {
    const { nom, prenom, email, password, terms } = req.body;
    const utilisateurExist = await utilisateurs.findOne({
      where: { email: email },
    });

    if (utilisateurExist) {
      return res.render("inscription", {
        title: "Inscription - WealthWave",
        error: "L'email et existe deja, essayer avec un autre",
        email,
        nom,
        prenom,
      });
    }

    if (nom.length < 3) {
      return res.render("inscription", {
        title: "Inscription - WealthWave",
        error: "La taille nom doit etre plus que 3 caractere",
        email,
        nom,
        prenom,
      });
    }

    if (prenom.length < 5) {
      return res.render("inscription", {
        title: "Inscription - WealthWave",
        error: "La taille prenom doit etre plus que 5 caractere",
        email,
        nom,
        prenom,
      });
    }

    if (password.length < 8) {
      return res.render("inscription", {
        title: "Inscription - WealthWave",
        error: "Le mot de passe doit contient 8 caracteres ou plus",
        email,
        nom,
        prenom,
      });
    }

    if (!terms) {
      return res.render("inscription", {
        title: "Inscription - WealthWave",
        error: "Acceptez les terms et les conditions d'utilisation",
        email,
        nom,
        prenom,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await utilisateurs.create({ nom, prenom, email, password: hashedPassword });

    return res.render("connexion", {
      title: "Connexion - WealthWave",
      message: "L'utilisateur et crée avec success",
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res.render("inscription", {
      title: "Inscription - WealthWave",
      error: "Une erreur s'est produite. Veuillez réessayer.",
    });
  }
});

app.get("/connexion", nonConnecte, (req, res) => {
  res.render("connexion", {
    title: "Connexion - WealthWave",
  });
});

app.post("/connexion", async (req, res) => {
  const { email, password } = req.body;

  if (email.length == 0) {
    return res.render("connexion", {
      title: "Connexion - WealthWave",
      error: "Saisez votre email",
      email,
    });
  }

  if (password.length == 0) {
    return res.render("connexion", {
      title: "Connexion - WealthWave",
      error: "Saisez votre mot de passe",
      email,
    });
  }

  const utilisateur = await utilisateurs.findOne({
    where: {
      email: email,
    },
  });

  if (utilisateur && (await bcrypt.compare(password, utilisateur.password))) {
    req.session.utilisateurId = utilisateur.id;
    req.session.email = utilisateur.email;
    return res.redirect("/dashboard");
  } else {
    res.render("connexion", {
      title: "Connexion - WealthWave",
      error: "l'email ou le mot de passe sont incorect",
      email,
    });
  }
});

app.get("/dashboard", estConnecte, async (req, res) => {
  const utilisateur = await utilisateurs.findByPk(req.session.utilisateurId);
  res.render("dashboard", { title: "Dashboard - WealthWave", utilisateur });
});

app.get('/deconnexion', (req, res) => {
    req.session.destroy();
    res.redirect('/connexion');
});

app.listen(port, () => {
  console.log("Server Connected");
});
