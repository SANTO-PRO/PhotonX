const videosGallery = document.querySelector('.videos-gallery');

const moreVideosBtn = document.querySelector('.moreVideos-Btn');

let fetchVideosUrl;

//=> Load More Videos:
moreVideosBtn.addEventListener('click', loadMoreVideos);

//==> API Elements:
//=> API KEY:
const auth_key = '563492ad6f917000010000013457deb42ca2403a9074ac93b29156e6';

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

//-->> Generate video Container:
function generateVideos(data) {
	data.videos.forEach((video) => {
		video.video_files.forEach((video_file) => {
			const photoContainer = document.createElement('div');

			photoContainer.classList.add('photoContainer');
			photoContainer.innerHTML = `
		
		<div class="gallery-info">
		<p>${video.user.name}</p>
		<a  href = ${video_file.link} target = '_blank'> <i class="fas fa-download"></i> </a>
		</div>
		<video  src = ${video_file.link}></video>
		`;
			videosGallery.appendChild(photoContainer);
		});
	});
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

//==> LoadMore Videos:
function loadMoreVideos() {
	console.log('search succesful!');
}

popularVideos();
