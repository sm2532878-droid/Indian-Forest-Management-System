const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const fs = require("fs");
const path=require("path");
const multer=require("multer")
const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

let otpStore = {};
let users = require("./users.json");
app.get(["/","/login"],(req,res)=>{res.sendFile(path.join(__dirname,"public","loginpg1.html"))});
app.get("/landing",(req,res)=>{res.sendFile(path.join(__dirname,"public","basepg.html"))});
app.get(['/signup'],(req,res)=>{res.sendFile(path.join(__dirname,"public","loginpg2.html"))});
app.get("/admin-logpg",(req,res)=>{res.sendFile(path.join(__dirname,"public","admin-logpg.html"))});
app.get("/admindashboard",(req,res)=>{res.sendFile(path.join(__dirname,"public","admin-dashboard.html"))});
app.get("/newspgadmin",(req,res)=>{res.sendFile(path.join(__dirname,"public","admin-wildnews.html"))});
app.get("/news.html", (req, res) => {res.sendFile(__dirname + "/public/newspg/public.html");});


// Gmail SMTP (API)

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "indianforestmanagement@gmail.com",
        pass: "hbevvzeppxbbtwwj"
    }
});

// Signup
app.post("/signup", (req, res) => {
    const { name, email } = req.body;

    if (users.find(u => u.email === email)) {
        return res.json({ message: "User already exists!" });
    }

    users.push({ name, email });
    fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
    res.json({ message: "Registration Successful 🌲" });
});

// Send OTP

// Send OTP
app.post("/send-otp", (req, res) => {
    const { email } = req.body;

    if (!users.find(u => u.email === email)) {
        return res.json({
            success: false,
            message: "User not registered!"
        });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[email] = otp;

    console.log("OTP Requested for", email);
    console.log("OTP is", otp);

    res.json({
        success: true,
        message: "OTP generated successfully",
        otp: otp
    });
});

        // Send OTP via email
        const mailOptions = {
            from: "indianforestmanagement@gmail.com",
            to: email,
            subject: "Your OTP for Indian Forest Management System",
            html: `<h2>Your OTP Code</h2>
                   <p>Your One-Time Password (OTP) is:</p>
                   <h1 style="color: green;">${otp}</h1>
                   <p>This OTP is valid for 10 minutes.</p>
                   <p>Do not share this OTP with anyone.</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Email Sending Error:", error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to send OTP"
                });
            } else {
                console.log("Email sent:", info.response);
                res.json({
                    success: true,
                    message: "OTP sent to your email successfully",
                });
            }
        });
    } catch (error) {

        console.error("Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to process OTP request"
        });
    }
});
// Verify OTP
app.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;

    if (otpStore[email] === Number(otp)) {
        delete otpStore[email];
        
        res.json({success:true, message: "Login Successful 🌳",redirectTo:"/landing" });
    
        } else {
        res.json({ message: "Invalid OTP",success:false });
    }
});
// Admin Login
app.post("/admin/login",(req,res)=>{
    const username="WildlifeManager2025"
    const password="Wild$life@Manager#2025"
    const {user , pass}=req.body


    if(user===username && pass === password){
        res.json({success:true,message:"Login Successful",redirectTo:"/admindashboard"})
    }
    else{ 
          res.json({ message: "Invalid Login",success:false });
    }
})
// Admin Upload
app.get("/api/news", (req, res) => {
    if (fs.existsSync("newsData.json")) {
        const news = JSON.parse(fs.readFileSync("newsData.json"));
        res.json(news);
    } else {
        res.json([]);
    }
});
const storage=multer.diskStorage({
    destination:"public/uploads",

    
    filename:(req,file,cb)=>{
        cb(null,Date.now() + "-"+file.originalname)
    }
})

const upload=multer({storage})
app.post("/admin/add-news",upload.single("image"),(req,res)=>{
let news=fs.existsSync("newsData.json")? 
JSON.parse(fs.readFileSync("newsData.json")):[];
news.push({
    title:req.body.title,
    location:req.body.location,
    content:req.body.content,
    image:"/uploads/"+req.file.filename,
    date:new Date().toDateString()
})
fs.writeFileSync("newsData.json",JSON.stringify(news,null,2))
res.redirect("/news.html")
})


// ANIMAL CENSUS API

// Save Census Data
app.post("/admin/add-census", express.urlencoded({ extended: true }), (req, res) => {

    let censusData = fs.existsSync("censusData.json")
        ? JSON.parse(fs.readFileSync("censusData.json"))
        : [];

    censusData.push({
        animal: req.body.animal,
        population: req.body.population,
        region: req.body.region,
        year: req.body.year
    });

    fs.writeFileSync(
        "censusData.json",
        JSON.stringify(censusData, null, 2)
    );

    // Redirect to report page
    res.redirect("/animal census report/animalcensusreport.html");

});


// Show Census Data
app.get("/api/census", (req, res) => {

    if (fs.existsSync("censusData.json")) {

        const data = JSON.parse(
            fs.readFileSync("censusData.json")
        );

        res.json(data);

    } else {

        res.json([]);

    }

});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


