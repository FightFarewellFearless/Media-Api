function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
const Database = require("easy-json-database");
const db = new Database("./database.json", {
    snapshots: {
        enabled: true,
        interval: 24 * 60 * 60 * 1000,
        folder: './backups/'
    }
});
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
var path = require('path');
const fs = require('fs')

// default options
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : __dirname+'/temp',
uriDecodeFileNames: false,
uploadTimeout:0,
limits: { fileSize: 1000 * 1024 * 1024 },

}));

var session = require('express-session');
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(function(req, res, next) {
  var schema = req.headers['x-forwarded-proto'];

  if (schema === 'https') {
    // Already https; don't do anything special.
    next();
  }
  else {
    // Redirect to https.
    res.redirect('https://' + req.headers.host + req.url);
  }
});
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true

}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


app.engine('html', require('ejs').renderFile);

app.get('/delete',function(req,res) {
    
    var use = req.cookies.username
    
    let inc = db.get("file_"+use)
 
   let id = req.query.id 
    
if(id && inc.includes(id)==true) {
    
var array = db.get("file_"+use)
array.splice(array.indexOf(req.query.id), 1);
db.set("file_"+use,array)
    
    var fs = require('fs');
   
fs.unlink('./uploads/'+db.get(req.query.id), function (err) {
	if (err) throw err;
	// if no error, file has been deleted successfully
    })
    res.send(`<!DOCTYPE html>
<html>
    <meta name="viewport" content="initial-scale=1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <style>
   .btn {
       background-color: DodgerBlue;
  border: none;
  background-color: red;
  color: white;
  padding: 12px 30px;
  cursor: pointer;
  font-size: 20px;
}

/* Darker background on mouse-over */
.btn:hover {
  background-color: RoyalBlue;
}
        body {
             text-align: center;
             vertical-align: middle;
   background-color: lightblue;
             position: absolute

}
           
           </style>
<body>

<h1>Dashboard</h1>
File deleted!
    <br>
    <button class="btn" onclick="location.href='/dashboard'" type="submit">Back to dashboard</button>
</body>
</html>`)
             db.delete(req.query.id)
	
        
        }
    else {
        res.send(`<!DOCTYPE html>
<html>
    <meta name="viewport" content="initial-scale=1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <style>
   .btn {
       background-color: DodgerBlue;
  border: none;
  background-color: red;
  color: white;
  padding: 12px 30px;
  cursor: pointer;
  font-size: 20px;
}

/* Darker background on mouse-over */
.btn:hover {
  background-color: RoyalBlue;
}
        body {
             text-align: center;
             vertical-align: middle;
   background-color: lightblue;
             position: absolute

}
           
           </style>
<body>

<h1>Error</h1>
That file not exist
    <br>
    <button class="btn" onclick="location.href='/dashboard'" type="submit">Back to dashboard</button>
</body>
</html>`)
        } 

})

