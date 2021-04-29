let result;
const apikey = 'bed950b3229a2b9bc8677bb8c28d5508';
const weather = {};
serverLink = `https://weather-server-web6sem.herokuapp.com/`;

let mainCityId;
// loaders
let mainCity, loaderMain;
let favorite, loaderFav;

window.onload = function() {
    getGeo();
}

function getGeo(){
	mainCity = document.querySelector('.geo_city');
	loaderMain = document.querySelector('.loaderMain');
	
	mainCity.style.display = "none";
	loaderMain.style.display = "grid";
	loaderMain.style.visibility = "visible";
	
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
	
	const response = fetch(serverLink + 'weather/coordinates?lat=' + position.coords.latitude + '&lon=' + position.coords.longitude)	
	.then(function(resp) {
		// throw err;
			return resp.json()})
		.then(function(data) {
			
			//console.log(data)
			document.querySelector('.geo_city_title').textContent = data.city;
			document.querySelector('.temperature').innerHTML = data.temp;
			document.querySelector('.wind').textContent = data.wind
			document.querySelector('.cloud').textContent = data.cloud
			document.querySelector('.pressure').textContent = (data.press) + ' (мм.рт.ст.)' ;
			document.querySelector('.humidity').textContent = data.humidity
			document.querySelector('.coordinates').textContent = '[' + (data.coords.lat) + ' , ' + (data.coords.lon) + ']' ;
			document.querySelector('.geo_city_img').src = "https://openweathermap.org/img/wn/" + (data.icon) + "@2x.png";
			mainCity.style.display = "grid";
			loaderMain.style.display = "none";
			loaderMain.style.visibility = "hidden";
		})
		.catch(function(err) {window.alert('Невозможно получить данные. Код ошибки: ' + err);})
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

function addFavorites() {
 	const city = document.querySelector('.favorites_form_input').value.toLowerCase();
	

	if (city !== ''){
		let apiCity = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&lang=ru`;
		fetch(apiCity)
		.then(function(resp) {return resp.json()})
		.then(function(data){
			if(data.cod !== 200) {throw data.cod}
			if( localStorage.getItem(data.id)){
				window.alert('В списке уже есть такой город');
			}
			else{
				localStorage.setItem(data.id, city);
				addCity(city);
			}
		})
		.catch(function(err) {
			window.alert(`Произошла ошибка: ${err}`);
		})
	}
	document.querySelector('.favorites_form_input').value = "";
}

function addCity(city){
	let apiCity = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&lang=ru&units=metric`;

	/*
	const resp = fetch(CoordLink + "favorites", {
		method: 'post',
		headers: new Headers ({
      		'Content-Type': 'application/x-www-form-urlencoded'
		  }),
		body: JSON.stringify({_city: city})
	});
	*/

	fetch(apiCity)
		.then(function(resp) {return resp.json()})
		.then(function(data){
			weather.id = data.id
			weather.city = data.name;
			weather.temp = data.main.temp+ '&deg;C'; 
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
	var favList = document.querySelector(".favorite_list");
	favList.appendChild(clone);

	clone.querySelector('.close').onclick = () => {
    	favList.removeChild(clone);
		if(localStorage.length !== 0){
			for (let i = 0; i < localStorage.length; i++) {
				const curInStorage = localStorage.getItem(localStorage.key(i));
				const current = clone.querySelector(".favorite_item_title h2").textContent.toLowerCase();
				
				if(curInStorage == current){
					localStorage.removeItem(localStorage.key(i));
					return;
				}
			}
		}
	};

	favorite.style.display = "grid";
	loaderFav.style.display = "none";
	loaderFav.style.visibility = "hidden";
}

function addPrevious(){
	favorite = document.querySelector('.favorite');
	loaderFav = document.querySelector('.loaderFav');

	favorite.style.display = "none";
	loaderFav.style.display = "grid";
	loaderFav.style.visibility = "visible";

	if(localStorage.length !== 0){
		for (let i = 0; i < localStorage.length; i++) {
			if(localStorage.key(i) == 'extension'){}
			else{
				addCity(localStorage.getItem(localStorage.key(i)));
			}
		}
	}
	else{}	
}

function refreshPage(){
    getGeo();
} 

addPrevious();




