// VARIABLES/CONSTANTS
var characterImage = document.querySelector("#character-image");
var characterBio = document.querySelector("#character-bio");
var characterComics = document.querySelector("#character-comics");
var characterSearch = document.getElementById("search-value");
var characterArray = [];
var searchHistory = $("#search-history");
var youTubeKey = "AIzaSyDZONkiNXFI1rDaXM5MqVm9EN-UWUf2-jU";
const modal = document.querySelector("#my-modal");
const modalBtn = document.querySelector("#modal-btn");
const closeBtn = document.querySelector(".close");


//FUNCTIONS

// store in local storage
function storageSet() {
  characterArray.push(characterName);
  localStorage.setItem("charactername", JSON.stringify(characterArray));
}

// get from local storage and append to html on initial load
function onLoad() {
  if (localStorage.getItem("charactername") != "") {
    var characterStore = JSON.parse(localStorage.getItem("charactername"));
    if (characterStore != null) {
      for (var i = 0; i < characterStore.length; i++) {
        var btn = $("<button>");
        var lineBreak = $("li");
        btn.addClass("searchAgain");
        btn.text(characterStore[i]);
        searchHistory.append(btn);
        searchHistory.append(lineBreak);
        // btn.on("click", function (event) {
        //   characterName = event.target.textContent;
        //   //youTubeVideo();
        //   getAPI(characterName, renderCharacter);

        // });
      }
    }
  }
}
//append each new search results to html
function onClick() {
  $("#character-image").removeClass("hidden");
  $("#character-bio").removeClass("hidden");
  $("#character-comics").removeClass("hidden");
  $("#search-history").removeClass("hidden");
  $("#marvel-image").addClass("hidden");
  $("#modal").removeClass("hidden");
  if (localStorage.getItem("charactername") != "") {
    var characterStore = JSON.parse(localStorage.getItem("charactername"));
    if (characterStore != null) {
      var btn = $("<button>");
      btn.text(characterStore[characterStore.length - 1]);
      btn.addClass("searchAgain");
      var lineBreak = $("li");
      searchHistory.append(btn);
      searchHistory.append(lineBreak);
      //btn.on("click", function (event) {
        //characterName = event.target.textContent;
        //youTubeVideo();
        //getAPI(characterName, renderCharacter);
        //characterBio.innerHTML = " ";
      //});
    }
  }
}
//Character name Search
function searchCharacter() {
  characterName = characterSearch.value;
  getAPI(characterName, renderCharacter);
  youTubeVideo();
  storageSet();
  onClick();
  characterBio.innerHTML = " ";
}

// youTube Character movie trailer
function youTubeVideo() {
  var youTubeAPIurl =
    "https://youtube.googleapis.com/youtube/v3/search?channelId=UCvC4D8onUfXzvjTOM-dBfEA&q=" +
    characterName +
    "%20Movie%20Trailer&key=" +
    youTubeKey;
  fetch(youTubeAPIurl)
    .then(function (response) {
      console.log(response);
      if (response.status != 200) {
        var videoSRC = "https://www.youtube.com/embed/TcMBFSGVi1c";
        document.getElementById("video").src = videoSRC;
      } 
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var i = Math.floor(Math.random() * data.items.length);
      //console.log(i);
      var videoID = data.items[i].id.videoId;
      //console.log(videoID);
      var videoSRC = "https://www.youtube.com/embed/" + videoID;
      document.getElementById("video").src = videoSRC;
    });
}
// connect to Marvel API
function getAPI(name, callback) {
  var ts = Date.now();
  //console.log(ts);
  fetch(
    "https://gateway.marvel.com:443/v1/public/characters?name=" +
    name +
    "&apikey=22cb76a0a50613bcff0104d06cd9ec76",
    {
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    }
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      callback(data);
    });
}

// Character info pull from Marvel API
function renderCharacter(apiData) {
  //console.log(apiData);
  //console.log(apiData.data.results);
  //console.log(apiData.data.results[0].description);
  characterBio = apiData.data.results[0].description;
  characterImage = apiData.data.results[0].thumbnail.path;
  //console.log(characterImage);
  characterImageExt = apiData.data.results[0].thumbnail.extension;
  //console.log(characterImageExt);
  //console.log(characterImage);
  characterImageExt = apiData.data.results[0].thumbnail.extension;
  //console.log(characterImageExt);
  if (characterImage == null) {
    characterImage.textContent = "Image unavailable";
  } else {
    $(
      `
              <div>
               <img id="char-image" src="${characterImage}.${characterImageExt}">
              </div>
            `
    ).appendTo("#character-image");
  }
  if (characterBio == " " || null) {
    characterBio.textContent = "Bio unavailable";
  } else {
    $(
      `
          <div>
            <p id="apiBio">${characterBio}</p>
          </div>
        `
    ).appendTo("#character-bio");
  }
  if (characterComics == null) {
    characterComics.textContent = " Comics unavailable";
  } else {
    //console.log(characterComics);
    for (var i = 0; i < apiData.data.results[0].comics.items.length; i++) {
      var addComic = apiData.data.results[0].comics.items[i].name;
      var newPara = document.createElement("li");
      //console.log(addComic);
      console.log(characterComics);
      for (var i = 0; i < apiData.data.results[0].comics.items.length; i++) {
        var addComic = apiData.data.results[0].comics.items[i].name;
        var newPara = document.createElement("li");
        console.log(addComic);
        $(`
            <div class="comic-list">
              <p class="c-issue"><strong>${addComic}</strong></p>
            </div>
          `).appendTo("#character-comics");
      }
    }
  }
}

// Open
function openModal() {
  modal.style.display = "block";
}

// Close Modal
function closeModal() {
  modal.style.display = "none";
}


// Close If Outside Click Modal
function outsideClick(e) {
  if (e.target == modal) {
    modal.style.display = "none";
  }
}

// EVENTS
//Modal clicks
modalBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
window.addEventListener("click", outsideClick);
// search button click
searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  searchCharacter();
  $("#search-value").val("");
  characterSearch.textContent = " ";
  $("#character-image").empty();
  $("#character-bio").empty();
  $("#character-comics").empty();
});

// FUNCTION CALLS
// Loads search history on page load
onLoad();

