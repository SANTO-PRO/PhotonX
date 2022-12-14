//==> Selectors:
//=> Divs:
const videosGallery = document.querySelector('.videos-gallery');
const searchInput = document.querySelector('.videosSearchInput');
const form = document.querySelector('.videosSearchForm');

//=> Btns:
const moreVideosBtn = document.querySelector('.moreVideos-Btn');

//==> Variables:
let searchValue;
let currentSearch;
let page = 1;

//==> API Elements:
//=> API KEY:
const auth_key = '563492ad6f917000010000013457deb42ca2403a9074ac93b29156e6';

//==> Listners:
//=> Search Input:
searchInput.addEventListener('input', updateInput);

console.log(searchInput);

//=> Form:
form.addEventListener('submit', (e) => {
	e.preventDefault();

	currentSearch = searchValue;
	searchVideos(searchValue);
});

//=> Load More Videos:
moreVideosBtn.addEventListener('click', loadMoreVideos);

//==> Functions:
//-->> Update Input:
function updateInput(e) {
	searchValue = e.target.value;
}

//-->> Clear:
function clear() {
	videosGallery.innerHTML = '';
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
			videosGallery.appendChild(videoContainer);
		});
	});

	//==> Preview and Play Videos:
	const videos = videosGallery.querySelectorAll('video');

	videos.forEach((video) => {
		video.addEventListener('mouseover', function () {
			this.play();
		});

		video.addEventListener('mouseout', function () {
			this.pause();
		});

		video.addEventListener('touchstart', function () {
			this.play();
		});

		video.addEventListener('touchend', function () {
			this.pause();
		});
	});
}

//==> Get Popular Videos:
async function popularVideos() {
	//=> Popular Videos url:
	fetchVideosUrl = `https://api.pexels.com/videos/popular?per_page=30&page=1`;

	//=> Api fetch:
	const data = await fetchApi(fetchVideosUrl);

	//=> Generate Photos:
	generateVideos(data);
}

//==> Search Videos:
async function searchVideos(query) {
	//=> Clear Everythings:
	clear();

	//=> Search url:
	fetchVideosUrl = `https://api.pexels.com/videos/search?query=${query}+query&per_page=25&page=1`;

	//=> Api fetch:
	const data = await fetchApi(fetchVideosUrl);

	//=> Generate Videos:
	generateVideos(data);
}

//==> LoadMore Videos:
async function loadMoreVideos() {
	//=> Page Increments:
	page++;

	//=> Conditions:
	if (currentSearch) {
		fetchVideosUrl = `https://api.pexels.com/videos/search?query=${currentSearch}+query&per_page=25&page=${page}`;
	} else {
		fetchVideosUrl = `https://api.pexels.com/videos/popular?per_page=30&page=${page}`;
	}

	//=> Api fetch:
	const data = await fetchApi(fetchVideosUrl);

	//=> Generate Videos:
	generateVideos(data);
}

popularVideos();
