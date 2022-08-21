let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

//Pick out the div to contain the toy cards
const toyContainer = document.querySelector('#toy-collection');

//Create the cards for the existing toys
const oldToyFetch = fetch('http://localhost:3000/toys')
  .then((response) => response.json())
  .then(function(data) {
    //cycle through the toys in the data, making a card for each
    for(let i = 0; i < data.length; i++) {
      makeCard(data[i]);
    }
  });

//Add a new toy card from form
const newToyForm = document.querySelector('form');

newToyForm.addEventListener('submit', function(e) {
  e.preventDefault();
  let newToyName = document.getElementsByClassName('input-text')[0].value;
  let newToyImg = document.getElementsByClassName('input-text')[1].value;

  const postObj = {
    'method': 'POST',
    'headers': {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    'body': JSON.stringify({
      "name": `${newToyName}`,
      "image": `${newToyImg}`,
      "likes": 0
    })
  }
  const newToyFetch = fetch('http://localhost:3000/toys', postObj)
  .then((response) => response.json())
  .then((data) => {
    makeCard(data);
    likeAssign();
    newToyForm.reset();
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});

//Make card
function makeCard(thisToy) {

  //create the card element and pick out the current toy
  const card = document.createElement('div');
  card.classList.add('card');
  
  //build the card elements
  const toyName = document.createElement('h2');
  const toyImg = document.createElement('img');
  const toyLikes = document.createElement('p');
  const likeBtn = document.createElement('button');
  
  //build the card element properties/values/etc.
  toyName.textContent = `${thisToy.name}`;
  toyImg.src = `${thisToy.image}`;
  toyImg.classList.add('toy-avatar');
  toyLikes.textContent = `${thisToy.likes} Likes`;
  likeBtn.classList.add("like-btn");
  likeBtn.textContent = 'Like ❤️';

  //build the card
  card.appendChild(toyName);
  card.appendChild(toyImg);
  card.appendChild(toyLikes);
  card.appendChild(likeBtn);

  //append the card
  toyContainer.append(card);
};

//Like button functionality
function likeAssign() {
  const toyBtns = document.getElementsByClassName('like-btn');
  for(let i = 0; i < toyBtns.length; i++) { 
    let likeCount = 0;
    toyBtns[i].addEventListener('click', function () {
      fetch(`http://localhost:3000/toys/${i + 1}`)
      .then((response) => response.json())
      .then((data) => {
        likeCount = data.likes;
      
      fetch(`http://localhost:3000/toys/${i + 1}`, {
        'method': 'PATCH',
        'headers': {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        'body': JSON.stringify({
          "likes": likeCount + 1
        })
      })
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        //console.log(data.likes);
        //console.log(likeBtn.previousSibling);
        toyBtns[i].previousSibling.textContent = `${data.likes} Likes`
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    });
      

    })
  }
  
}

Promise.all([oldToyFetch])
.then(function () {
  likeAssign();
})

/*
fetch(`http://localhost:3000/toys/8`, {
  'method': 'DELETE'
});

fetch(`http://localhost:3000/toys/9`, {
  'method': 'DELETE'
});

fetch(`http://localhost:3000/toys/10`, {
  'method': 'DELETE'
});

fetch(`http://localhost:3000/toys/11`, {
  'method': 'DELETE'
});

fetch(`http://localhost:3000/toys/12`, {
  'method': 'DELETE'
});
*/