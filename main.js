var result;
const api_key = 'bed950b3229a2b9bc8677bb8c28d5508';
const weather = {};

var main_city;
var loader;
window.onload = function() {
	localStorage.extension = 'false';
    getGeo();
}

function getGeo(){
	main_city = document.querySelector('.geo_city');
	loader = document.querySelector('.loader');
	
	main_city.style.display = "none";
	loader.style.display = "grid";
	loader.style.visibility = "visible";
	
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
		
		main_city.style.display = "grid";
		loader.style.display = "none";
		loader.style.visibility = "hidden";
}

function geolocationFailure(positionError) {
	if(positionError.code == 1) {
		window.alert("Вы решили не предоставлять данные о своем местоположении, " + 
		        "но это не проблема. Мы больше не будем запрашивать их у вас.");
	}
	else if(positionError.code == 2) {
		window.alert("Проблемы с сетью или нельзя связаться со службой определения " + 
		        "местоположения по каким-либо другим причинам.");
	}
	else if(positionError.code == 3) {
		window.alert("He удалось определить местоположение"
		        + "в течение установленного времени.");

	}
	else {
		window.alert("Загадочная ошибка.");
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

function add_favorites() {
	let city = document.querySelector('.favorites_form_input').value.toLowerCase();

	if (city !== ''){
		if( localStorage.getItem(city)){
			window.alert('В списке уже есть такой город');
		}
		else{
			localStorage.setItem(city, city);
			add_city(city);
		}
	}
	
	document.querySelector('.favorites_form_input').value = "";
}

function add_city(city){

	city.toLowerCase();
	
	let api_city = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&lang=ru`;

	fetch(api_city)
		.then(function(resp) {return resp.json()})
		.then(function(data){
			
			weather.city = data.name;
			weather.temp = Math.round(data.main.temp - 273) + '&deg;C'; 
			weather.wind = (data.wind.speed) + ' м/с, ' + convertWind(data.wind.deg);
			weather.cloud = (data.clouds.all) + '%' ;
			weather.pres = (data.main.pressure) + ' мм.рт.ст.' ;
			weather.hum = (data.main.humidity) + '%' ;
			weather.coord = '[' + (data.coord.lat) + ' , ' + (data.coord.lon) + ']' ;
			weather.img = "https://openweathermap.org/img/wn/" + (data.weather[0].icon) + "@2x.png";

		})
		.then(function(){			
			displayFav();
		})		
						
}

function displayFav(){
	const template = document.querySelector('#favorite_card');

	const City = template.content.querySelector(".favorite_item_title h2");
	const Icon = template.content.querySelector(".favorite_city_img");
	const Temp = template.content.querySelector(".f_temperature");
	const Wind = template.content.querySelector(".wind");
	const Cloud = template.content.querySelector(".cloud");
	const Pres = template.content.querySelector(".pressure");
	const Hum = template.content.querySelector(".humidity");
	const Coord = template.content.querySelector(".coordinates");

	
	City.textContent = weather.city;
	Icon.src = weather.img;
	Temp.innerHTML = weather.temp;
	Wind.innerHTML = weather.wind;
	Cloud.innerHTML = weather.cloud;
	Pres.innerHTML = weather.pres;
	Hum.innerHTML = weather.hum;
	Coord.innerHTML = weather.coord;

	var clone = template.content.querySelector("li").cloneNode(true);
	var fav_list = document.querySelector(".favorite_list");
	fav_list.appendChild(clone);

	clone.querySelector('.close').onclick = () => {
    	fav_list.removeChild(clone);
    	localStorage.removeItem(clone.querySelector(".favorite_item_title h2").textContent.toLowerCase());
	};
}

function add_previous(){
	console.log(localStorage[1];
	if(localStorage.length !== 0){
		for (let i = 0; i < localStorage.length; i++) {
			add_city(localStorage.key(i));
		}
	}
	else{}	
}

function refreshPage(){
    getGeo();
} 

add_previous();