app.get('/dashboard', function(req,res) {
   var use = req.cookies.username
    if(db.get('file_'+use)!=='' && db.has('file_'+use)){
 
 
    const cars = db.get('file_'+use);

let u = "";
for (let i = 0; i < cars.length; i++) {
  u += db.get(cars[i]) + " <a href='/delete?id="+cars[i]+"' >delete this</a> | <a href='/download?id="+cars[i]+"' >download this</a>" +"<br> <br>";
}
        
    if(req.cookies.loggedin && use !== undefined) {
    res.send(`<!DOCTYPE html>
<html>
    <meta name="viewport" content="initial-scale=1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <style>
.dropbtn {
  background-color: #04AA6D;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

.dropbtn:hover, .dropbtn:focus {
  background-color: #3e8e41;
}

#myInput {
  box-sizing: border-box;
  background-image: url('searchicon.png');
  background-position: 14px 12px;
  background-repeat: no-repeat;
  font-size: 16px;
  padding: 14px 20px 12px 45px;
  border: none;
  border-bottom: 1px solid #ddd;
}

#myInput:focus {outline: 3px solid #ddd;}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f6f6f6;
  min-width: 230px;
  overflow: auto;
  border: 1px solid #ddd;
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown a:hover {background-color: #ddd;}

.show {display: block;}
   .btn {
       background-color: DodgerBlue;
  border: none;
  background-color: red;
  color: white;
  padding: 12px 30px;
  cursor: pointer;
  font-size: 20px;
}

/* Darker background on mouse-over */
.btn:hover {
  background-color: RoyalBlue;
}
        body {
             text-align: center;
             vertical-align: middle;
   background-color: lightblue;
             position: absolute

}
           
           </style>
<body>

<h1>Dashboard</h1>
${u}
    <br>
    <button class="btn" onclick="location.href='/upload'" type="submit">Upload page</button>
<div class="dropdown">
  <button onclick="myFunction()" class="dropbtn">Fast redirect click here</button>
  <div id="myDropdown" class="dropdown-content">
    <input type="text" placeholder="Search.." id="myInput" onkeyup="filterFunction()">
    <a href="/auth/login">login</a>
    <a href="/auth/register">register</a>
    <a href="/upload">upload</a>

  </div>
</div>
<script>
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}
</script>

</body>
</html>
`)
        }
    else {
        res.send(`<html>
<head>
<meta name="description" content="Free Cloud And Sharing Storage">
<meta name="title" content="Welcome!">
</head>
<style>
.dropbtn {
  background-color: #04AA6D;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

.dropbtn:hover, .dropbtn:focus {
  background-color: #3e8e41;
}

#myInput {
  box-sizing: border-box;
  background-image: url('searchicon.png');
  background-position: 14px 12px;
  background-repeat: no-repeat;
  font-size: 16px;
  padding: 14px 20px 12px 45px;
  border: none;
  border-bottom: 1px solid #ddd;
}

#myInput:focus {outline: 3px solid #ddd;}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f6f6f6;
  min-width: 230px;
  overflow: auto;
  border: 1px solid #ddd;
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown a:hover {background-color: #ddd;}

.show {display: block;}
body {
background-color: lightblue;
text-align: center
}
</style>
<meta name="viewport" content="initial-scale=1">
<body>
you are not logged in, if you want to upload file, you must login first, <a href="/auth/login">click here</a>
</body>
</html>`)
        }
    }
    else {
        res.send(`<!DOCTYPE html>

<html>
<head>
<meta name="description" content="Free Cloud And Sharing Storage">
<meta name="title" content="Welcome!">

    <meta name="viewport" content="initial-scale=1">
</head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <style>
.dropbtn {

  background-color: #04AA6D;

  color: white;

  padding: 16px;

  font-size: 16px;

  border: none;

  cursor: pointer;

}

.dropbtn:hover, .dropbtn:focus {

  background-color: #3e8e41;

}

#myInput {

  box-sizing: border-box;

  background-image: url('searchicon.png');

  background-position: 14px 12px;

  background-repeat: no-repeat;

  font-size: 16px;

  padding: 14px 20px 12px 45px;

  border: none;

  border-bottom: 1px solid #ddd;

}

#myInput:focus {outline: 3px solid #ddd;}

.dropdown {

  position: relative;

  display: inline-block;

}

.dropdown-content {

  display: none;

  position: absolute;

  background-color: #f6f6f6;

  min-width: 230px;

  overflow: auto;

  border: 1px solid #ddd;

  z-index: 1;

}

.dropdown-content a {

  color: black;

  padding: 12px 16px;

  text-decoration: none;

  display: block;

}

.dropdown a:hover {background-color: #ddd;}

.show {display: block;}
   .btn {
       background-color: DodgerBlue;
  border: none;
  background-color: red;
  color: white;
  padding: 12px 30px;
  cursor: pointer;
  font-size: 20px;
}

/* Darker background on mouse-over */
.btn:hover {
  background-color: RoyalBlue;
}
        body {
             text-align: center;
             vertical-align: middle;
   background-color: lightblue;
             position: absolute

}
           
           </style>
<body>

<h1>Dashboard</h1>
you dont have file upload here
    <br>
    <button class="btn" onclick="location.href='/upload'" type="submit">Upload page</button>
<div class="dropdown">
  <button onclick="myFunction()" class="dropbtn">Fast redirect click here</button>
  <div id="myDropdown" class="dropdown-content">
    <input type="text" placeholder="Search.." id="myInput" onkeyup="filterFunction()">
    <a href="/auth/login">login</a>
    <a href="/auth/register">register</a>
    <a href="/upload">upload</a>

  </div>
</div>
<script>
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}
</script>

</body>
</html>
`)
        }
        
    })


app.get('/', function(req,res) {
    res.redirect('/dashboard')})

app.get('/file', function(req,res) {
    if(!req.query.id && !db.has(req.query.id)) {
        res.send('invalid id')} 
    else {
        const file = path.join(__dirname+'/uploads/'+db.get(req.query.id));
  res.download(file)
        }
    })

app.get('/download', function(req,res) {
    if(!req.query.id || !db.has(req.query.id)) {
        res.send(`<!DOCTYPE html>
<html>
<head>
<meta name="description" content="Download or share your file with MediaApi">
<meta name="title" content="Download Page">
</head>
    <meta name="viewport" content="initial-scale=1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <style>

   .btn {
       background-color: DodgerBlue;
  border: none;
  background-color: red;
  color: white;
  padding: 12px 30px;
  cursor: pointer;
  font-size: 20px;
}

/* Darker background on mouse-over */
.btn:hover {
  background-color: RoyalBlue;
}
        body {
             text-align: center;
             vertical-align: middle;
   background-color: lightblue;
             position: absolute

}
           
           </style>
<body>

<h1>Download error</h1>
The ID invalid, or the file has been deleted
    <br>
    <button class="btn" onclick="location.href='/dashboard'" type="submit">Back to dashboard</button>
</body>
</html>`) }
    else {
       var stats = fs.statSync(__dirname + "/uploads/"+db.get(req.query.id))
var fileSizeInBytes = stats.size;
// Convert the file size to megabytes (optional)
var mb = fileSizeInBytes / (1024*1024);

        res.render(path.join(__dirname +'/down.html'),{id:req.query.id, name:db.get(req.query.id), size:mb+' MB'})
        }
    })

