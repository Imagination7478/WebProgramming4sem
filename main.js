var result;
const api_key = 'bed950b3229a2b9bc8677bb8c28d5508';

window.onload = function() {
    result = document.getElementById('result');
	
	// Если функциональность геолокации доступна, 
	// пытаемся определить координаты посетителя
	if (navigator.geolocation) {
		// Передаем две функции
		navigator.geolocation.getCurrentPosition(
		            geolocationSuccess, geolocationFailure);
	}
	else {
	}
}

function geolocationSuccess(position) {
	CoordLink = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${api_key}&lang=ru`;
	
	fetch(CoordLink)
		.then(function(resp) {return resp.json()})
		.then(function(data){
			
			document.querySelector('.geo_city_title').textContent = data.name;
			document.querySelector('.temperature').innerHTML = Math.round(data.main.temp - 273) + '&deg;C'; 
			document.querySelector('.wind').textContent = (data.wind.speed) + ' м/с, ' + convertWind(data.wind.deg);
			document.querySelector('.cloud').textContent = (data.clouds.all) + '%' ;
			document.querySelector('.pressure').textContent = (data.main.pressure) + ' мм.рт.ст.' ;
			document.querySelector('.humidity').textContent = (data.main.humidity) + '%' ;
			document.querySelector('.coordinates').textContent = '[' + (data.coord.lat) + ' , ' + (data.coord.lon) + ']' ;
			document.querySelector('.geo_city_img').src = "https://openweathermap.org/img/wn/" + (data.weather[0].icon) + "@2x.png";
		}
		)
}

function geolocationFailure(positionError) {
	if(positionError == 1) {
		result.innerHTML = "Вы решили не предоставлять данные о своем местоположении, " + 
		        "но это не проблема. Мы больше не будем запрашивать их у вас.";
	}
	else if(positionError == 2) {
		result.innerHTML = "Проблемы с сетью или нельзя связаться со службой определения " + 
		        "местоположения по каким-либо другим причинам.";
	}
	else if(positionError == 3) {
		result.innerHTML = "He удалось определить местоположение " 
		        + "в течение установленного времени. ";

	}
	else {
		result.innerHTML = "Загадочная ошибка.";
	}
}

function convertWind (wind){
	const dirs = {N: 'С', W: 'З', E: 'В', S: 'Ю'};
	let result = '';

	if (wind === 0) {result += dirs.N;}
	if ((wind > 0) && (wind <= 45) ) {result += dirs.N + '/' + dirs.E;}
	if ((wind > 45) && (wind <= 90) ) {result += dirs.E;}
	if ((wind > 90) && (wind <= 135) ) {result += dirs.E + '/' + dirs.S;}
	if ((wind > 135) && (wind <= 180) ) {result +=dirs.S;}
	if ((wind > 180) && (wind <= 225) ) {result += dirs.S + '/' + dirs.W;}
	if ((wind > 225) && (wind <= 270) ) {result +=dirs.W;}
	if ((wind > 270) && (wind <= 315) ) {result += dirs.N + '/' + dirs.W;}
	if ((wind > 315) && (wind <= 360) ) {result +=dirs.N;}

	return result;
}