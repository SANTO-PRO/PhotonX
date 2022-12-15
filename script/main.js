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
const randomPhotosBtn = document.querySelector('.randomPhotos');

//==> Variables:
let searchValue;
let currentSearch;
let fetchPhotosUrl;
let fetchPopularPhotosUrl;
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

//=> Load More Photos Btn:
morePhotosBtn.addEventListener('click', () => {
	if (morePhotosBtn.classList.contains('homeMore')) {
		loadMorePhotos();
	} else if (morePhotosBtn.classList.contains('popularMore')) {
		loadMorePopularPhotos();
	}
});

//=> Load Random photos Btn:
randomPhotosBtn.addEventListener('click', randomPhotosGenerate);

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

	imageLightbox();
}

//-->> gallery Image Lightbox:
function imageLightbox() {
	const lightbox = document.createElement('div');
	lightbox.id = 'lightbox';
	document.body.appendChild(lightbox);

	const galleryImages = document.querySelectorAll('.photoContainer img');
	galleryImages.forEach((image) => {
		image.addEventListener('click', (e) => {
			lightbox.classList.add('active');

			const img = document.createElement('img');
			img.src = image.src;
			while (lightbox.firstChild) {
				lightbox.removeChild(lightbox.firstChild);
			}
			lightbox.appendChild(img);
		});
	});

	lightbox.addEventListener('click', (e) => {
		if (e.target !== e.currentTarget) {
			return lightbox.classList.remove('active');
		}
	});
}

//==> Get Curated photos:
async function curatedPhotos() {
	//=> curated url:
	fetchPhotosUrl = `https://api.pexels.com/v1/curated?per_page=16&page=1`;

	//=> Api fetch:
	const data = await fetchApi(fetchPhotosUrl);

	//=> Generate Photos:
	generatePhotos(data);
}
//==> Get Popular photos:
async function populerPhotos() {
	//=> curated url:
	fetchPopularPhotosUrl = `https://api.pexels.com/v1/popular?per_page=16&page=1`;

	//=> Api fetch:
	const data = await fetchApi(fetchPopularPhotosUrl);

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

//==> LoadMore  Photos:
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

//==> LoadMore Popular Photos:
async function loadMorePopularPhotos() {
	//=> Page Increments:
	page++;

	//=> Conditions:
	if (currentSearch) {
		fetchPopularPhotosUrl = `https://api.pexels.com/v1/search?query=${currentSearch}+query&per_page=16&page=${page}`;
	} else {
		fetchPopularPhotosUrl = `https://api.pexels.com/v1/popular?per_page=16&page=${page}`;
	}

	//=> Api fetch:
	const data = await fetchApi(fetchPopularPhotosUrl);

	//=> Generate Photos:
	generatePhotos(data);
}

//==> Random Photos Generator:
function randomPhotosGenerate() {
	clear();

	if (window.location.pathname === '/index.html') {
		loadMorePhotos();
	} else {
		loadMorePopularPhotos();
	}
}

//==> Add Active To Navbar Item:
(function navbarActive() {
	const currentLocation = location.href;
	const navItems = document.querySelectorAll('.navbar div a');
	const navLength = navItems.length;

	for (var i = 0; i < navLength; i++) {
		if (navItems[i].href === currentLocation) {
			navItems[i].className = 'active';
		}
	}
})();

//==> page url Checker:
function urlChecker() {
	if (window.location.pathname === '/index.html') {
		curatedPhotos();
	} else {
		populerPhotos();
	}
}

urlChecker();
