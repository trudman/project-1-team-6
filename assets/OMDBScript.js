// omdb API key and root urls
const omdbApiKey = '&apikey=2e30998b';
const omdbSearchRoot = 'https://www.omdbapi.com/?type=movie&r=json&s=';
const omdbIdRoot = 'https://www.omdbapi.com/?i=';

// establish variable to store user's searched movie
var searchMovie = [];
var searchMovieId = [];
var movies = [];
var movieData = {};
var movieDataStorage = {};

// store the search input and search button elements
var searchButtonEl = document.getElementById('movie-search-button');
var searchBarEl = document.querySelector('#movie-search-input');
var movieCardContainerEl2 = $('#movie-container');
var movieCardContainerEl = document.getElementById('movie-container');
var movieCardEl = document.getElementById('movie-card');
var deleteMovieButton = document.getElementById('close-movie-button');
var deleteMovieButton2 = $('#close-movie-button');

// capture movie search value on enter
searchBarEl.addEventListener("keypress", function(event) {
  if(event.key == 'Enter') {
    searchMovie = $("#movie-search-input").val();
    searchMovie = searchMovie.trim();
    
    if (searchMovie === ''){
      return;
    }
    getSearchCall();
    searchBarEl.value = "";    
    event.preventDefault();
    // location.reload(); 
  }
})

// capture movie search value on click
searchButtonEl.addEventListener("click", function(event) {
    searchMovie = $("#movie-search-input").val();
    searchMovie = searchMovie.trim();
    
    if (searchMovie === ''){
      return;
    }
    getSearchCall();
    searchBarEl.value = "";
    event.preventDefault();
    // location.reload();
})

// fetch OMDB API call and return data
function getSearchCall() {
  var requestUrl = omdbSearchRoot + '*' + searchMovie + '*' + omdbApiKey;

  fetch(requestUrl)
  .then(function(response){
    return response.json();
  })
  .then(function(data) {
    searchData = data;
    searchMovieId = searchData.Search[0].imdbID;

    var requestIdUrl = omdbIdRoot + searchMovieId + omdbApiKey;
    fetch(requestIdUrl)
    .then(function(response){
      return response.json();
    })
    .then(function(data) {
      movieData = data;

      renderMovieData();
    });    
  });
}

// Reads movies from local storage and returns array of movie objects.
// Returns an empty array ([]) if there aren't any movies.
function readMoviesFromStorage() {
  var movies = localStorage.getItem('movies');
  if (movies) {
    movies = JSON.parse(movies);
  } else {
    movies = [];
  }
  return movies;
}

// capture relevant information from the fetch call and display
function renderMovieData() {
  var movieTitle = movieData.Title;
  var movieReleaseDate = movieData.Released;
  var movieGenre = movieData.Genre;
  var movieBoxOffice = movieData.BoxOffice;
  var movieDirector = movieData.Director;
  var movieActors = movieData.Actors;
  var rottenTomatoes = movieData.Ratings[1].Source + ' Score: ' + movieData.Ratings[1].Value;

  movieDataStorage = {
    movieTitle: movieTitle,
    movieReleaseDate: movieReleaseDate,
    movieGenre: movieGenre,
    movieBoxOffice: movieBoxOffice,
    movieDirector: movieDirector,
    movieActors: movieActors,
    rottenTomatoes: rottenTomatoes
  }

  console.log(movieDataStorage);

  if (movies !== null){
    movies.push(movieDataStorage);
  } else {
    movies = [movieDataStorage];
  }
  
  console.log(movieDataStorage);
  moviesToLocalStorage(movies);  
  location.reload();
}

function moviesToLocalStorage(movies) {
  localStorage.setItem('movies', JSON.stringify(movies));
}

function clearLocalStorage() {
  localStorage.clear();
}
// clearLocalStorage();

function init() {
  movieCardContainerEl2.empty();
  movies = JSON.parse(localStorage.getItem("movies"));   
  if (movies !== null) {
    renderMovieCard();
  }
}



function renderMovieCard() {
  console.log(movies);

  for (var i=0; i<movies.length; i++) {
    var newMovieEl = document.createElement('div');
    var closeButtonEl = document.createElement('button');
    var movieImgEl = document.createElement('img');
    var movieDivEl = document.createElement('div');
    var movieTitleEl = document.createElement('h3');
    var movieTitleEl = document.createElement('h3');
    // Create ordered list element
    var listEl = document.createElement("li");
    // Create ordered list items
    var li1 = document.createElement("ul");
    var li2 = document.createElement("ul");
    var li3 = document.createElement("ul");
    var li4 = document.createElement("ul");
  
    newMovieEl.setAttribute('class', 'card bg-dark text-black');
    newMovieEl.setAttribute('id', 'movie-card');
    closeButtonEl.setAttribute('type', 'button');
    closeButtonEl.setAttribute('class', 'btn-close');
    closeButtonEl.setAttribute('aria-label', 'close');
    closeButtonEl.setAttribute('id', 'close-movie-button');

    movieImgEl.setAttribute('src', 'assets/images/kumiko-shimizu-_PshNniKRy8-unsplash.jpg');
    movieImgEl.setAttribute('alt', 'Card image of movie theater seats');
    movieImgEl.setAttribute('class', 'card-img');
  
    movieDivEl.setAttribute('class', 'card-img-overlay');
    movieTitleEl.setAttribute('class', 'card-title');
  
    li1.setAttribute('class', 'rotten-tomato');
    li2.setAttribute('class', 'genre');
    li3.setAttribute('class', 'box-office');
    li4.setAttribute('class', 'director');
  
    movieTitleEl.textContent = movies[i].movieTitle;
    li1.textContent = movies[i].rottenTomatoes;
    li2.textContent = movies[i].movieGenre;
    li3.textContent = movies[i].movieBoxOffice;
    li4.textContent = movies[i].movieDirector;
  
    movieCardContainerEl.appendChild(newMovieEl);
    closeButtonEl.dataset.index = i;
    newMovieEl.appendChild(movieImgEl);
    newMovieEl.appendChild(closeButtonEl);
    newMovieEl.appendChild(movieDivEl);
    movieDivEl.appendChild(movieTitleEl);
    movieDivEl.appendChild(listEl);
    listEl.appendChild(li1);
    listEl.appendChild(li2);
    listEl.appendChild(li3);
    listEl.appendChild(li4);
  }
}

function closeMovieCard() {
  var movieIndex = $(this).attr('data-index');
  var movies = readMoviesFromStorage();

  console.log(movieIndex);

  movies.splice(movieIndex, 1);
  moviesToLocalStorage(movies);

  init();
}

init();

movieCardContainerEl2.on('click', '#close-movie-button', closeMovieCard);