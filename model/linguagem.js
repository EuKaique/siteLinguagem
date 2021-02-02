const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const linguagem = new Schema({
    titulo:{
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    }
})

mongoose.model("linguagens", linguagem);