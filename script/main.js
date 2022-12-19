//==> API Elements:
//=> API KEY:
const auth_key = '563492ad6f917000010000013457deb42ca2403a9074ac93b29156e6';

//==> Selectors:
//=> Divs:
const gallery = document.querySelector('.gallery');
const searchInput = document.querySelector('.search-input');
const form = document.querySelector('.search-form');
const title = document.querySelector('.title h2');

//=> Buttons:
const moreBtn = document.querySelector('.moreBtn');
const randomGenerateBtn = document.querySelector('.random-generateBtn');

//==> Variables:
let searchValue;
let currentSearch;
let fetchPhotosUrl;
let fetchVideosUrl;
let fetchPopularPhotosUrl;
let page = 1;

//==> Listners:
//=> Search Input:
searchInput.addEventListener('input', updateInput);

//==> Functions:
//-->> Update Input:
function updateInput(e) {
	searchValue = e.target.value;
}

//-->> Clear:
function clear() {
	gallery.innerHTML = '';
	searchInput.value = '';

	console.log('Gallery Data Clear');
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
		gallery.appendChild(photoContainer);
	});

	imageLightbox();
}

//-->> Generate video Container:
function generateVideos(data) {
	data.videos.forEach((video) => {
		video.video_files.forEach((video_file) => {
			//=> Create Video Container:
			const videoContainer = document.createElement('div');
			videoContainer.classList.add('videoContainer');

			//=> Conditions:
			if (
				video_file.quality === 'hd' &&
				video_file.width === 1280 &&
				video_file.height === 720
			) {
				videoContainer.innerHTML = `
				<div class="gallery-info">
				<p>${video_file.quality}</p>
				<a  href = ${video_file.link} target = '_blank'> <i class="fas fa-download"></i> </a>
				</div>
				<video muted src = ${video_file.link}></video>
				`;
			} else if (
				(video_file.quality === 'sd' || video_file.width === 1920, 960, 640)
			) {
				videoContainer.style.display = 'none';
			}

			//=> Append to Videos Gallery:
			gallery.appendChild(videoContainer);
		});
	});

	//==> Preview and Play Videos:
	const videos = gallery.querySelectorAll('video');

	videos.forEach((video) => {
		video.addEventListener('mouseover', function () {
			this.play();
		});

		video.addEventListener('mouseout', function () {
			this.pause();
		});
	});
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

//==> Get Popular Videos:
async function popularVideos() {
	//=> Popular Videos url:
	fetchVideosUrl = `https://api.pexels.com/videos/popular?per_page=16&page=1`;

	//=> Api fetch:
	const data = await fetchApi(fetchVideosUrl);

	//=> Generate Photos:
	generateVideos(data);
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

//==> Search Videos:
async function searchVideos(query) {
	//=> Clear Everythings:
	clear();

	//=> Search url:
	fetchVideosUrl = `https://api.pexels.com/videos/search?query=${query}+query&per_page=16&page=1`;

	//=> Api fetch:
	const data = await fetchApi(fetchVideosUrl);

	//=> Generate Videos:
	generateVideos(data);
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

//==> LoadMore Videos:
async function loadMoreVideos() {
	//=> Page Increments:
	page++;

	//=> Conditions:
	if (currentSearch) {
		fetchVideosUrl = `https://api.pexels.com/videos/search?query=${currentSearch}+query&per_page=16&page=${page}`;
	} else {
		fetchVideosUrl = `https://api.pexels.com/videos/popular?per_page=16&page=${page}`;
	}

	//=> Api fetch:
	const data = await fetchApi(fetchVideosUrl);

	//=> Generate Videos:
	generateVideos(data);
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

//==> Random Videos Generator:
function randomVideosGenerate() {
	clear();
	loadMoreVideos();
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

//==> Buttons and Search Input Value Checker:
function ButtonsChecker() {
	if (
		window.location.pathname === '/index.html' ||
		window.location.pathname === '/page/popular.html'
	) {
		//==> Listners:
		//=> Form:
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			clear();

			currentSearch = searchValue;

			if (moreBtn.classList.contains('homeMore')) {
				searchPhotos(searchValue);
				searchVideos(searchValue);
			} else if (moreBtn.classList.contains('popularMore')) {
				searchPhotos(searchValue);
			}
		});

		//=> Load More Photos Btn:
		moreBtn.addEventListener('click', () => {
			if (moreBtn.classList.contains('homeMore')) {
				loadMorePhotos();
			} else if (moreBtn.classList.contains('popularMore')) {
				loadMorePopularPhotos();
			}
		});

		//=> Load Random photos Btn:
		randomGenerateBtn.addEventListener('click', randomPhotosGenerate);
	} else if (window.location.pathname === '/page/videos.html') {
		//==> Listners:

		//=> Form:
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			clear();

			currentSearch = searchValue;
			searchVideos(searchValue);
		});

		//=> Load More Videos:
		moreBtn.addEventListener('click', loadMoreVideos);

		//=> Load Random Videos Btn:
		randomGenerateBtn.addEventListener('click', randomVideosGenerate);
	}
}

//==> page url Checker:
function urlChecker() {
	if (window.location.pathname === '/index.html') {
		popularVideos();
		curatedPhotos();
	} else if (window.location.pathname === '/page/popular.html') {
		populerPhotos();
	} else {
		popularVideos();
	}
}

//-->> Search Dropdown Category:
// function searchCategory() {
// 	const select = document.querySelector('#select');
// 	const categoryList = document.querySelector('#categoryList');
// 	const selectText = document.querySelector('#selectText');
// 	const options = document.querySelectorAll('option');

// 	//==> Category Menu open Close:
// 	select.addEventListener('click', (e) => {
// 		e.stopPropagation();
// 		categoryList.classList.toggle('open');
// 	});

// 	options.forEach((option) => {
// 		option.addEventListener('click', function (e) {
// 			e.stopPropagation();
// 			selectText.innerText = this.innerText;
// 			searchInput.placeholder = 'Search in ' + this.innerText;
// 			categoryList.classList.remove('open');
// 		});
// 	});

// 	//==> Category wise search:
// 	const categorys = categoryList.childNodes;

// 	categorys.forEach((category) => {
// 		category.addEventListener('click', function searchFilter(e) {
// 			e.stopPropagation();

// 			if (e.target.value == 'all') {
// 				console.log('all Category');

// 				form.addEventListener('submit', (e) => {
// 					clear();
// 					e.preventDefault();

// 					searchVideos(searchValue);
// 					searchPhotos(searchValue);

// 					title.innerText = 'Searched Photos and Videos Results';
// 				});
// 			} else if (e.target.value == 'photos') {
// 				console.log('Photos Category');

// 				form.addEventListener('submit', (e) => {
// 					clear();
// 					e.preventDefault();

// 					currentSearch = searchValue;
// 					searchPhotos(searchValue);

// 					title.innerText = 'Search Photos Results';
// 				});
// 			} else if (e.target.value == 'videos') {
// 				console.log('Videos Category');

// 				form.addEventListener('submit', (e) => {
// 					clear();
// 					e.preventDefault();

// 					currentSearch = searchValue;
// 					searchVideos(searchValue);

// 					title.innerText = 'Search Videos Results';
// 				});
// 			}
// 		});
// 	});

// 	//Note! : Need to solve category wise search relooping(function run multiple times is we do not reload the page again) problem.
// }

//==> Global Function Execution:

ButtonsChecker();
// searchCategory();
urlChecker();
