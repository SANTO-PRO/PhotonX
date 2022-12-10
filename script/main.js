//=> API KEY:
const auth_key = '563492ad6f917000010000013457deb42ca2403a9074ac93b29156e6';

//=> Selectors:

//=> Divs:
const gallery = document.querySelector('.gallery');
const searchInput = document.querySelector('.search-input');

//=> Buttons:
const searchBtn = document.querySelector('.search-Btn');

//=> Fetch API:
async function curatedPhotos() {
	const fetchData = await fetch('https://api.pexels.com/v1/curated', {
		method: 'GET',

		headers: {
			Accept: 'Application/json',
			Authorization: auth_key,
		},
	});

	//=> Convert Data into JSON:
	const data = await fetchData.json();

	//=> Looping over photos data:
	data.photos.forEach((photo) => {
		//=> Create Img Container:
		const photoContainer = document.createElement('div');
		photoContainer.classList.add('.gallery-img');
		photoContainer.innerHTML = `<img src= ${photo.src.large}></img> <p>${photo.photographer}</p>`;

		gallery.appendChild(photoContainer);
	});
}

curatedPhotos();
