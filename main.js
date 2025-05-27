const titleElement     = document.getElementById("title");
const containerElement = document.getElementById("container");
const summaryElement   = document.getElementById("summary");

async function fetchRandomWord() {
    // const response = await fetch('https://random-word-api.herokuapp.com/word?number=1');
    // if (!response.ok) {
    //     console.error(`HTTP error! status: ${response.status}`);
    //     return null;
    // }
    // const data = await response.json();
    // return data[0];
    return "HAL AMCA";
}

async function fetchNextRoll(word) {
    // const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURI(word)}`);
    if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return null;
    }
    const data = await response.json();
    return data;
}
async function displayWordAndRoll(word, apiResponse) {
    if (!word) {
        titleElement.textContent = "Unknown";
        return;
    }

    titleElement.textContent = word;
    if (!apiResponse) {
        summaryElement.textContent = "...";
        return;
    }
    summaryElement.textContent = apiResponse.extract;
    containerElement.style.backgroundImage = `url(${apiResponse?.originalimage?.source || 'default-image.jpg'})`;
}

document.addEventListener("DOMContentLoaded", async () => {
    // const word = await fetchRandomWord();
    // const apiResponse = await fetchNextRoll(word);
    // displayWordAndRoll(word, apiResponse);
});

document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowDown") {
        alert("previous")
    }
    if (e.code === "ArrowUp") {
        alert("next")
    }
});

document.addEventListener("touchstart", (e) => {
    if (e.code === "ArrowDown") {
        alert("previous")
    }
    if (e.code === "ArrowUp") {
        alert("next")
    }
});
const a = document.querySelector("section");
for(let i = 0; i < 10; ++i) document.querySelector("#outer-container").appendChild(a.cloneNode(true));
