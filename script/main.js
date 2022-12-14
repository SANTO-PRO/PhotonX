//==> API Elements:
//=> API KEY:
const auth_key = '563492ad6f917000010000013457deb42ca2403a9074ac93b29156e6';

//==> Selectors:
//=> Divs:
const photosGallery = document.querySelector('.gallery');
const searchInput = document.querySelector('.search-input');
const form = document.querySelector('.search-form');

//=> Buttons:
const morePhotosBtn = document.querySelector('.morePhotos-Btn');

//==> Variables:
let searchValue;
let currentSearch;
let fetchPhotosUrl;
let page = 1;

//==> Listners:
//=> Search Input:
searchInput.addEventListener('input', updateInput);

//=> Form:
form.addEventListener('submit', (e) => {
	e.preventDefault();

	currentSearch = searchValue;
	searchPhotos(searchValue);
});

//==> loadMore Btn:
//=> Load More Photos:
morePhotosBtn.addEventListener('click', loadMorePhotos);

//==> Functions:
//-->> Update Input:
function updateInput(e) {
	searchValue = e.target.value;
}

//-->> Clear:
function clear() {
	photosGallery.innerHTML = '';
	searchInput.value = '';
}

//-->> API fetch:
async function fetchApi(url) {
	const fetchData = await fetch(url, {
		method: 'GET',

		headers: {
			Accept: 'application/json',
			Authorization: auth_key,
		},
	});

	//=> Convert Data into JSON:
	const data = await fetchData.json();
	return data;
}

//-->> Generate img Container:
function generatePhotos(data) {
	data.photos.forEach((photo) => {
		const photoContainer = document.createElement('div');

		photoContainer.classList.add('photoContainer');
		photoContainer.innerHTML = `
		
		<div class="gallery-info">
		<p>${photo.photographer}</p>
		<a  href = ${photo.src.original} target = '_blank'> <i class="fas fa-download"></i> </a>
		</div>
		<img src = ${photo.src.large}></img>
		`;
		photosGallery.appendChild(photoContainer);
	});
}

//==> Get curated photos:
async function curatedPhotos() {
	//=> curated url:
	fetchPhotosUrl = `https://api.pexels.com/v1/curated?per_page=16&page=1`;

	//=> Api fetch:
	const data = await fetchApi(fetchPhotosUrl);

	//=> Generate Photos:
	generatePhotos(data);
}

//==> Search Photos:
async function searchPhotos(query) {
	//=> Clear Everythings:
	clear();
	//=> Search url:
	fetchPhotosUrl = `https://api.pexels.com/v1/search?query=${query}+query&per_page=16&page=1`;

	//=> Api fetch:
	const data = await fetchApi(fetchPhotosUrl);

	//=> Generate Photos:
	generatePhotos(data);
}

//==> LoadMore Photos:
async function loadMorePhotos() {
	//=> Page Increments:
	page++;

	//=> Conditions:
	if (currentSearch) {
		fetchPhotosUrl = `https://api.pexels.com/v1/search?query=${currentSearch}+query&per_page=16&page=${page}`;
	} else {
		fetchPhotosUrl = `https://api.pexels.com/v1/curated?per_page=16&page=${page}`;
	}

	//=> Api fetch:
	const data = await fetchApi(fetchPhotosUrl);

	//=> Generate Photos:
	generatePhotos(data);
}

curatedPhotos();
