const rolls = [];
let currentIndex = 0;
const starWarsWords = [
    "Jedi",
    "Sith",
    "Force",
    "Padawan",
    "Droid",
    "Lightsaber",
    "Blaster",
    "Stormtrooper",
    "Clone",
    "Rebel",
    "Empire",
    "Republic",
    "Senate",
    "Tatooine",
    "Alderaan",
    "Hoth",
    "Dagobah",
    "Endor",
    "Naboo",
    "Coruscant",
    "Mustafar",
    "Jakku",
    "Kashyyyk",
    "Kamino",
    "Mandalore",
    "Death Star",
    "X-wing",
    "TIE",
    "Falcon",
    "Speeder",
    "Wookiee",
    "Ewok",
    "Tusken",
    "Jawas",
    "Hutt",
    "Bounty",
    "Sarlacc",
    "Holocron",
    "Padmé",
    "Anakin",
    "Vader",
    "Palpatine",
    "Yoda",
    "Kenobi",
    "Luke",
    "Leia",
    "Han",
    "Chewbacca",
    "R2-D2",
    "C-3PO",
    "Boba",
    "Jango",
    "Maul",
    "Dooku",
    "Grievous",
    "Snoke",
    "Rey",
    "Finn",
    "Poe",
    "Kylo",
    "Phasma",
    "Holdo",
    "Rose",
    "Lando",
    "Mace",
    "Windu",
    "Qui-Gon",
    "Jinn",
    "Shaak",
    "Ti",
    "Ahsoka",
    "Ventress",
    "Savage",
    "Oppress",
    "Greedo",
    "Ackbar",
    "Mon",
    "Mothma",
    "Wicket",
    "Bib",
    "Fortuna",
    "Salacious",
    "Crumb",
    "Porg",
    "BB-8",
    "Djarin",
    "Grogu",
    "Bo-Katan",
    "Sabine",
    "Ezra",
    "Thrawn",
    "Chopper",
    "Inquisitor",
    "Rancor",
    "Tauntaun",
    "Bantha",
    "Gungan",
    "Rodian",
    "Togruta",
    "Zabrak"
];

function createCircularStarWarsWordIterator(arr) {
    let index = 0;
    return function () {
        const word = arr[index];
        index = (index + 1) % arr.length;
        return word;
    };
}

const fetchRandomWord = createCircularStarWarsWordIterator(starWarsWords);

// async function fetchRandomWord() {
//     // Replace with actual fetch if needed
//     const response = await fetch('https://random-word-api.herokuapp.com/word?number=1');
//     const data = await response.json();
//     return data[0];
//     // return "HAL AMCA";
// }

async function fetchRollData() {
    let word = await fetchRandomWord();
    const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURI(word)}`
    );
    if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return null;
    }
    const apiResponse = await response.json();
    rolls.push({ word, apiResponse });
}

async function createNewRoll() {
    const roll = document.querySelector(`#container-0`);
    if (roll) {
        const nextIndex = rolls.length - 1;
        const clonedRoll = roll.cloneNode(true);
        clonedRoll.id = `container-${nextIndex}`;
        clonedRoll.querySelector(`#title-0`).id = `title-${nextIndex}`;
        clonedRoll.querySelector(`#summary-0`).id = `summary-${nextIndex}`;
        document.querySelector('#outer-container').appendChild(clonedRoll);
        setTextAndBackground(nextIndex);
        document.querySelector(`#container-${nextIndex}`).scrollIntoView({
            behavior: 'smooth'
        });
    }
}

function setTextAndBackground(cardIndex) {
    const { word, apiResponse } = rolls[cardIndex];
    const titleElement = document.getElementById(`title-${cardIndex}`);
    const summaryElement = document.getElementById(`summary-${cardIndex}`);
    const containerElement = document.getElementById(`container-${cardIndex}`);
    if (!word) {
        titleElement.textContent = "Unknown";
        summaryElement.textContent = "...";
        return;
    }
    titleElement.textContent = word.slice(0, 250);
    titleElement.href = `https://en.wikipedia.org/wiki/${encodeURI(word)}`;
    let extract = apiResponse ? apiResponse.extract : "...";
    summaryElement.textContent = extract.length > 250 ? extract.slice(0, 250) + "..." : extract;
    summaryElement.dataset.extract = extract;
    summaryElement.onclick = () => {
        summaryElement.textContent = summaryElement.dataset.extract;
        summaryElement.style.cursor = "default";
        summaryElement.onclick = null;
    };
    const bg = apiResponse?.originalimage?.source ?? "https://upload.wikimedia.org/wikipedia/commons/2/25/AMCA_model_displayed_during_Aero_India_2021.jpg";
    containerElement.style.backgroundImage = `linear-gradient(#181818A1 30%, #181818FF 70%), url("${bg}")`;
}

async function displayWordAndRoll(index) {
    if (index >= rolls.length) {
        console.error("Index out of bounds:", index);
        return;
    }
    setTextAndBackground(index);
}

document.addEventListener("DOMContentLoaded", async () => {
    await fetchRollData()
    setTextAndBackground(0)
});

document.addEventListener("keydown", async (e) => {
    if (e.code === "ArrowDown") {
        handleSwipeUp();
        // if (currentIndex == rolls.length - 1) {
        //     currentIndex++;
        //     await fetchRollData()
        //     console.log(rolls)
        //     await createNewRoll()
        // } else {
        //     currentIndex++;
        //     setTextAndBackground(currentIndex);
        //     document.querySelector(`#container-${currentIndex}`).scrollIntoView({
        //         behavior: 'smooth'
        //     });
        // }
    } else if (e.code === "ArrowUp") {
        handleSwipeDown();
        // if (currentIndex == 0) return;
        // currentIndex--;
        // setTextAndBackground(currentIndex);
        // document.querySelector(`#container-${currentIndex}`).scrollIntoView({
        //     behavior: 'smooth'
        // });
    }
});

let initialY = null;
const SWIPE_THRESHOLD = 50;

function startTouch(e) {
    initialY = e.touches[0].clientY;
}

function moveTouch(e) {
    if (initialY === null) {
        return;
    }
    const currentY = e.touches[0].clientY;
    const diffY = initialY - currentY;

    if (Math.abs(diffY) > SWIPE_THRESHOLD) {
        if (diffY > 0) {
            handleSwipeUp();
        } else {
            handleSwipeDown();
        }
        initialY = null; // Reset the initial touch position
    }
}

function handleSwipeUp() {
    if (currentIndex == rolls.length - 1) {
        currentIndex++;
        fetchRollData().then(() => {
            console.log(rolls);
            createNewRoll();
        });
    } else {
        currentIndex++;
        setTextAndBackground(currentIndex);
        document.querySelector(`#container-${currentIndex}`).scrollIntoView({
            behavior: 'smooth'
        });
    }
}

function handleSwipeDown() {
    if (currentIndex == 0) return;
    currentIndex--;
    setTextAndBackground(currentIndex);
    document.querySelector(`#container-${currentIndex}`).scrollIntoView({
        behavior: 'smooth'
    });
}

document.addEventListener('touchstart', startTouch, false);
document.addEventListener('touchmove', moveTouch, false);
