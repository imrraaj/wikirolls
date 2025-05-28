let currentRoll = 1; // Start with card 1 as active
let rolls = []; // Stores { word, apiResponse }
const NUM_CARDS = 3; // Always 3 cards in DOM

async function fetchRandomWord() {
    // Replace with actual fetch if needed
    const response = await fetch('https://random-word-api.herokuapp.com/word?number=1');
    const data = await response.json();
    return data[0];
    // return "HAL AMCA";
}

async function fetchNextRoll(word) {
    const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURI(word)}`
    );
    if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return null;
    }
    const data = await response.json();
    return data;
}

async function displayWordAndRoll(index, word, apiResponse) {
    const titleElement = document.getElementById(`title-${index}`);
    const summaryElement = document.getElementById(`summary-${index}`);
    const containerElement = document.getElementById(`container-${index}`);
    if (!word) {
        titleElement.textContent = "Unknown";
        summaryElement.textContent = "...";
        return;
    }
    titleElement.textContent = word;
    summaryElement.textContent = apiResponse ? apiResponse.extract : "...";
    containerElement.style.backgroundImage = `url(${apiResponse?.originalimage?.source || "default-image.jpg"})`;
}

async function prepareInitialCards() {
    // Prepare 3 containers
    const outer = document.getElementById("outer-container");
    const containerZero = document.querySelector("#container-0");
    for (let i = 1; i < NUM_CARDS; ++i) {
        const newContainer = containerZero.cloneNode(true);
        newContainer.id = `container-${i}`;
        newContainer.querySelector("#title-0").id = `title-${i}`;
        newContainer.querySelector("#summary-0").id = `summary-${i}`;
        outer.appendChild(newContainer);
    }
    // Fetch initial rolls
    for (let i = 0; i < NUM_CARDS; ++i) {
        const word = await fetchRandomWord();
        const apiResponse = await fetchNextRoll(word);
        rolls[i] = { word, apiResponse };
        await displayWordAndRoll(i, word, apiResponse);
    }
}

async function shiftCards(direction) {
    if (direction === "down") {
        // Remove card 0 from DOM, shift cards left, add new card at end
        document.getElementById(`container-0`).remove();
        rolls.shift();
        // Create new card
        const outer = document.getElementById("outer-container");
        const newIndex = NUM_CARDS - 1;
        const newContainer = document.createElement("div");
        newContainer.className = "card";
        newContainer.id = `container-${newIndex}`;
        newContainer.innerHTML = `
            <h2 id="title-${newIndex}"></h2>
            <p id="summary-${newIndex}"></p>
        `;
        outer.appendChild(newContainer);

        // Fetch new word/data
        const word = await fetchRandomWord();
        const apiResponse = await fetchNextRoll(word);
        rolls.push({ word, apiResponse });
        await displayWordAndRoll(newIndex, word, apiResponse);

        // Reassign IDs for all containers/titles/summaries
        for (let i = 0; i < NUM_CARDS; ++i) {
            const card = outer.children[i];
            card.id = `container-${i}`;
            card.querySelector("h2").id = `title-${i}`;
            card.querySelector("p").id = `summary-${i}`;
            await displayWordAndRoll(i, rolls[i].word, rolls[i].apiResponse);
        }
    } else if (direction === "up") {
        // Remove last card, shift cards right, add new card at start
        document.getElementById(`container-${NUM_CARDS - 1}`).remove();
        rolls.pop();
        // Create new card at start
        const outer = document.getElementById("outer-container");
        const newContainer = document.createElement("div");
        newContainer.className = "card";
        newContainer.id = `container-0`;
        newContainer.innerHTML = `
            <h2 id="title-0"></h2>
            <p id="summary-0"></p>
        `;
        outer.prepend(newContainer);

        // Fetch new word/data
        const word = await fetchRandomWord();
        const apiResponse = await fetchNextRoll(word);
        rolls.unshift({ word, apiResponse });
        await displayWordAndRoll(0, word, apiResponse);

        // Reassign IDs for all containers/titles/summaries
        for (let i = 0; i < NUM_CARDS; ++i) {
            const card = outer.children[i];
            card.id = `container-${i}`;
            card.querySelector("h2").id = `title-${i}`;
            card.querySelector("p").id = `summary-${i}`;
            await displayWordAndRoll(i, rolls[i].word, rolls[i].apiResponse);
        }
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await prepareInitialCards();
});

document.addEventListener("keydown", async (e) => {
    if (e.code === "ArrowDown") {
        await shiftCards("down");
    }
    if (e.code === "ArrowUp") {
        await shiftCards("up");
    }
});

// Optional: Touch events for mobile
document.addEventListener("touchstart", async (e) => {
    // Implement swipe detection here if needed
});
