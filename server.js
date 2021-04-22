function reportToParams(weatherReportList) {
    const keys = ['wind', 'cloud', 'press', 'humidity', 'coords']
    const items = weatherReportList.querySelectorAll('p')
    const params = {}
    for (let i = 0; i < keys.length; i += 1) {
      params[keys[i]] = items[i]
    }
    return params
  }

  const serverURL = 'https://weather-server-web6sem.herokuapp.com/'
  const defaultCity = 'Moscow'

  function convertWind (wind){
    const dirs = {N: 'С', W: 'З', E: 'В', S: 'Ю'}
    let result = ''
  
    if (wind === 0) {result += dirs.N;}
    if ((wind > 0) && (wind <= 45) ) {result += dirs.N + '/' + dirs.E}
    if ((wind > 45) && (wind <= 90) ) {result += dirs.E}
    if ((wind > 90) && (wind <= 135) ) {result += dirs.E + '/' + dirs.S}
    if ((wind > 135) && (wind <= 180) ) {result +=dirs.S}
    if ((wind > 180) && (wind <= 225) ) {result += dirs.S + '/' + dirs.W}
    if ((wind > 225) && (wind <= 270) ) {result +=dirs.W}
    if ((wind > 270) && (wind <= 315) ) {result += dirs.N + '/' + dirs.W}
    if ((wind > 315) && (wind <= 360) ) {result +=dirs.N}
  
    return result;
  }


  async function fillReport(cityOrCoord, reportFields, weatherData) {

    let weather
    if(weatherData !== undefined) weather = weatherData
    else{
      weather = await (await fetch(`${serverURL}${cityOrCoord}`, {
        method: 'GET'
      })).json()
    }
  
    const { coords } = weather
    const report = reportFields
  
    report.temp.textContent = weather.temp
    report.wind.textContent = weather.wind
    report.cloud.textContent = weather.cloud
    report.press.textContent = weather.press
    report.humidity.textContent = weather.humidity
    report.coords.textContent = `[ ${coords.lat}, ${coords.lon} ]`
    report.icon.src = weather.icon
  
    if (reportFields.city !== undefined) report.city.textContent = weather.city
  }

  function loadData(parentNode, loadingNodeSelector, loadFunction, delay) {
    const loadingNode = document.querySelector(loadingNodeSelector)
    const defaultValue = loadingNode.style.display
    loadingNode.style.display = 'none'
    const loader = document.getElementById('loader').content.cloneNode(true)
    parentNode.appendChild(loader)
  
    setTimeout(async () => {
      await loadFunction()
      parentNode.removeChild(parentNode.querySelector('.loader'))
      loadingNode.style.display = defaultValue
    }, delay)
  }

  function enableCurrent() {
    const parentNode = document.querySelectorAll('section')[0]

    loadData(parentNode, '.geo_city_info', () => {
      const params = report2Params(document.querySelector('.specs_list'))
      params.temp = document.querySelector('.temperature')
      params.icon = document.querySelector('.geo_city_img')
      params.city = document.querySelector('.geo_city_title')
  
      navigator.geolocation.getCurrentPosition(async (position) => {
        const query = `weather/coordinates?lat=${position.coords.latitude}&lon=${position.coords.longitude}`
        await fillReport(query, params)
      }, async () => { await fillReport(defaultCity, params) })
    }, 500)
  }