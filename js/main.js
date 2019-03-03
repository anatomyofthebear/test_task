let request = new XMLHttpRequest();
let apiUrl = "https://api.randomuser.me/1.0/?results=50&nat=gb,us&inc=gender,name,location,email,phone,picture";
let usersObjects = [];
let popup = document.querySelector('.popup');

class User {
    constructor(name, gender, email, phone, picture, location){
        this.name = name;
        this.gender = gender;
        this.email = email;
        this.phone = phone;
        this.picture = picture;
        this.location = location;
    }

    getFirstName(){
        return this.name.first;
    }

    getSecondName(){
        return this.name.last;
    }

    getFullName(){
        return `${this.name.title}. ${this.getFirstName()} ${this.getSecondName()}`;
    }

    getFullAddress(){
        return `${this.location.postcode}, ${this.location.state}, ${this.location.city}, ${this.location.street}`;
    }

    getPicture(size="medium"){
        return this.picture[size];
    }

    addToDOM(userKey){
        let usersDiv = document.querySelector('.users');
        let usersItemDiv = document.createElement('div');
        let usersItemPictureDiv = document.createElement('div');
        let usersItemNameDiv = document.createElement('div');
        let usersItemButtonDiv = document.createElement('div');
        let buttonDiv = document.createElement('div');

        buttonDiv.id = userKey;
        
        usersItemDiv.classList.add('users__item');
        usersItemPictureDiv.classList.add('users__item__picture');
        usersItemNameDiv.classList.add('users__item__name');
        usersItemButtonDiv.classList.add('users__item__button');
        buttonDiv.classList.add('btn');
        buttonDiv.innerText = "Show info";
        
        usersItemPictureDiv.innerHTML = `<img src="${this.getPicture()}" alt="avatar">`;
        usersItemNameDiv.innerText = this.getFullName();

        usersItemDiv.appendChild(usersItemPictureDiv);
        usersItemDiv.appendChild(usersItemNameDiv);
        usersItemButtonDiv.appendChild(buttonDiv);
        usersItemDiv.appendChild(usersItemButtonDiv);
        usersDiv.appendChild(usersItemDiv);
        
    }
}

request.open("GET", apiUrl, false);
request.send();

if (request.status != 200) {
    console.log("ошибка");
} else {
    let responseText = JSON.parse(request.responseText);
    let userList = responseText.results;

    for(let key in userList) {
        let user = new User(userList[key].name, userList[key].gender, userList[key].email, 
            userList[key].phone, userList[key].picture, userList[key].location); 
        usersObjects.push(user); 
    }
    
    usersObjects.forEach(function(item, key){
        item.addToDOM(key);
    });
}

function showUserInfo(user){
    let userCardPicture = popup.querySelector('.user-card__picture');
    let userCardInfo = popup.querySelector('.user-card__info ul');

    userCardPicture.innerHTML = "";
    userCardPicture.innerHTML = `<img src="${user.getPicture('large')}" alt="">`;
    
    let address = document.createElement('li');
    let email = document.createElement('li');
    let phone = document.createElement('li');
    address.innerText = `Address: ${user.getFullAddress()}`;
    email.innerText = `Email: ${user.email}`;
    phone.innerText = `Phone: ${user.phone}`;

    userCardInfo.innerHTML = "";
    userCardInfo.appendChild(email);
    userCardInfo.appendChild(phone);
    userCardInfo.appendChild(address);

    popup.style.display = 'block';

}

document.addEventListener('click', function(event){
    let clickElement = event.target;
    if(!clickElement.classList.contains('btn')){
        return false;
    }
    
    let user = usersObjects[clickElement.id];
    showUserInfo(user);
    
});

let popupClose = popup.querySelector('.popup--close'); 
popupClose.addEventListener('click', function(){
    popup.style.display = 'none';
});

let sortMethod = document.querySelector('.header__sort__method');
let sortBy = document.querySelector('.header__sort__by');

sortMethod.addEventListener('change', function(){
    sortEvent();
});
sortBy.addEventListener('change', function(){
    sortEvent();
});

function sortEvent(){
    if(sortMethod.value == "0") {
        return false;
    } else {
        let usersDiv = document.querySelector(".users");
        usersSort(sortBy.value, sortMethod.value);
        usersDiv.innerHTML = "";
        usersObjects.forEach(function(item, key){
            item.addToDOM(key);
        });
    }
}

function usersSort(sortField, sortMethod){
    let fieldOne;
    let fieldTwo;
    let compare;

    usersObjects.sort(function(userOne, userTwo){
    
        if (sortField == "firstName"){
            fieldOne = userOne.getFirstName();
            fieldTwo = userTwo.getFirstName();
        } else {
            fieldOne = userOne.getSecondName();
            fieldTwo = userTwo.getSecondName();
        }
    
        compare = sortMethod == "asc" ? fieldOne >= fieldTwo : fieldOne <= fieldTwo;
        return compare ? 1 : -1 ;
    });
}
