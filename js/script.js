const RouteList = [
  {
    title: 'All countries',
    route: 'all'
  },
  {
    title: 'Africa',
    route: 'africa'
  },
  {
    title: 'Americas',
    route: 'americas'
  },
  {
    title: 'Asia',
    route: 'asia'
  },
  {
    title: 'Europe',
    route: 'europe'
  },
  {
    title: 'Oceania',
    route: 'oceania'
  }
]
const endPointList = {
  all:'all',
  capital:'capital',
  region:'region',
  name:'name'
}

const $navbarList = document.querySelector('.navbarList');
const $container = document.querySelector('.row');
const $loader = document.querySelector('.loader');
const $select = document.querySelector('.select');
const $search = document.querySelector('.search');
const $navbar = document.querySelector('.navbar');
const $bars = document.querySelector('.bars');
const $sidebar = document.querySelector('.sidebar');
const $form = document.querySelector('.form');

function getBase(endPoint, cb){
  fetch(`https://restcountries.com/v3.1/${endPoint}`)
  .then(res => res.json())
  .then(res => cb(res))
}

window.addEventListener('load', () => {
  $loader.innerHTML = '<div class="lds-hourglass"></div>'
  const links = RouteList.map(({title, route}) => {
    return RouteTemplate(title, route)
  }).join('')
  $navbarList.innerHTML = links
  getBase(endPointList.all, res => {
    Template(res)
  })
})

function RouteTemplate(title, route){
  return `
    <li class="nav-item">
      <a onclick="getRoute('${route}')">${title}</a>
    </li>
  `
}

function getRoute(route){
  console.log(route);
  if (route === 'all') {
    getBase(`${endPointList.all}`, res => {
      Template(res)
    })
  } else {
    getBase(`${endPointList.region}/${route}`, res => {
      Template(res)
    })
  }
}

function Template(base){
  const template = base.map(item => {
    return card(item)
  }).join('')
  $container.innerHTML = template 
}

function card(country){
  return `
    <div class="card">
      <div class="card-header">
        <i>${country.name.common} ${country.flag ? country.flag : '...'}</i>
      </div>
      <div class="card-image">
        <img src="${country.flags.svg}">
      </div>
      <button class="btn-more" onclick="getMore('${country.name.common}')">More</button>
    </div>
  `
}

function getMore(more){
  getBase(`${endPointList.name}/${more}`, res => {
    console.log(res);
    $container.innerHTML = `
      <div class="more">
        <div class="card-image">
          <img src="${res[0].flags.svg}">
        </div>
        <br>
        <div class="more_text">
          <p>Capital: <span>${res[0].capital}</span></p>
          <p style="text-transform: capitalize;">Start Of Week: <span>${res[0].startOfWeek}</span></p>
          <p>Region: <span>${res[0].subregion}</span></p>
        </div>
        <button onclick="goBack()">Go back</button>
      </div>
    `
  })
}

function goBack(){
  window.location.reload()
}

$select.addEventListener('change', e => {
  let value = e.target.value
  if (value === 'capital') {
    $search.setAttribute('placeholder', 'Search by Capital')
  } else if (value === 'editNavbar') {
    $search.setAttribute('placeholder', 'Edit Navbar')
  } else {
    $search.setAttribute('placeholder', 'Search by Name')
  }
})
$search.addEventListener('input', e => {
  let value = e.target.value
  let selected = $select.value
  if (selected === 'capital') {
    getBase(`${endPointList.capital}/${value}`, res => {
      Template(res)
    })
  } else if (selected === 'editNavbar') {
    $navbar.style.backgroundColor = value
  } else {
    getBase(`${endPointList.name}/${value}`, res => {
      Template(res)
    })
  }
})

$bars.addEventListener('click', e => {
  e.preventDefault()
  $bars.classList.toggle('active')
  $sidebar.classList.toggle('active')
  $navbarList.classList.toggle('active')
  $form.classList.toggle('active')
})