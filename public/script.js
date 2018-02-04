// $("#btn").click(function(){
// debugger; radi sa debugger-om ne radi bez
//   var itemData = {
//       "naziv": $('#name').val(),
//       "godina": $('#year').val(),
//       "slika": $('#img').val()
//   };

//   $.ajax({
//     type: "POST",
//     url: "https://baza-filmova.herokuapp.com/dodaj/",
//     data: JSON.stringify(itemData),
//     contentType: "application/json; charset=utf-8",
//     error: function () {
//         console.log("error");
//     },
//     success: function () {

//       console.log("success");
//     }

//   });
//   wrapp.insertAdjacentHTML('beforeend', html);
// });


//------Ubacivanje filmova u bazu----------

const forma = document.querySelector('form');
const {naziv, godina, slika} = forma.elements;

forma.addEventListener('submit', function (e) {
  e.preventDefault();

  const html = `
    <h3>${naziv.value}</h3>
    <p>Godina: ${godina.value}</p>
    <img src="${slika.value}" alt="${naziv.value}">
  `
  const http = new XMLHttpRequest()
  http.open('POST', 'http://baza-podataka.herokuapp.com/dodaj/')
  http.setRequestHeader('Content-type', 'application/json')
  http.onload = () => console.log(http.responseText)
  http.send(JSON.stringify({'naziv': naziv.value, 'godina': godina.value, 'slika': slika.value}))

  wrapp.insertAdjacentHTML('beforeend', html);

})

//--------Ucitavanje filmova iz baze-----------

const wrapp = document.getElementById('wrapp');
let text = "";


function loadMovies(){
  const xHttp = new XMLHttpRequest();
  
  xHttp.open('GET', 'http://localhost:3000/filmovi');

  xHttp.onload = function(){
    if(this.status == 200){
      data(xHttp);
    }else if(this.status == 404){
      wrapp.innerHTML = "Not Found";
    }
  }
  
  xHttp.onerror = function(){
    console.log('Request error');
  }
  
  xHttp.send();
}

function data(dataJson){
  let allData = JSON.parse(dataJson.responseText);
  allData.forEach(function(e, i){
    text += `<div id='box'>
              <p>${e.naziv}</p>
              <p>${e.godina}</p>
              <img class='img' src='${e.slika}' />
            </div>`
  });
  
  wrapp.insertAdjacentHTML('beforeend', text);
}

window.onload = loadMovies();

//--------WebSockets----------
var socket = new WebSocket('ws://baza-podataka.herokuapp.com');

socket.addEventListener('message', e =>{
  console.log("Server javlja: " + e.data);
});
