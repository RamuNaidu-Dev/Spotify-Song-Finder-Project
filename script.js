
const clientId = 'b7bf5a377dfc4d62a412dbbbbad9cdfa';  
const clientSecret = 'cde9c689a3584d2f857081d10414ecb9';

// Function to fetch the Spotify Access Token
async function fetchAccessToken() {
    let tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: new URLSearchParams({
            'grant_type': 'client_credentials'
        })
    });

    let tokenData = await tokenResponse.json();
    return tokenData.access_token; // Access token is a special code that allows your application to interact with the Spotify API
}

// Function to fetch search results from Spotify API
async function fetchSpotifyData(query) {
    let token = await fetchAccessToken();
    const apiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,album,artist,playlist&limit=10`;
    let apiResponse = await fetch(apiUrl, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const apiData = await apiResponse.json();
    displaySearchResults(apiData);
}

// Function to display search results
function displaySearchResults(data) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = " "; // Clearing the previous results

    // Getting the required results
    const tracks = data.tracks.items;

    tracks.forEach(track => {
        const card = document.createElement('div');
        card.classList.add("result-card");

        // For Album images
        const albumImage = track.album.images[0].url;
        const trackName = track.name;
        const artistName = track.artists.map(artist => artist.name);

        card.innerHTML = `
            <img src="${albumImage}" alt="${trackName}">
            <div class="result-card-body">
                <h5>${trackName}</h5>
                <h3>${artistName}</h3> 
            </div> `; 

        resultsContainer.appendChild(card);
    });
}

// Event listener for search button
let x = document.getElementById('search-btn');
x.addEventListener('click', () => {
    const query = document.getElementById('search-place').value;
    if (query.trim() !== " ") {
        fetchSpotifyData(query);
    }
});
