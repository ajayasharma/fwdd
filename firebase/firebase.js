// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBC0k9VcwYUsc1CQ5yIGnVDKASXy1PmfX0",
  authDomain: "my-website-2535a.firebaseapp.com",
  databaseURL: "https://my-website-2535a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "my-website-2535a",
  storageBucket: "my-website-2535a.appspot.com",
  messagingSenderId: "499690916091",
  appId: "1:499690916091:web:16b5982ad5ad71c63cc85e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log('firebase initialized');
// Get databsae reference
var database = firebase.database();
console.log(database);

// Select the html element where data will be displayed
var dataContainer = document.querySelector('tbody'); // document.getElementById('mydata')
// Set ther reference to the collection
var fetchedData = database.ref('details/');

fetchedData.on('value', (snapshot) => {
  var data = snapshot.val();
  // set the data in the table
  var htmlData = '';
  for(var key in data){
    var value = data[key];
    htmlData += `
      <tr>
        <td>${value.name}</td>
        <td>${value.email}</td>
        <td>${value.message}</td>
        <td>
          <button onClick="readyForUpdate('${key}', this)">Update</button>
          <button onClick="removeMessage('${key}')">Delete</button>
        </td>
      </tr>
    `;
  }
  dataContainer.innerHTML = htmlData;
});

function removeMessage(uniqueId){
  database.ref('details/' + uniqueId).remove();
}

function readyForUpdate(uniqueId, elem){
  var siblingTd = elem.parentElement.parentElement.getElementsByTagName('td');
  for(var i=0; i<siblingTd.length-1; ++i)
  {
    siblingTd[i].contentEditable = true;
    siblingTd[i].classList.add('temp-update-class')
  }
  elem.setAttribute('onclick', `updateNow('${uniqueId}')`);
  elem.innerHTML = 'Send';
}

// create UpdateNow Function
function updateNow(uniqueId){
  var contactId = document.querySelectorAll('.temp-update-class');
  // now create obj using same keys as used during sending
  var obj = {
    'name': contactId[0].textContent,
    'email': contactId[1].textContent,
    'message': contactId[2].textContent
  };
  // create the reference first where data will be updated
  var listRef = database.ref('details/'+uniqueId);
  // update the data
  listRef.update(obj);
  // data will be rendered automatically
}

function saveData(){
  //e.preventDefault();
  var name=document.getElementById('name');
  var email=document.getElementById('email');
  var message=document.getElementById('message');
  console.log('parameters set');

  // get the reference to store the data
  var listRef = database.ref('details/');
  // push will generate a unique id
  var newRef = listRef.push()
  newRef.set({
    'name': name.value,
    'email': email.value,
    'message': message.value
  })
}