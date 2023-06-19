// import axios from 'axios';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

import { getRequest, createMarkUp } from './partials/galery_api';

const formEl = document.querySelector('.search-form');
const inputEl = document.querySelector('[name="searchQuery"]');
// const buttonEl = document.querySelector('[type="submit"]');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

loadMoreBtnEl.classList.add('hidden');

formEl.addEventListener('submit', onSubmit);
loadMoreBtnEl.addEventListener('click', onClick);

let curentPage = 1;
let totalHits = 0;
totalHits = getRequest(`${inputEl.value}`, curentPage).then(data => {
  totalHits = data.totalHits;
  return totalHits;
});

function onSubmit(e) {
  if (inputEl.value === '') {
    return alert('Введи что-то нормальное!');
  }

  e.preventDefault();
  curentPage = 1;
  getRequestByUserText();
  loadMoreBtnEl.classList.remove('hidden');
}

function onClick(e) {
  e.preventDefault();
  curentPage += 1;
  totalHits -= 40;
  getRequestByUserText();
}

function getRequestByUserText() {
  getRequest(`${inputEl.value}`, curentPage)
    .then(data => {
      return data.hits;
    })
    .then(res => {
      if (res.length === 0) {
        throw new Error();
      }

      return res.map(item => createMarkUp(item));
    })
    .then(markup => {
      galleryEl.innerHTML = markup.join('');

      const lightbox = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250,
        scrollZoom: false,
      });

      lightbox.refresh();

      if (totalHits < 40) {
        console.log(
          "We're sorry, but you've reached the end of search results."
        );
        loadMoreBtnEl.classList.add('hidden');
      }
    })
    .catch(error => {
      console.log(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
}
