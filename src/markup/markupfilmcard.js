import axios from 'axios';

const KEY = '8378c884a6341b6bb6a7cfb362550079';
const BASE_URL = 'https://api.themoviedb.org/3';
const GENRES_NAME = 'genresNames';
export const filmContainer = document.querySelector('.film__container');

async function getGenresArray() {
  try {
    const respons = await axios.get(
      `${BASE_URL}/genre/movie/list?api_key=${KEY}`
    );
    const genres = respons.data.genres;
    return genres;
  } catch (error) {
    return error.message;
  }
}
getGenresArray().then(resp => {
  localStorage.setItem(GENRES_NAME, JSON.stringify(resp));
});

function getGenresName(array) {
  const saveGenresName = localStorage.getItem(GENRES_NAME);
  const genresNameData = JSON.parse(saveGenresName);
  // console.log(genresNameData);
  for (const genName of genresNameData) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i] === genName.id) {
        array[i] = ' ' + genName.name;
        if (array.length > 2) {
          array[2] = ' Other';
        }
      }
    }
  }
}

export function createMarkup(resp) {
  const filmCard = resp
    .map(({ poster_path, title, genre_ids, release_date, id }) => {
      getGenresName(genre_ids);
      const genreArrayShort = genre_ids.slice(0, 3);
      let releaseDate = '';
      if (!release_date) {
        const message = 'No date';
        releaseDate = message;
      }
      if (release_date) {
        releaseDate = release_date.slice(0, 4);
      }
      if (!poster_path) {
        return `<li class="film-list__item" data-id=${id}>

            <a href="#" class="film-list__link">
              <img class="film-list__img" src="https://png.pngtree.com/png-vector/20190820/ourlarge/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg" alt="${title}" />
              <div class="film-list__box">
                  <h2 class="film-list__title">${title}</h2>
                  <p class="film-list__genres">${genreArrayShort} <span class="film-list__date"></span>${releaseDate}</p>
              </div>
            </a>
          </li>`;
      }

      return `<li class="film-list__item" data-id=${id}>

            <a href="#" class="film-list__link">
              <img class="film-list__img" src="https://image.tmdb.org/t/p/w500/${poster_path}" alt="${title}" />
              <div class="film-list__box">
                  <h2 class="film-list__title">${title}</h2>
                  <p class="film-list__genres">${genreArrayShort} <span class="film-list__date"></span>${releaseDate}</p>
              </div>
            </a>
          </li>`;
    })
    .join('');

  // filmContainer.innerHTML = filmCard;
  filmContainer.insertAdjacentHTML('beforeend', filmCard);
}

// https://png.pngtree.com/png-vector/20190820/ourlarge/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg
