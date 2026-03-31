const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


const names=[];
const emails=[];
const passwords=[];
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/login", async(req,res)=>{
  try {
    const {email,password}= await req.body;
    const emailIndex = emails.indexOf(email);
    if(emailIndex !== -1 && passwords[emailIndex] === password){
      console.log(email,password);
      res.json({message:"welcomee"});
    }else{
      res.json({
        message:"user doesnt exist",
        email: email,
        password: password
      })
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.post("/signup", async(req,res)=>{
  try {
    const {name,email,password}= await req.body;
    names.push(name);
    emails.push(email);
    passwords.push(password);
    console.log(names, emails,passwords);
    res.json({message:"dponeeee sigining upppppp"});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});