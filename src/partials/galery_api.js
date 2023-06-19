import axios from 'axios';

export async function getRequest(userText, page) {
  try {
    const response = await axios.get(`https://pixabay.com/api/?q=${userText}`, {
      params: {
        key: '37406470-f77473b8e435a1e7065d6e2d2',

        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: page,
      },
    });
    const data = response.data;

    // console.log(data.totalHits);
    return data;
  } catch (error) {
    console.error(error.message);
  }
}

export function createMarkUp({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<a href="${largeImageURL}">
  <div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes ${likes}</b>
      </p>
      <p class="info-item">
        <b>Views ${views}</b>
      </p>
      <p class="info-item">
        <b>Comments ${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads ${downloads}</b>
      </p>
    </div>
  </div>
</a>`;
}
