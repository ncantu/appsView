function update(stream) {
	document.querySelector('video').src = stream.url;
}
function readURL(input) {

	if (input.files && input.files[0]) {
		var reader = new FileReader();

		var preview = document.getElementById('preview');
		reader.onload = function(e) {
			preview.src = e.target.result;
		}
		reader.readAsDataURL(input.files[0]);
	}
}
function readImage(inputElement) {
	var deferred = $.Deferred();
	var fr = new FileReader();
	fr.onload = function(e) {
		deferred.resolve(e.target.result);
	};
	fr.readAsDataURL(inputElement);
	return deferred.promise();
}
function getBase64Image(img) {
	var canvasTmp = document.createElement('canvas');
	canvasTmp.width = img.width;
	canvasTmp.height = img.height;
	var ctx = canvasTmp.getContext('2d');
	ctx.drawImage(img, 0, 0);
	var dataURLTmp = canvasTmp.toDataURL("image/png");

	return dataURLTmp.replace('data:image/png;base64,', '');
}
function callIdGetValidation() {
	console.log('Call callIdGetValidation');
	var resource = 'car';
	var service = 'idGetValidation';
	var frenchLicencePlate = document.getElementById('frenchLicencePlate');
	if (frenchLicencePlate.length != 0) {
		if (frenchLicencePlate.value.length != 0) {
			data.frenchLicencePlate = frenchLicencePlate.value
		}
	}
	data.fileContent = '';
	apiCall(resource, service);
}

function resultSet(result) {

	console.log(result);

	var frenchLicencePlate = document.getElementById('frenchLicencePlate');
	var log = document.getElementById('log');

	var optToast = {
			defaultText : result.resultMsg,
			type: 'tech'
		}
	if(result.resultState !== true){
		
		optToast.type = 'error';
	}
	else {
		
		optToast.type = 'valid';
	}
	toastBuilder(optToast);

	if (result.plaque != false && result.plaque != null && result.plaque != '') {

		frenchLicencePlate.value = result.plaque;
		data.frenchLicencePlate = result.plaque;
	}
	if (result.resultState == true && result.resultService == 'imageGetText') {

		callIdGetValidation();
	}
	if (result.clientAddress != null && result.clientAddress != '' && result.clientAddress != false) {
		data.clientAddress = result.clientAddress;
	}
	if (result.tokenNew != null && result.tokenNew != '' && result.tokenNew != false) {
		data.tokenPublic = result.tokenNew;
	}	
	console.log(result.log);
	console.log(data);

	return true;
}

function apiCall(resource, service) {
	var urlBase = 'https://appsApi.instriit.com/';
	var version = '1.0.0';
	var urlRewrite = '.php'
	var url = urlBase + version + '/' + resource + '/' + service + urlRewrite;
	var dataStr = JSON.stringify(data);
	
	console.log(data);
	
	var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var result = JSON.parse(this.responseText);
			resultSet(result);
		}
	};
	xmlhttp.open('POST', url);
	xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
	xmlhttp.send(dataStr);
	return true;
}

function imgLoadOnchange() {
	console.log('Change from file');
	readURL(this);
}

function readButtonOnClick() {
	console.log('Read');
	var preview = document.getElementById('preview');
	var resource = 'car';
	var service = 'imageGetText';
	data.fileContent = getBase64Image(preview);
	data.frenchLicencePlate = '';
	apiCall(resource, service);
}

function infoButtonOnClick() {
	callIdGetValidation();
}

