// import axios from 'axios';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { getRequest, createMarkUp } from './partials/galery_api';

const formEl = document.querySelector('.search-form');
const inputEl = document.querySelector('[name="searchQuery"]');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

loadMoreBtnEl.classList.add('hidden');

formEl.addEventListener('submit', onSubmit);
loadMoreBtnEl.addEventListener('click', onClick);

let curentPage = 1;
let totalHits = 0;

function onSubmit(e) {
  e.preventDefault();
  if (inputEl.value === '') {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
      { timeout: 3000 }
    );
    return;
  }
  totalHits = counterTotalHits();
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
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results.",
          { timeout: 3000 }
        );

        loadMoreBtnEl.classList.add('hidden');
        return;
      }
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
}

function counterTotalHits() {
  getRequest(`${inputEl.value}`, curentPage)
    .then(data => {
      totalHits = data.totalHits;
      return totalHits;
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
}
