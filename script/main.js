//==> API Elements:
//=> API KEY:
const auth_key = '563492ad6f917000010000013457deb42ca2403a9074ac93b29156e6';

//=> API Urls:
const curatedUrl = 'https://api.pexels.com/v1/curated?per_page=16&page=1';

//==> Selectors:
//=> Divs:
const gallery = document.querySelector('.gallery');
const searchInput = document.querySelector('.search-input');
const form = document.querySelector('.search-form');

//=> Buttons:
const moreBtn = document.querySelector('.more-Btn');

//==> Variables:
let searchValue;

//==> Listners:
//=> Search Input:
searchInput.addEventListener('input', updateInput);

//=> Form:
form.addEventListener('submit', (e) => {
	e.preventDefault();
	searchPhotos(searchValue);
});

//==> Functions:

//-->> Update Input:
function updateInput(e) {
	searchValue = e.target.value;
}

//-->> Clear:
function clear() {
	gallery.innerHTML = '';
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

		console.log(photo);
		photoContainer.classList.add('photoContainer');
		photoContainer.innerHTML = `
		
		<div class="gallery-info">
		<p>${photo.photographer}</p>
		<a  href = ${photo.src.original}> <i class="fas fa-download"></i> </a>
		</div>
		<img src = ${photo.src.large}></img>
		`;
		gallery.appendChild(photoContainer);
	});
}

//==> Get curated photos:
async function curatedPhotos() {
	//=> Api fetch:
	const data = await fetchApi(curatedUrl);

	//=> Generate Photos:
	generatePhotos(data);
}

//==> Search Photos:
async function searchPhotos(query) {
	//=> Clear Everythings:
	clear();

	//=> Api fetch:
	const data = await fetchApi(
		`https://api.pexels.com/v1/search?query=${query}+query&per_page=16&page=1`,
	);

	//=> Generate Photos:
	generatePhotos(data);
}

curatedPhotos();
