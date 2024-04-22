const status1 = document.getElementById('status-message')
let photo_array = [];
let index = 0;
let curr_photo = document.getElementById('photo-status');
let slideshowInterval = null;

document.getElementById('load-photos').addEventListener('click', loadPhotos);
document.getElementById('first-photo').addEventListener('click', displayFirstPhoto);
document.getElementById('previous-photo').addEventListener('click', displayPreviousPhoto);
document.getElementById('next-photo').addEventListener('click', displayNextPhoto);
document.getElementById('last-photo').addEventListener('click', displayLastPhoto);
document.getElementById('slideshow').addEventListener('click', startSlideShow);
document.getElementById('random-slideshow').addEventListener('click', startRandomSlideShow);
document.getElementById('stop-slideshow').addEventListener('click', stopSlideShow);
document.getElementById('reset').addEventListener('click', resetPhotoViewer);
photo_array.addEventListener('click', displayNextPhoto);

function setStatus(string){
    status1.innerText = string;
}

function loadPhotos(){
    const folderName = document.getElementById('photos-folder').value;
    const commonName = document.getElementById('common-name').value;
    const startNumber = parseInt(document.getElementById('start-photo-number').value);
    const endNumber = parseInt(document.getElementById('end-photo-number').value);

    if (startNumber >= 0 && endNumber >= 0 && endNumber >= startNumber){
        for (let a = startNumber; a <= endNumber; a++){
            photo_array.push(folderName + commonName + a + ".jpg");
        }

        setStatus('Photo Viewer System');
        displayFirstPhoto();
    }
}

function displayPhoto() {
    if (photo_array.length === 0 || index < 0 || index >= photo_array.length) {
        setStatus('Error: you must load data first');
        curr_photo.value = 'No photo available';
        return;
    }
    const imgElement = document.querySelector('.image-container img');
    imgElement.src = photo_array[index];
    curr_photo.value = photo_array[index];
}

function displayFirstPhoto() {
    index = 0;
    displayPhoto();
}

function displayPreviousPhoto() {
    if (index <= 0) {
        index = photo_array.length - 1;
    } else {
        index--;
    }
    displayPhoto();
}

function displayNextPhoto() {
    if (index >= photo_array.length - 1) {
        index = 0;
    } else {
        index++;
    }
    displayPhoto();
}

function displayLastPhoto() {
    index = photo_array.length - 1;
    displayPhoto();
}

function loadJSON() {
	const url = 'http://www.cs.umd.edu/~nelson/classes/resources/cmsc335/images/imagesSet1.json';
	setStatus('Photo Viewer System');	
	
	let images
	fetch(url) 
	  .then(response => response.json())
	  .then(json => {
		images = json.images;
		i = 0;

		images.forEach(images => {
			photo_array[i++] = images.imageURL;
		})
		displayFirstPhoto();
	  	})
}

function startSlideShow() {
    if (photo_array.length === 0) {
        setStatus('Error: you must load data first');
        return;
    }
    stopSlideShow(); 
    slideshowInterval = setInterval(displayNextPhoto, 1000); 
}

function startRandomSlideShow() {
    if (photo_array.length === 0) {
        setStatus('Error: you must load data first');
        return;
    }
    stopSlideShow(); 
    slideshowInterval = setInterval(() => {
        index = Math.floor(Math.random() * photo_array.length);
        displayPhoto();
    }, 1000); 
}

function stopSlideShow() {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }
}

function resetPhotoViewer() {
    stopSlideShow();
    photo_array = [];
    index = 0;
    curr_photo.value = '';
    setStatus('Photo Viewer System');
    document.querySelector('.image-container img').src = 'InitialImage.jpg';
    document.getElementById('photos-folder').value = '';
    document.getElementById('common-name').value = '';
    document.getElementById('start-photo-number').value = '';
    document.getElementById('end-photo-number').value = '';
}