function init() {
	function scrapOnOnClick() {

		var videoSelect = document.querySelector('select#videoSource');
		var videoContainer = document.getElementById('videoContainer');
		var videoMask = document.getElementById('videoMask');
		var scrap = document.getElementById('scrap');
		var extractWidth = 200;
		var extractHeight = 100;
		var extractLeft = ((video.videoWidth / 2) - (extractWidth / 2));	
		var extractTop = ((video.videoHeight / 2) - (extractHeight / 2));	
		
		videoContainer.className = "show";

		canvas.width = extractWidth;
		canvas.height = extractHeight;
		canvas.style.width = extractWidth + 'px';
		canvas.style.height = extractHeight + 'px';

		video.style.width = video.videoWidth.toString() + 'px';
		video.style.height = video.videoHeight.toString() + 'px';

		videoContainer.style.width = video.videoWidth.toString() + 'px';
		videoContainer.style.height = video.videoHeight.toString() + 'px';

		videoMask.style.height = extractHeight + 'px';
		videoMask.style.width = extractWidth + 'px';		


		videoMask.style.left = extractLeft + 'px';
		videoMask.style.top = extractTop + 'px';

		scrap.addEventListener('click', function() {	
			var text =
		    'video.videoWidth ' + video.videoWidth + "<br>"
			 +'video.videoHeight ' + video.videoHeight + "<br>"
			+'video.style.width ' + video.style.width + "<br>"
			+ 'video.style.height ' + video.style.height + "<br>"
			+ 'videoContainer.style.width ' + videoContainer.style.width
			+ "<br>" + 'videoContainer.style.height '
			+ videoContainer.style.height + "<br>" + 'videoMask.style.width '
			+ videoMask.style.width + "<br>" + 'videoMask.style.height '
			+ videoMask.style.height + "<br>" + 'videoMask.style.top '
			+ videoMask.style.top + "<br>" + 'videoMask.style.left '
			+ videoMask.style.left + "<br>"
			+ 'extractTop ' + extractTop + "<br>"
			+ 'extractLeft ' + extractLeft + "<br>"
			+ 'extractWidth ' + extractWidth + "<br>"
			+ 'extractHeight ' + extractHeight;
			
			console.log(text);
			// var marge = 100;
			context.drawImage(video, extractLeft, extractTop, extractWidth,
					extractHeight, 0, 0, extractWidth, extractHeight);

			var dataURLTmp = canvas.toDataURL("image/png");
			preview.src = dataURLTmp;
			videoContainer.className = "hidden";
		});

		return true;
	}
	function gotSources(sourceInfos) {
		for (var i = 0; i !== sourceInfos.length; ++i) {
			var sourceInfo = sourceInfos[i];
			var option = document.createElement('option');
			option.value = sourceInfo.id;
			if (sourceInfo.kind === 'video') {
				option.text = 'Cam..'+sourceInfo.label.substr(-6) || 'camera ' + (videoSelect.length + 1);
				videoSelect.appendChild(option);
			} else {
				console.log('Some other kind of source: ', sourceInfo);
			}
		}
	}
	function successCallback(stream) {
		window.stream = stream; // make stream available to console
		video.src = window.URL.createObjectURL(stream);
		video.play();
	}

	function errorCallback(error) {
		console.log('navigator.getUserMedia error: ', error);
	}

	function start() {
		if (window.stream) {
			video.src = null;
			stream.getTracks().forEach(function(track) {
				track.stop();
			});
		}

		var videoSource = videoSelect.value;
		var constraints = {

			video : {
				optional : [ {
					sourceId : videoSource
				} ]
			}
		};
		navigator.getUserMedia(constraints, successCallback, errorCallback);
	}

	var videoSelect = document.querySelector('select#videoSource');
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	var video = document.getElementById('video');
	var preview = document.getElementById('preview');

	navigator.getUserMedia = navigator.getUserMedia
			|| navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

	if (typeof MediaStreamTrack === 'undefined'
			|| typeof MediaStreamTrack.getSources === 'undefined') {
		alert('This browser does not support MediaStreamTrack.\n\nTry Chrome.');
	} else {
		MediaStreamTrack.getSources(gotSources);
	}

	videoSelect.onchange = start;
	start();

	var imgLoad = document.getElementById('imgLoad');
	imgLoad.addEventListener('change', imgLoadOnchange, false);

	var scrapOn = document.getElementById('videoSource');
	scrapOn.addEventListener('blur', scrapOnOnClick, false);

	var read = document.getElementById('read');
	read.addEventListener('click', readButtonOnClick, false);

	var info = document.getElementById('info');
	info.addEventListener('click', infoButtonOnClick, false);

}

var data = {
	frenchLicencePlate: '',
	fileContent: '',
	clientPublicId: '',
	tokenPublic: ''
};

window.addEventListener('load', init, false);