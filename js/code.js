const urlBase = 'http://cop4331group9.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";


//populate table on page reload
if(window.location.pathname == "/contacts.html") {
    window.onload = function() {
        getAllContacts();
    }
}

//populate edit contact form
if(window.location.pathname == "/editContact.html") {
  window.onload = function() {
      var urlParams = new URLSearchParams(window.location.search);
  
      if (urlParams.has("firstName")) {
          document.getElementById("firstName").value = urlParams.get("firstName");
      }
      if (urlParams.has("lastName")) {
          document.getElementById("lastName").value = urlParams.get("lastName");
      }
      if (urlParams.has("email")) {
          document.getElementById("email").value = urlParams.get("email");
      }
      if (urlParams.has("phoneNumber")) {
          document.getElementById("phoneNumber").value = urlParams.get("phoneNumber");
      }
  }
}

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//  hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";


	let tmp = { login:login,
				password:password};
  //tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}




function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}

}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}



function doSignup()
{
	firstName = document.getElementById("firstName").value;
	lastName = document.getElementById("lastName").value;

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;


	let tmp = {
				firstName:firstName,
				lastName:lastName,
				login: login,
				password: password};

	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddUser.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				window.location.href = "index.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("signUpResult").innerHTML = err.message;
	}
	
}

function searchContact()
{
	var firstName = document.getElementById("searchaddFirstName").value;
  var lastName = document.getElementById("searchaddLastName").value;
  var email = document.getElementById("searchaddEmail").value;
  var phoneNumber = document.getElementById("searchaddPhone").value;
	

	let contactList = "";
  readCookie();

	let tmp = { firstName:firstName,
              lastName:lastName,
              email:email,
              phoneNumber:phoneNumber,
              id:userId
             };

	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                let tableContent = '<tr><th>First Name</th><th>Last Name</th><th>Email</th><th>Phone Number</th></tr>';
                for (let i = 0; i < jsonObject.results.length; i++) {
                    tableContent += `<tr>
                      <td>${jsonObject.results[i].FirstName}</td>
                      <td>${jsonObject.results[i].LastName}</td>
                      <td>${jsonObject.results[i].Email}</td>
                      <td>${jsonObject.results[i].PhoneNumber}</td>
                      <td><a href="#" onclick="loadContactPage('${jsonObject.results[i].FirstName}','${jsonObject.results[i].LastName}','${jsonObject.results[i].Email}','${jsonObject.results[i].PhoneNumber}','${jsonObject.results[i].ID}')">Edit</a></td>
                      <td><button class="btn btn-danger" onclick="deleteContact(${jsonObject.results[i].ID})">Delete</button></td>
                      
                    </tr>`
                }

                document.getElementById("contactTable").innerHTML = tableContent;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactSearchResult").innerHTML = err.message;
    }
}

function loadContactPage(FirstName, LastName, Email, PhoneNumber, ID) {
    const queryParams = `?firstName=${encodeURIComponent(FirstName)}&lastName=${encodeURIComponent(LastName)}&email=${encodeURIComponent(Email)}&phoneNumber=${encodeURIComponent(PhoneNumber)}&id=${encodeURIComponent(ID)}`;
    window.location.href = "editContact.html" + queryParams;
}
  
function submitEditContact() {
    const url = urlBase + '/UpdateContacts.' + extension;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const phoneNumber = document.getElementById("phoneNumber").value;

    const urlParams = new URLSearchParams(window.location.search);
  
    const tmp = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        id: urlParams.get("id")
    };

    const jsonPayload = JSON.stringify(tmp);

   
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                window.location.href = "contacts.html";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        window.alert(err);
    }
}

function getAllContacts()
{
	var firstName = "";
  var lastName = "";
  var email = "";
  var phoneNumber = "";
	

	let contactList = "";
  readCookie();

	let tmp = { firstName:firstName,
              lastName:lastName,
              email:email,
              phoneNumber:phoneNumber,
              id:userId
             };

	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                let tableContent = '<tr><th>First Name</th><th>Last Name</th><th>Email</th><th>Phone Number</th></tr><th></th><th></th>';
                
                if (typeof jsonObject.results !== 'undefined') {
 
                  for (let i = 0; i < jsonObject.results.length; i++) {
                      tableContent += `<tr>
                        <td>${jsonObject.results[i].FirstName}</td>
                        <td>${jsonObject.results[i].LastName}</td>
                        <td>${jsonObject.results[i].Email}</td>
                        <td>${jsonObject.results[i].PhoneNumber}</td>
                        <td><a href="#" onclick="loadContactPage('${jsonObject.results[i].FirstName}','${jsonObject.results[i].LastName}','${jsonObject.results[i].Email}','${jsonObject.results[i].PhoneNumber}','${jsonObject.results[i].ID}')">Edit</a></td>
                        <td><button class="btn btn-danger" onclick="deleteContact(${jsonObject.results[i].ID})">Delete</button></td>
                     
                      </tr>`
                  }
                 }

                document.getElementById("contactTable").innerHTML = tableContent;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactSearchResult").innerHTML = err.message;
    }
	
}

function addContact(){
  var firstName = document.getElementById("searchaddFirstName").value;
  var lastName = document.getElementById("searchaddLastName").value;
  var email = document.getElementById("searchaddEmail").value;
  var phoneNumber = document.getElementById("searchaddPhone").value;
  
  let tmp = { firstName:firstName,
              lastName:lastName,
              email:email,
              phoneNumber:phoneNumber,
              id:userId
             };
             
  let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
 
  try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                getAllContacts();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactSearchResult").innerHTML = err.message;
    }
}

function deleteContact(ID)
{
	let tmp = { id: ID };
			   
	let jsonPayload = JSON.stringify( tmp );
  
	  let url = urlBase + '/DeleteContacts.' + extension;
	  
	  let xhr = new XMLHttpRequest();
	  xhr.open("DELETE", url, true);
	  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
   
	try {
		  xhr.onreadystatechange = function() {
			  if (this.readyState == 4 && this.status == 200) {
				  getAllContacts();
			  }
		  };
		  xhr.send(jsonPayload);
	  } catch (err) {
		  document.getElementById("contactSearchResult").innerHTML = err.message;
	  }
  }