app.get('/upload', function(req,res) {
   
    if(req.cookies.loggedin && req.cookies.username !== undefined) {
    res.sendFile(path.join(__dirname +'/index.html'))
        }
    else {
        res.send(`<html>
<head>
<meta name="description" content="Free Cloud And Sharing Storage">
<meta name="title" content="Welcome!">
</head>
<style>
body {
background-color: lightblue;
text-align: center
}
</style>
<meta name="viewport" content="initial-scale=1">
<body>
you are not logged in, if you want to upload file, you must login first, <a href="/auth/login">click here</a>
</body>
</html>`)
        }
    })
app.post('/upload', function(req, res) {
    let y = makeid(17)
    var use = req.cookies.username
  let sampleFile;
  let uploadPath;
db.push('file_'+use,y)
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + '/uploads/' + sampleFile.name;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);
      
db.set(y,sampleFile.name)
    res.send(`
<html>
<style>
.btn {

       background-color: DodgerBlue;

  border: none;

  background-color: red;

  color: white;

  padding: 12px 30px;

  cursor: pointer;

  font-size: 20px;

}

/* Darker background on mouse-over */

.btn:hover {

  background-color: RoyalBlue;

}
body {
background-color: lightblue;
text-align: center
}
</style>
<head>
<meta name="viewport" content="initial-scale=1">
</head>
<body>
             File uploaded! <a href="/download?id=${y}">download link</a>
<button class="btn" onclick="location.href='/dashboard'" type="submit"><i class="fa fa-download"></i>Go to dashboard</button>
</body>
<html>`);
  });
});

app.listen(1553);

console.log('media api ready! in port 1553')








//login










var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sercret',
        pass: 'this is secret'
    }
});

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}



app.get('/auth/register', function(request, response) {
	response.sendFile(path.join(__dirname + '/register.html'));
});

app.get('/auth/login', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth/auth', function(request, response) {
	var usernam = request.body.username;
	var password = request.body.password;
    var username = usernam.replace('.','titik')
	if (username && password) {

        if (db.has(username) && db.get(username)==password) {
				response.cookie("loggedin",true)
				response.cookie("username", username);
				response.redirect('/dashboard');
			} else {
				response.send(`
<html>
<meta name="viewport" content="initial-scale=1">
<style>
body {
background-color: lightblue;
text-align: center
}
</style>
<body>
Incorrect Username and/or Password!
</body>
</html>`);
			}			
			response.end();
		}
	 else {
		response.send('Please enter Username and Password!');
		response.end();
	}

});
app.get('/verify',async(req,res) => {
    if(!db.has(req.query.id)) {
        res.send('invalid id')
        }
    
    else {
       let n = db.get(req.query.id)
       let no = n.replace('.','titik')
 await db.set(no, req.query.pass);
        db.delete(req.query.id)
        res.send(`
<style>
body {
background-color: lightblue;
text-align: center
}
</style>
<meta name="viewport" content="initial-scale=1">
<body>
verify success <a href="/auth/login">click here to login</a>
</body>`)
        }
    })

app.post('/auth/reg', function(request, response) {
   
	var use = request.body.username;
	var password = request.body.password;
	
    var username = use.replace('.','titik')
    if(!db.has(username)) {
    
        let id = makeid(7)
        var mailOptions = {
    from: 'secret',
    to: request.body.username,
    subject: 'Verify your email',
    text: 'to verify',
            html: '<a href="https://'+req.headers.host+'/verify?id='+id+'&pass='+password+'">click this link to  verify</a> <br> IGNORE THIS IF YOU ARE NOT TRYING TO REGISTER TO MEDIAAPI'
};

transporter.sendMail(mailOptions, (err, info) => {
    if (err) throw err;
    });
        db.set(id,username)
    response.send(`
<style>

body {

background-color: lightblue;

text-align: center

}

</style>
<meta name="viewport" content="initial-scale=1">
<body>
check your email
</body>`)
    response.end()
}
    else {
        response.send(`
<meta name="viewport" content="initial-scale=1">
<style>
body {
background-color: lightblue;
text-align: center
}
</style>
<body>
username has been taken, search for another
</body>`)
        }
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
        let o = request.session.username
		
        let u = o.replace('titik','.')
        response.send('Welcome back, ' + u + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});
