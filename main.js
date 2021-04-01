var result;

window.onload = function() {
    result = document.getElementById('result');
	
	// Если функциональность геолокации доступна, 
	// пытаемся определить координаты посетителя
	if (navigator.geolocation) {
		// Передаем две функции
		navigator.geolocation.getCurrentPosition(
		            geolocationSuccess, geolocationFailure);
		
		// Выводим результат
		result.innerHTML = "Поиск начался";
	}
	else {
		// Выводим результат
		result.innerHTML = "Ваш браузер не поддерживает геолокацию";
	}
}

function geolocationSuccess(position) {
	result.innerHTML = "Последний раз вас засекали здесь: " +
	         position.coords.latitude + ", " + position.coords.longitude;
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