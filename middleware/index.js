const express = require("express");
const app = express();

app.use((req, res,next) => {
  console.log("tHIS IS MY FIRST MIDDLEWARE");


  req.username='sabeel';
  next();
});

app.get("/", (req, res) => {
  res.send("Home Route");
});


app.get('/cat',(req,res)=>{
    res.send('meeoww');
    const {username}=req;
    console.log(username);
});

app.listen(2323, () => {
  console.log("Server is running on port 2323");
});
