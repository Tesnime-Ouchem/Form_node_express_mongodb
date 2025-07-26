const mongoose=require("mongoose")
const etudiantSchema=mongoose.Schema({
    nom:{
        type:String,
        required:true
    },
     prenom:{
        type:String,
        required:true
    },
     email:{
        type:String,
        required:true
    },
     password:{
        type:String,
        required:true
    },
})
module.exports=Etudiant=mongoose.model("etudiants",etudiantSchema)