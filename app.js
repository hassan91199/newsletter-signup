const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

mailchimp.setConfig({
  apiKey: "0a4c5ee4a6fa22b07c46c18360ba0960-us9",
  server: "us9",
});


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const fName = req.body.fName;
  const lName = req.body.lName;
  const eMail = req.body.eMail;

  const listId = "f6b6284dfa";

  const subscribingUser = {
    firstName: fName,
    lastName: lName,
    email: eMail
  };

  async function run() {
    try {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      });
      console.log(response);
      res.sendFile(__dirname + "/success.html");
    } catch (err) {
      console.log(err.status);
      res.sendFile(__dirname + "/failure.html");
    }
  }

  run();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(req, res) {
  console.log("Server is running on port 3000");
});



// f6b6284dfa

// API Key
// 0a4c5ee4a6fa22b07c46c18360ba0960-us9
