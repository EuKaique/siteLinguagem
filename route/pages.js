const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require("../model/linguagem")
const linguagem = mongoose.model("linguagens")


router.get('/',(req,res)=>{
    res.render("pages/index")
});

router.get("/linguagens",(req,res)=>{
    linguagem.find().lean().then((linguagens)=>{
        res.render("pages/linguagens", {linguagens: linguagens})
    }).catch((err)=>{
        req.flash("Erro ao listar as linguagens")
        res.redirect("/pages")
        console.log(err)
    })
    
});

router.get("/linguagens/add",(req,res)=>{
    res.render("pages/addlinguagens")
});

router.post("/linguagens/nova", (req, res)=>{

    var erros = []
    if(erros.length > 0){
        res.render("pages/addlinguagens", {erros: erros})
    }else{
        
        const novaLinguagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao
        }
        
        new linguagem(novaLinguagem).save().then(()=>{
            req.flash("success_msg","Linguagem adicionada com sucesso");
            res.redirect("/pages/linguagens")
        }).catch((err)=>{
            req.flash("error_msg","Houve um erro ao adicionar, tente novamente!");
            res.redirect("/pages/linguagens")
            console.log(err)
        })
    }
    
    })
router.get("/linguagens/edit/:id", (req,res)=>{

    linguagem.findOne({_id: req.params.id}).lean().then((linguagens)=>{
        res.render("pages/editlinguagens", {linguagens:linguagens} )
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao carregar formulário")
        res.redirect("/pages/linguagens")
        console.log(err)
    })
})    
router.post("/linguagens/edit", (req,res)=>{

    linguagem.findOne({_id: req.body.id}).then((linguagens)=>{

        linguagens.titulo = req.body.titulo;
        linguagens.descricao = req.body.descricao;

        new linguagem(linguagens).save().then(()=>{
            req.flash("success_msg","Linguagem editada")
            res.redirect("/pages/linguagens")
        }).catch((err)=>{
            req.flash("error_msg","Erro ao editar")
            res.redirect("/pages/linguagens")
            console.log(err)    
        })

        }).catch((err)=>{
            req.flash("error_msg","Houve um erro ao salvar edição")
            res.redirect("/pages/linguagens")
            console.log(err)
        }) 
})


router.get("/linguagens/excluir/:id",(req,res)=>{
    linguagem.remove({_id: req.params.id}).then(()=>{
        req.flash("warning_msg","linguagem deletada")
        res.redirect("/pages/linguagens")
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro interno")
        res.redirect("/pages/linguagens")
        console.log(err)
    })
})



module.exports = router; 