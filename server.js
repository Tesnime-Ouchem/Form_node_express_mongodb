const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const cors=require("cors");
const Etudiant=require("./models/etudiant");
const bcrypt=require("bcrypt")
const path=require("path")
const app=express();
const jwt=require("jsonwebtoken");
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())

//post pour la page inscription(l'envoie des doonnee)
app.post("/inscription",async(req,res)=>{
    try{
        const {nom,prenom,email,password}=req.body;
        if(!nom || !prenom ||!email||!password){
            return res.status(400).json({message:"pas de contenue il faut remplir tout les champs!"})}
        const findEtudiant=await Etudiant.findOne({email});
        if(findEtudiant){
         return res.status(409).json({message:"compte invalide"})
        }
         const hashpassword=await bcrypt.hash(password,10);
        const newEtudiant=new Etudiant({
            nom:req.body.nom,
            prenom:req.body.prenom,
            email:req.body.email,
            password:hashpassword,
        })
        await newEtudiant.save();
        res.status(201).json({message:"creation avec succée"})
 }catch(err){
        console.log("erreur du serveur :" ,err);
        res.status(500).json({error: "erreu du serveur !"});

    }
})
//post pour la page connexion
app.post("/connexion",async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email||!password){ 
         return res.status(404).json({message:"il faut remplir tout les champs"});}
        
        const findEtudiant=await Etudiant.findOne({email});
        if(!findEtudiant){
            return res.status(400).json({message:"email non trouvée "})
        }
         const isPasswordValide=await bcrypt.compare(password,findEtudiant.password);
            if(!isPasswordValide){
                return  res.status(400).json({message:"mot de passe invalide"});
            } 
            
            res.status(200).json({message:"connexion avec succée",prenom:findEtudiant.prenom});   
            } 
        catch(err){
        console.log("erreur serveur :",err);
        res.status(500).json({err:"erreur du serveur !"});}
    });
    //post pour forgotpassword
    app.put('/forgotPassword',async(req,res)=>{
        try{
            const {email,password,confirmpassword}=req.body;
            if(!email||!password||!confirmpassword){
                return res.status(400).json({message:"il faut remplir tout les champs"});
            }
            const findUser=await Etudiant.findOne({email});
            if(!findUser){
                return res.status(400).json({message:"email invalide !!"});
            }
            if(password!=confirmpassword){
                return res.status(400).json({message:"les mot de passe ne sont pas compatible"});
            }
            const newpassword=await bcrypt.hash(password,10);
            findUser.password=newpassword;
           await findUser.save();
           res.status(200).json({message:"mise à jour avec succée"})
     

        }catch(err){
            console.log(err);
            res.status(500).json({message:"erreur du serveur"})
        }
    })
app.get('/',(req,res)=>{
    res.redirect("/register.html");

})
        
mongoose.connect("mongodb://localhost:27017/form_node_express_mongodb")
.then(()=>{
    console.log("connexion avec succée avec la base de donnée");
    app.listen(2000,()=>{
        console.log("server avec succée");
    })
})
.catch((err)=>{
    console.log(err);
})