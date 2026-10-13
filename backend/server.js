const express = require("express")
const mongoose =  require("mongoose")
const nodemailer = require("nodemailer");
const {nanoid} = require("nanoid")

const userData = require("./models/userData")
const listData = require("./models/sidelist")
const todoData = require("./models/todoList")


const {checkForCookie} = require("./middleware/auth.js")

const cookieParser = require("cookie-parser")
const cors = require("cors")

require('dotenv').config();

const app = express()










////////////////////////////  Middlewares  /////////////////////////////////////////////


// Browsers le eeuta origin bata aako request aarko destination ma jana bata rokxa.
// i.e eeuta port/domain bata aarko port/domain ma request jana bata rokxa security reason le
// Tyesaile cors le tyo restriction lai off gardinxa. Mero backend 8000 port ma xa ra frontend 3000
// ma run vhai rako xa. So yini haru chutta chiuttai port/domain ma vhako le garda yettaikai 
// communicate garna mildaina, tyesaile cors use garnu parxa, to enable permission.

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use(checkForCookie("token"))

////////////////////////////////////////////////////////////////////////////////////////////










///////////////////////   Connecting to Batabase   ///////////////////////////////////////////

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("DB Connected"))
.catch((err) => console.log("Connection Failed", err));

///////////////////////////////////////////////////////////////////////////////////////////////










///////////////////////   Authenticating User   ///////////////////////////////////////////

app.get("/authentication",checkForCookie("token"),(req,res)=>{
  if(req.user){
    res.status(200).json({valid:true,user:req.user})
  }
  else{
    res.status(401).json({valid:false})
  }
})

///////////////////////////////////////////////////////////////////////////////////////////////

























///////////////////////////   Sign Up   ////////////////////////////////////////////////////////

app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check whether email already exists
    const existingEmail = await userData.findOne({ email });

    if (existingEmail) {
      return res.status(409).json({
        message: "Email already exists. Try another one!",
      });
    }

    // Create a new user
    const newUser = new userData({
      email,
      password,
    });

    await newUser.save();

    return res.status(201).json({
      message: "Account created successfully!",
    });
  } catch (err) {
    console.error("Error while saving user data:", err);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////
































///////////////////////////   Sign In   ///////////////////////////////////////////////////

app.post('/signin',async(req,res)=>{
  try{
    const {email,password} = req.body
    const token = await userData.matchingPassword(email,password)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    })
    return res.status(200).json({message : "Success"})
  }
  catch(err){
    res.status(401).json({message : err.message})
  }
})

///////////////////////////////////////////////////////////////////////////////////////////






























///////////////////////////   SideList   /////////////////////////////////////////////////////


//////////////////  Saving SideList  //////////////////////////////////////   

app.post('/list', async(req, res)=>{
  try{
    const {sideList} = req.body
    const email = req.user?.email
    const existingList = await listData.findOne({email,sideList})
    
    if(existingList){
      res.status(401).json({message : "List already exits..."})
    }
    else{
      const newList = new listData({email,sideList})
      await newList.save()
      res.status(200).json({ message: "Success"});
    }
  }
  catch(err){
    console.log("Error while saving user data.", err)
  }
})

/////////////////////////////////////////////////////////////////////










//////////////////  Fetching SideList  ////////////////////////////.

app.get("/list",async (req,res)=>{
  try{
    const email = req.user?.email
    const allList = await listData.find({email})
    res.status(200).json(allList); 
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
})

//////////////////////////////////////////////////////////////////////










///////////////////  Deleting List //////////////////////////////////

app.post("/deletelist",async (req,res)=>{
  try{
    const {deleteListName} = req.body
    const email = req.user?.email
    await listData.findOneAndDelete({email,sideList: deleteListName})
    await todoData.deleteMany({email,todoTitle: deleteListName})
    res.status(200).json({message:"Success"}); 
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
})

///////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////






























/////////////////////////////  Todo List   ///////////////////////////////////////////////////


/////////////////////  Save Todo  ////////////////////////////////

app.post("/todos/:todoId", async(req,res)=>{
  try{
    const {todo} = req.body
    const email = req.user?.email
    const todoTitle = req.params.todoId
    const newTodo = new todoData({email,todoTitle,todo})
    await newTodo.save()
    res.status(200).json({ message: "Success"});
  }
  catch(err){
    res.status(400).json({ message: "Fail"});
  }  
})

///////////////////////////////////////////////////////////////////















////////////////////   Fetch Todo   ///////////////////////////////

app.get("/todos/:todoId", async(req,res)=>{
  try{
    const email = req.user?.email
    const todoTitle = req.params.todoId

    if(email){
      const byEmail = await listData.find({email})

      const findTitle = byEmail.find(todo => todo.sideList === todoTitle)
      if(!findTitle){
        return res.status(404).json({ redirect: "/todos", message: "Todo not found" });
      }
      else{
        const allTodo = await todoData.find({email,todoTitle})
        res.status(200).json(allTodo);
      }
    }
    
  }
  catch(err){
    res.status(400).json({ message: "Fail"});
  }  
})

////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////



























////////////////////////////  Delete Submitted Todos //////////////////////////////////////

app.post("/todos/submit/:todoId", async(req,res)=>{
  try{
    const {selectedTodos} = req.body
    const email = req.user?.email
    const todoTitle = req.params.todoId
    await todoData.deleteMany({
      email,
      todoTitle,
      todo:{$in: selectedTodos}
    })
    res.status(200).json({message:"Success"});
  }
  catch(err){
    res.status(400).json({ message: "Fail"});
  }  
})


//////////////////////////////////////////////////////////////////////////////////////////

























/////////////////////////////   Sign Out   /////////////////////////////////////////////////

app.get("/signout",(req,res)=>{
  try{
    res.clearCookie("token",{
      httpOnly:true,
      secure:false,
      sameSite:"lax"
    })
    return res.status(200).json({ message: "Signed out successfully" });
  }
  catch(err){
    console.log("Error")
  }
})

////////////////////////////////////////////////////////////////////////////////////////////









//////////////////////// Change Password //////////////////////////////////////////////////


app.patch("/change/password",async(req,res)=>{
  try{
    const email = req.user?.email
    const {password: newPassword} = req.body

    const user = await userData.findOne({email})

    if(!user){
      return res.status(404).json({ message: "User not found" });
    }

    user.password = newPassword
    await user.save()

    res.clearCookie("token",{
      httpOnly:true,
      secure:false,
      sameSite:"lax"
    })

    return res.status(200).json({message:"Password Changed"})

  }
  catch(err){
    console.log("Error : ",err)
  }
  
})

//////////////////////////////////////////////////////////////////////////////////////////










const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});