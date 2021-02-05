// Carregando módulos
const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const app = express();
const pages = require("./route/pages");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const moment = require("moment");
const mongoose = require("mongoose")
require("./model/linguagem")
const linguagem = mongoose.model("linguagens")

//Configurações
//Sessão
app.use(
  session({
    secret: "projeto_classificado",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
//Middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});
//Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//Handlebars
app.engine(
  "handlebars",
  handlebars({
    defaultLayout: "main",
    helpers: {
      formatDate: (data) => {
        return moment(data).format('DD/MM/YYYY');
      }
    },
  }),
);
app.set("view engine", "handlebars");
//Mongoose
mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost/siteLinguagem")
  .then(() => {
    console.log("Conectado com sucesso");
  })
  .catch((erro) => {
    console.log("Erro ao se conectar: " + erro);
  });
//Public
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  console.log("Eu sou um Middleware.");
  next();
});
//Rotas
app.get("/", (req, res) => {
  res.send("Rota principal");
});
//linguagem - Leia Mais
app.get("/linguagem/:id", (req, res) => {
  linguagem.findOne({_id: req.params.id}).lean().then((linguagens) =>{

      if(linguagens){
         res.render("linguagem/index", {linguagens: linguagens}) 
      }else {
         req.flash("error_msg", "Está linguagem não existe.")
         res.redirect("/")
      }

  }).catch((error) => {
      req.flash("error_msg", "Houve um erro interno.")
      res.redirect("/")
  })    
})

app.use("/pages", pages);

//PORTA
const PORT = 8081;
app.listen(PORT, () => {
  console.log("Servidor rodando!");
});
