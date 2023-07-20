let count = 0;
let boosterCards = [
    'rarity:rare',  
    'rarity:common t:basic',
    'rarity:uncommon',
    'rarity:uncommon',
    'rarity:uncommon',
    'rarity:common',
    'rarity:common',
    'rarity:common',
    'rarity:common',
    'rarity:common',
    'rarity:common',
    'rarity:common',
    'rarity:common',
    'rarity:common',
    'rarity:common'
]
let cardList = [];

const cardsWrapper = document.querySelector(".cards-template");
const counterElement = document.querySelector(".counter");
counterElement.innerHTML = count;

const createCardDetails = (card) =>{
    const cardDetails = `
    <div>
        <p class="name">${card?.name}</p>
        <p class="attributes">
            <span class="power">${card?.power || "--"}</span> /
            <span class="toughness">${card?.toughness || "--"}</span>
        </p>
        <p class="rarity">${card?.rarity}</p>
    </div>
    <div class="btn-wrapper">
        <button class="add-deck">+</button>
    </div>
    <p class="type">${card?.type_line}</p>
    `;

const element = document.createElement("div");
element.classList.add("card-details");
element.innerHTML = cardDetails;

return element;
};


const createCard = (index) => {
    const content = `
    <div class="card-wrapper-${index} card-element">
        <img class="card" src="./assets/images/mtg_back.png" alt="">
    </div>
    `;

    const _element = document.createElement("article");
    _element.innerHTML = content;

    return _element;
    
}

const initializeCards = () => {
    boosterCards.forEach ((_query, index) =>{
        const element = createCard(index);
        cardsWrapper.appendChild(element);
    })
};

initializeCards();


const fetchMagicCards = async (params) => {
    let data = null;

    try {
        const response = await fetch(`https://api.scryfall.com/cards/random?q=${params}`,  {
        });
        if(response.ok){
            data = await response.json();
            cardList.push(data);
        }
    } catch (error){
        console.log(error);
        console.error("Ups! Ocurrió un error");
    } finally {
        return data;
    }
};

let getBoosterBtn = document.querySelector(".get-booster");
const clearData = document.querySelector(".clear-data");
const saveAll = document.querySelector(".save-all")


const getCards = async () => {
    for (let i = 0; i < boosterCards.length; i++ ){
        const query = boosterCards[i];

        const card = await fetchMagicCards(query);

        const element = cardsWrapper.querySelector(`.card-wrapper-${i}`);
        const imageElement = element.querySelector("img");
        
        const cardDetails = element.querySelector(".card-details");
        if(cardDetails !== null){
            cardDetails.remove();
        }

        element.prepend(createCardDetails(card));
        imageElement.src = card.image_uris.normal;

        const addDeckBtn = element.querySelector(".add-deck");
        addDeckBtn.addEventListener("click", () => {
            addToDeck(card);
        });
    }
};


getBoosterBtn.addEventListener("click", async (e)=>{
    try {
        getBoosterBtn.setAttribute("disabled", true);
        clearData.setAttribute("disabled", true);

        count += 1;
        counterElement.innerHTML = count;
    
        if(count % 4 === 0){
            boosterCards[0] = "rarity:mythic"
        } else {
            boosterCards[0] = "rarity:rare"
        }
    
        await getCards();
    } catch (e) {
        console.error("Error")
    }finally{
        getBoosterBtn.removeAttribute("disabled");
        clearData.removeAttribute("disabled");
    }
});

//clear data


clearData.addEventListener("click", (e) => {
    count = 0;
    counterElement.innerHTML = count;
    cardList = [];
    cardsWrapper.innerHTML = "";
    initializeCards();
});

//save all cards

saveAll.addEventListener("click", (e) => {
    cardList.forEach(card => {
        addToDeck(card);
    })
})


//add to deck

let deck = {};


const deckWrapper = document.querySelector(".deck-contenedor");
const localStorageKey = "deck";

const createDeckCardElement = (card) =>{
    const cardDetails = `
    <div>
        <p class="name">${card?.name}</p>
        <p class="attributes">
            <span class="power">${card?.power || "--"}</span> /
            <span class="toughness">${card?.toughness || "--"}</span>
        </p>
        <p class="rarity">${card?.rarity}</p>
    </div>
    <div class="btn-wrapper">
        <button class="del-card">-</button>
    </div>
    <p class="type">${card?.type_line}</p>
    `;

const element = document.createElement("div");
element.classList.add("card-details");
element.innerHTML = cardDetails;

return element;
};

const createDeckElement = (type, cards) => {
    const typeDeck = `
    <h2 class="type-title">${type}</h2>
    <hr>
    `;
    
    const element = document.createElement("div");
    element.classList.add("cards-template-deck");
    element.innerHTML = typeDeck;
    
    const cardsWrapper = document.createElement("div");
    cardsWrapper.classList.add("cards-wrapper-deck");
    
    cards.forEach((card,index) => {
        const cardElement = createCard(index);
        
        const cardWrapper = cardElement.querySelector(`.card-wrapper-${index}`);
        const imageElement = cardElement.querySelector("img");

        const cardDetails = cardElement.querySelector(".card-details");
        if(cardDetails !== null){
            cardDetails.remove();
        }

        imageElement.src = card.image_uris.normal;

        cardWrapper.prepend(createDeckCardElement(card));
        
        cardsWrapper.appendChild(cardElement);

        const delCardBtn = cardWrapper.querySelector(".del-card");
        delCardBtn.addEventListener("click", () => {
            deleteFromDeck(type, index);
        });
    });
    
    element.appendChild(cardsWrapper);

    return element; 
};

const deleteFromDeck = (type, index) => {
    const deckCard = deckWrapper.querySelector(`.card-wrapper-${index}`);

    deck[type] = deck[type].filter((_card, idx) => idx !== index);

    if(deck[type].length === 0){
        deckCard.parentElement.parentElement.parentElement.remove();
        delete deck[type];
    }

    localStorage.setItem(localStorageKey, JSON.stringify(deck));
    createDeck();
}; 

const createDeck = () => {
    deckWrapper.innerHTML = "";
    // {Creature: [card1, card2], Other: [card1, card2]} -> [Creature, Other]
    Object.keys(deck).forEach((type) => {
        const cards = deck[type];
        deckWrapper.appendChild(createDeckElement(type, cards));
    });
};

const addToDeck = (card) => {
    // Creature -- sjhsjhsjhs -> [Creature, sjhsjhsjhs] -> Creature
    const type  = card.type_line?.split("—")?.[0] || "Other";
    if(deck[type]){
        deck[type].push(card);
    } else {
        deck[type] = [card];
    }

    localStorage.setItem(localStorageKey, JSON.stringify(deck));
    
    createDeck();
};


//local storge

const localStorageDeck = localStorage.getItem(localStorageKey);
if(localStorageDeck){
    deck = JSON.parse(localStorageDeck);
    createDeck();
}

//clear deck

const clearDeckBtn = document.querySelector(".clear-deck");

clearDeckBtn.addEventListener("click", (e) => {
    deck = {};
    localStorage.removeItem(localStorageKey);
    createDeck();
    deckWrapper.innerHTML = `<h1>Sorry :( you don't have cards in your deck</h1>
    <hr>`;
});

