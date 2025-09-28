require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { generateSecureToken } = require("n-digit-token");
const app = express();
const { utilisateurs } = require("./models");
const { motDePasseRestorationTokens } = require("./models");
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
    cookie: {
      secure: false,
      maxAge: 3600000,
    },
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

app.get("/deconnexion", (req, res) => {
  req.session.destroy();
  res.redirect("/connexion");
});

app.get("/profile", estConnecte, async (req, res) => {
  const utilisateur = await utilisateurs.findByPk(req.session.utilisateurId);
  // console.log(utilisateur);
  res.render("profile", {
    utilisateur: utilisateur,
  });
});

app.post("/profile", estConnecte, async (req, res) => {
  try {
    const utilisateur = await utilisateurs.findByPk(req.session.utilisateurId);
    const { nom, prenom, email, devise } = req.body;

    await utilisateur.update({
      nom: nom,
      prenom: prenom,
      email: email,
      devise: devise,
    });

    req.session.email = email;

    res.render("profile", {
      utilisateur: await utilisateurs.findByPk(req.session.utilisateurId),
      message: "Profile mis à jour avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    res.render("profile", {
      utilisateur: await utilisateurs.findByPk(req.session.utilisateurId),
      error:
        "Une erreur s'est produite lors de la mise à jour. Veuillez réessayer.",
    });
  }
});

app.get("/motdepasseoublie", nonConnecte, (req, res) => {
  res.render("motdepasseoublie");
});

app.post("/motdepasseoublie", nonConnecte, async (req, res) => {
  const { email } = req.body;
  const emailExist = await utilisateurs.findOne({
    where: {
      email: email,
    },
  });

  if (emailExist) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const token = generateSecureToken(10);
    const tokenHasher = await bcrypt.hash(token, 10);
    const dateExpirationDeToken = Date.now() + 60000;

    await motDePasseRestorationTokens.create({
      utilisateur: emailExist.id,
      token: tokenHasher,
      date_expiration: dateExpirationDeToken,
    });

    const restorationLien = `${
      process.env.APP_URL
    }/restorer-mot-de-passe?token=${tokenHasher}&email=${encodeURIComponent(
      email
    )}`;

    async function envoyerEmail() {
      try {
        let info = await transporter.sendMail({
          from: '"WealthWave Team" <process.env.SMTP_USER>',
          to: email,
          subject: "Réinisialiser Votre mot de passe",
          text: `Vous avez demandé une réinitialisation de mot de passe.\nCliquez ici : ${restorationLien}\nCe lien expire dans 1 minute.`,
          html: `<p>Vous avez demandé une réinitialisation de mot de passe.</p><p> cliquez ici : <a href="${restorationLien}">Réinitialiser le mot de passe</a></p><p>Ce lien expire dans 1 minute.</p>`,
        });
      } catch (error) {
        console.error("Problème et servenu: ", error);
      }
    }
    envoyerEmail();

    res.render("emailEnvoieSuccess");
  } else {
    res.render("motdepasseoublie", {
      error: "l'email que vous entrer et incorrect",
    });
  }
});

app.get("/restorer-mot-de-passe", nonConnecte, (req, res) => {
  const { token, email } = req.query;
  const newEmail = encodeURIComponent(email);
  res.render('restorationDeMotDePasse', {
    token,
    newEmail
  });
});

app.use((req, res, next) => {
  res.status(404).render("404");
});

app.listen(port, () => {
  console.log("Server Connected");
});
