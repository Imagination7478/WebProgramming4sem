const api_key = 'bed950b3229a2b9bc8677bb8c28d5508';

geoFindMe()
var lat;
var lon;
window.onload = function() {
  var startPos;
  var geo = function(position) {
    startPos = position;
    lat = document.getElementById('startLat').textContent = startPos.coords.latitude;
    lon = document.getElementById('startLon').innerHTML = startPos.coords.longitude;
  };
}

function geoFindMe() {
  var startPos;
  var geoSuccess = function(position) {
	startPos = position;
	
	
	console.log(lat);
	console.log(lon);

	CoordLink = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&lang=ru`;
	
	fetch(CoordLink)
		.then(function(resp) {return resp.json()})
		.then(function(data){
			
			document.querySelector('.geo_city_title').textContent = data.name;
			document.querySelector('.temperature').innerHTML = Math.round(data.main.temperature - 273) + '&deg;C'; 
			document.querySelector('.wind').textContent = (data.wind.speed) + ' м/с, ' + convertWind(data.wind.deg);
			document.querySelector('.cloud').textContent = (data.clouds.all) + '%' ;
			document.querySelector('.pressure').textContent = (data.main.pressure) + ' мм.рт.ст.' ;
			document.querySelector('.humidity').textContent = (data.main.humidity) + '%' ;
			document.querySelector('.coordinates').textContent = '[' + (data.coord.lat) + ' , ' + (data.coord.lon) + ']' ;
			document.querySelector('.geo_city_img').src = "https://openweathermap.org/img/wn/" + (data.weather[0].icon) + "@2x.png";
		}
		)
  };
  
  var geoError = function(position) {
    console.log('Error occurred. Error code: ' + error.code);
    // error.code can be:
    //   0: unknown error
    //   1: permission denied
    //   2: position unavailable (error response from location provider)
    //   3: timed out
  };
  
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);

};

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

function refreshPage(){
    window.location.reload();
} 

