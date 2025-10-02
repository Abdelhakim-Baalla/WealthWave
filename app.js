require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { generateSecureToken } = require("n-digit-token");
const { Sequelize, where } = require("sequelize");
const app = express();
const { utilisateurs, categories, transactions, budgets } = require("./models");
const { motDePasseRestorationTokens } = require("./models");
const { exportToCSV } = require("./exportationCSV");
// const { categories } = require("./models");
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
    }/restorer-mot-de-passe?token=${token}&email=${encodeURIComponent(email)}`;

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
  res.render("restorationDeMotDePasse", {
    token,
    newEmail,
  });
});

app.post("/restorer-mot-de-passe", nonConnecte, async (req, res) => {
  const { token, email } = req.query;
  const { newPassword } = req.body;
  const newEmail = encodeURIComponent(email);
  const utilisateurExist = await utilisateurs.findOne({
    where: { email: email },
  });

  if (utilisateurExist) {
    if (newPassword.length < 8) {
      return res.render("restorationDeMotDePasse", {
        error: "Le mot de passe doit contient 8 caracteres ou plus",
        token,
        newEmail,
      });
    }

    const restorationToken = await motDePasseRestorationTokens.findOne({
      where: {
        utilisateur: utilisateurExist.id,
        date_expiration: { [Sequelize.Op.gt]: Date.now() },
      },
    });

    if (!restorationToken) {
      return res.render("restorationDeMotDePasse", {
        error:
          "Le lien de réinitialisation a expiré ou est invalide. Veuillez demander un nouvel email.",
        token,
        newEmail,
        resend: true,
      });
    }

    const vraiToken = await bcrypt.compare(token, restorationToken.token);

    if (!vraiToken) {
      return res.render("restorationDeMotDePasse", {
        error:
          "Le token est invalide. Veuillez demander un nouvel email de réinitialisation.",
        token,
        newEmail,
        resend: true,
      });
    }

    utilisateurExist.password = await bcrypt.hash(newPassword, 10);
    await utilisateurExist.save();

    await motDePasseRestorationTokens.destroy({
      where: { id: restorationToken.id },
    });

    return res.redirect("/connexion");
  } else {
    return res.render("restorationDeMotDePasse", {
      error: "l'email que vous entrer et incorrect",
      token,
      newEmail,
    });
  }
});

app.get("/ajouter-transaction", estConnecte, async (req, res) => {
  const toutCategories = await categories.findAll({
    where: {
      utilisateur: req.session.utilisateurId,
    },
  });
  res.render("transactions/ajouter", {
    title: "WealthWave - Ajouter Transaction",
    toutCategories,
  });
});

app.post("/ajouter-transaction", estConnecte, async (req, res) => {
  const { type, prix, date, categorie, note } = req.body;
  const toutCategories = await categories.findAll({
    where: {
      utilisateur: req.session.utilisateurId,
    },
  });

  const catSelectionner = await categories.findOne({
    where: {
      id: categorie,
      utilisateur: req.session.utilisateurId,
    },
  });

  if (
    (type != "Revenu" && type != "Frais" && type != "Transfert") ||
    type == ""
  ) {
    return res.render("transactions/ajouter", {
      title: "WealthWave - Ajouter Transaction",
      error: "Il faut selectionnez just les type proposer",
      toutCategories,
    });
  }

  if (prix <= 0 || prix == "") {
    return res.render("transactions/ajouter", {
      title: "WealthWave - Ajouter Transaction",
      error: "Il faut selectionnez un prix positif",
      toutCategories,
    });
  }

  if (date == "") {
    return res.render("transactions/ajouter", {
      title: "WealthWave - Ajouter Transaction",
      error: "Saiser une Date",
      toutCategories,
    });
  }

  let categorieExist = false;
  let categorieId;
  for (let uneCategorie of toutCategories) {
    if (uneCategorie.utilisateur == req.session.utilisateurId) {
      categorieExist = true;
      categorieId = uneCategorie.id;
    }
  }

  if (categorie == "") {
    return res.render("transactions/ajouter", {
      title: "WealthWave - Ajouter Transaction",
      error: "Selectionner une categorie",
      toutCategories,
    });
  }

  if (!categorieExist) {
    return res.render("transactions/ajouter", {
      title: "WealthWave - Ajouter Transaction",
      error: "La categories saisez n'exist pas",
      toutCategories,
    });
  }

  try {
    await transactions.create({
      type,
      prix,
      date: new Date(date),
      utilisateur: req.session.utilisateurId,
      categorie: catSelectionner.id,
      note,
    });
  } catch (error) {
    console.log(error);
    return res.render("transactions/ajouter", {
      title: "WealthWave - Ajouter Transaction",
      error: "Erreur lors de creation",
      toutCategories,
    });
  }

  return res.redirect("/transactions");
});

app.get("/transactions", estConnecte, async (req, res) => {
  const utilisateur = await utilisateurs.findByPk(req.session.utilisateurId);
  const toutTransactions = await transactions.findAll({
    where: {
      utilisateur: req.session.utilisateurId,
    },
    order: [
      ["date", "DESC"],
      ["id", "DESC"],
    ],
  });

  for (let index = 0; index < toutTransactions.length; index++) {
    let categorieChanger = await categories.findOne({
      where: {
        id: toutTransactions[index].categorie,
      },
    });
    toutTransactions[index].categorie = categorieChanger;
  }

  res.render("transactions/index", {
    title: "WealthWave - Transactions",
    toutTransactions,
    utilisateur,
  });
});

app.post("/transactions/supprimer", estConnecte, async (req, res) => {
  const { id } = req.body;
  const utilisateur = await utilisateurs.findByPk(req.session.utilisateurId);
  const toutTransactions = await transactions.findAll({
    where: {
      utilisateur: req.session.utilisateurId,
    },
  });

  try {
    await transactions.destroy({
      where: {
        id,
        utilisateur: req.session.utilisateurId,
      },
    });
    return res.redirect("/transactions");
  } catch (error) {
    console.log(error);
    return res.render("transactions/index", {
      title: "WealthWave - Transactions",
      error:
        "Une erreur est survenueez lors de la suppression de la transaction.",
      toutTransactions,
      utilisateur,
    });
  }
});

app.get("/transactions/modifier", estConnecte, async (req, res) => {
  const { id } = req.query;
  const transactionSpecifier = await transactions.findByPk(id);
  const toutCategories = await categories.findAll({
    where: {
      utilisateur: req.session.utilisateurId,
    },
  });

  function formaterDatePourInput(date) {
    if (!date) return "";
    const d = new Date(date);
    const timezoneOffset = d.getTimezoneOffset() * 60000;
    const localDate = new Date(d.getTime() - timezoneOffset);
    return localDate.toISOString().slice(0, 16);
  }

  if (transactionSpecifier && transactionSpecifier.date) {
    transactionSpecifier.dateFormatted = formaterDatePourInput(
      transactionSpecifier.date
    );
  }

  res.render("transactions/modifier", {
    title: "WealthWave - Modifier Transaction",
    toutCategories,
    transactionSpecifier,
  });
});

app.post("/transactions/modifier", estConnecte, async (req, res) => {
  const { id, type, prix, date, categorie, note } = req.body;
  const transaction = await transactions.findByPk(id);
  const toutCategories = await categories.findAll({
    where: {
      utilisateur: req.session.utilisateurId,
    },
  });

  const categorieAct = await categories.findOne({
    where: {
      id: categorie,
      utilisateur: req.session.utilisateurId,
    },
  });

  const transactionSpecifier = transaction;

  if (!categorieAct) {
    return res.render("transactions/modifier", {
      title: "WealthWave - Ajouter Transaction",
      error: "Il faut une vraie catégorie",
      toutCategories,
      transactionSpecifier,
    });
  }

  if (
    (type != "Revenu" && type != "Frais" && type != "Transfert") ||
    type == ""
  ) {
    return res.render("transactions/modifier", {
      title: "WealthWave - Ajouter Transaction",
      error: "Il faut sélectionner juste les types proposés",
      toutCategories,
      transactionSpecifier,
    });
  }

  if (prix <= 0 || prix == "") {
    return res.render("transactions/modifier", {
      title: "WealthWave - Ajouter Transaction",
      error: "Il faut sélectionner un prix positif",
      toutCategories,
      transactionSpecifier,
    });
  }

  if (date == "") {
    return res.render("transactions/modifier", {
      title: "WealthWave - Ajouter Transaction",
      error: "Saisir une Date",
      toutCategories,
      transactionSpecifier,
    });
  }

  if (categorie == "") {
    return res.render("transactions/modifier", {
      title: "WealthWave - Ajouter Transaction",
      error: "Sélectionner une catégorie",
      toutCategories,
      transactionSpecifier,
    });
  }

  // Si la catégorie existe, on continue
  transaction.type = type;
  transaction.prix = prix;
  transaction.date = new Date(date);
  transaction.categorie = categorieAct.id;
  transaction.note = note;

  await transaction.save();

  res.redirect("/transactions");
});

app.get("/categorie/ajouter", estConnecte, async (req, res) => {
  res.render("categories/ajouter", {
    title: "WealthWave - Ajouter Categorie",
  });
});

app.post("/categorie/ajouter", estConnecte, async (req, res) => {
  const { nom } = req.body;
  const allCategories = await categories.findAll();
  let categorieExist = false;

  for (let categorie of allCategories) {
    if (categorie.nom == nom) {
      categorieExist = true;
    }
  }

  if (categorieExist) {
    return res.render("categories/ajouter", {
      title: "WealthWave - Ajouter Categorie",
      error: "Cette Categorie et exist déja",
    });
  }

  try {
    await categories.create({
      nom,
      utilisateur: req.session.utilisateurId,
    });
  } catch (error) {
    console.log(error);
    return res.render("categories/ajouter", {
      title: "WealthWave - Ajouter Categorie",
      error: "Error et servenu",
    });
  }

  return res.redirect("/categories");
});

app.get("/categories", estConnecte, async (req, res) => {
  const allCategories = await categories.findAll({
    where: {
      utilisateur: req.session.utilisateurId,
    },
  });

  function formaterDatePourAfficher(date) {
    if (!date) return "";
    const d = new Date(date);
    const timezoneOffset = d.getTimezoneOffset() * 60000;
    const localDate = new Date(d.getTime() - timezoneOffset);
    return localDate.toISOString().slice(0, 16);
  }

  for (let categorie of allCategories) {
    if (categorie && categorie.createdAt) {
      categorie.date = formaterDatePourAfficher(categorie.createdAt);
    }
  }

  res.render("categories/index", {
    title: "WealthWave - Categories",
    allCategories,
  });
});

app.get("/categorie/modifier", estConnecte, async (req, res) => {
  try {
    const { id } = req.query;
    const categorie = await categories.findOne({
      where: {
        id: id,
        utilisateur: req.session.utilisateurId,
      },
    });

    if (categorie.utilisateur != req.session.utilisateurId && categorie == "") {
      return res.redirect("/categories");
    }

    if (!categorie) {
      return res.redirect("/categories");
    }

    res.render("categories/modifier", {
      title: "WealthWave - Modifier Categorie",
      categorie,
    });
  } catch (error) {
    console.log("erreur: ", error);
    res.redirect("/categories");
  }
});

app.post("/categorie/modifier", estConnecte, async (req, res) => {
  const { id, nom } = req.body;
  const allCategories = await categories.findAll();
  const categorieAModifier = await categories.findByPk(id);
  let categorieExist = false;

  if (allCategories) {
    for (let categorie of allCategories) {
      if (categorie.nom == nom) {
        categorieExist = true;
      }
    }
  }

  if (categorieExist) {
    function formaterDatePourAfficher(date) {
      if (!date) return "";
      const d = new Date(date);
      const timezoneOffset = d.getTimezoneOffset() * 60000;
      const localDate = new Date(d.getTime() - timezoneOffset);
      return localDate.toISOString().slice(0, 16);
    }

    for (let categorie of allCategories) {
      if (categorie && categorie.createdAt) {
        categorie.date = formaterDatePourAfficher(categorie.createdAt);
      }
    }
    return res.render("categories", {
      title: "WealthWave - Categories",
      error: "Cette Categorie et exist déja",
      allCategories,
    });
  }

  categorieAModifier.nom = nom;
  categorieAModifier.save();

  res.redirect("/categories");
});

app.post("/categorie/supprimer", estConnecte, async (req, res) => {
  const { id } = req.body;

  try {
    await categories.destroy({
      where: {
        id,
      },
    });
    return res.redirect("/categories");
  } catch (error) {
    const allCategories = await categories.findAll();
    console.log(error);
    return res.render("categories/index", {
      title: "WealthWave - Categories",
      error:
        "Une erreur est survenueez lors de la suppression de la categorie.",
      allCategories,
    });
  }
});

async function exportationFinale(modelData, model, utilisateurId, res, req) {
  let data = {};
  switch (model) {
    case "categories":
      data = modelData.map((d) => ({
        nom: d.nom,
        createdAt: d.createdAt,
      }));
      break;
    case "transactions":
      data = modelData.map((d) => ({
        date: d.date,
        prix: d.prix,
        categorie: d.categorie,
        type: d.type,
        note: d.note,
      }));
      break;
    case "budgets":
      data = modelData.map((d) => ({
        nom: d.nom,
        description: d.description,
        categorie: d.categorie,
        utilisateur: d.utilisateur,
        montant: d.montant,
      }));
      break;
    case "objectifs":
      data = modelData.map((d) => ({
        titre: d.titre,
        utilisateur: d.utilisateur,
        montantObjectif: d.montantObjectif,
        categorie: d.categorie,
      }));
      break;

    default:
      return res.send("Erreur Lors de l'exportation.");
  }

  const fileName = `${model}_${utilisateurId}`;
  const csvPath = await exportToCSV(data, fileName);

  res.download(csvPath, `${model}_export.csv`, (err) => {
    if (err) console.log("Erreur et servenu: ", err);
    require("fs").unlink(csvPath, (err) => {
      if (err) console.log("Erreure dans la suppression de fichier: ", err);
    });
  });
}

app.get("/export", estConnecte, async (req, res) => {
  const utilisateurId = req.session.utilisateurId;

  const model = await req.query.model;
  let modelData = "";
  switch (model) {
    case "categories":
      modelData = await categories.findAll({
        where: {
          utilisateur: utilisateurId,
        },
      });
      exportationFinale(modelData, "categories", utilisateurId, res, req);
      break;
    case "transactions":
      modelData = await transactions.findAll({
        where: {
          utilisateur: utilisateurId,
        },
      });
      exportationFinale(modelData, "transactions", utilisateurId, res, req);
      break;
    case "budgets":
      modelData = await budgets.findAll({
        where: {
          utilisateur: utilisateurId,
        },
      });
      exportationFinale(modelData, "bugdets", utilisateurId, res, req);
      break;
    case "objectifs":
      modelData = await objectifs.findAll({
        where: {
          utilisateur: utilisateurId,
        },
      });
      exportationFinale(modelData, "objectifs", utilisateurId, res, req);
      break;

    default:
      return res.send("Erreur Lors de l'exportation.");
  }

  if (modelData.length === 0) {
    return res.send("Aucune Data à exporter.");
  }
});

app.get("/budgets", estConnecte, async (req, res) => {
  const toutBudgets  = await budgets.findAll({
    where: {
      utilisateur: req.session.utilisateurId,
    }
  });

  if(toutBudgets.length > 0){
    for(let budget of toutBudgets){
      budget.categorie = await categories.findOne({
        where: {
          id: budget.categorie,
          utilisateur: req.session.utilisateurId,
        }
      });
    }
  }

  const utilisateur = await utilisateurs.findByPk(req.session.utilisateurId);
  
  res.render("budgets/index", {
    title: "WealthWave - Budgets",
    toutBudgets,
    utilisateur,
  });
});

app.get("/budget/ajouter", estConnecte, async (req, res) => {
  const toutCategories = await categories.findAll({
    where: {
      utilisateur: req.session.utilisateurId, 
    }
  });
  res.render("budgets/ajouter", {
    title: "WealthWave - Ajouter Budget",
    toutCategories,
  });
});

app.use((req, res, next) => {
  res.status(404).render("404");
});

app.listen(port, () => {
  console.log("Server Connected");
});