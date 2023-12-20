const fs = require("fs")
const jwt = require("jsonwebtoken")
const path = require("path");

const userJsonPath = path.join(__dirname, "..", "user.json");

const userData = JSON.parse(fs.readFileSync(userJsonPath));



// ===================================== user login api ==========================================================

const userLogin = async(req,res) =>{
    try {

        const { email_id, password } = req.body;
    

        const user = userData.find(
          (u) => u.email_id === email_id && u.password === password
        );

        if (user) {

          const token =  jwt.sign({ email_id }, "secretKey", { expiresIn: "5h" });

          res.cookie("token", token);
          res.send({ token});
        } else {
          res.status(401).json({ error: "Invalid credentials" });
        }
        
    } catch (error) {
         return res
         .status(500).send({message:"server error", error:error.message})
    }
}


// =========================== create message api ==========================================================


const createMessage = async (req,res)=>{
    try {

        const {data} = req.body
        console.log(req.cookies.message)
        if(!req.cookies.message){
         const arr = [data];
         const sing = JSON.stringify(arr);
         res.cookie("message", sing);
         res.send(sing);
        } else{
        const parsedVal =  await JSON.parse(req.cookies.message);
        if(parsedVal.includes(data)){
            return res.status(400).send({message:"This message is already exists"})
        }
        const update = [...parsedVal,data]
        const finalval =  JSON.stringify(update)
        const finalForSure = decodeURIComponent(finalval)
       res.cookie("message", finalForSure);
   
        res.status(200).send(finalval)
        }
        
    } catch (error) {
        res.status(500).send(error.message)
        console.error(error.message)
    }
}


// ===================================== search data api ======================================================


const searchData = async (req,res)=>{
try {

    const { searchTerm } = req.params;
   
    const messages = await JSON.parse ( req.cookies.message)
      const searchedData = await messages.filter((message) =>
      
        message.includes(searchTerm)
      );
      console.log(searchedData)
       
      res.status(200).send(searchedData); 

} catch (error) {
    res.status(500).send(error.message)
    
}
}


// ================================== clear data api ============================================================


const clearData = async (req,res)=>{
try {
    
     res.clearCookie("message");
     res.status(200).send("Data deleted successfully")

} catch (error) {
    res.status(500).send(error.message)
    
}
}


// ==================================== Logout api =======================================================


const logout = (req,res)=>{
 try {
    
    res.clearCookie("token")
    res.status(200).send("logout successful")
    
 } catch (error) {
       res.status(500).send(error.message);
 }
}




module.exports = { userLogin, createMessage, searchData, clearData, logout}