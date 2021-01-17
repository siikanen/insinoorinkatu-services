export const intToPrice = (price) => {
  return price / 100
}
export const priceToInt = (price) => {
  return Math.trunc(price * 100)
}
export const getToken = function () {
  return JSON.parse(window.localStorage.getItem('loggedUser')).token
}
export const formQueryString = (searchParams={})=>{
  return Object.keys(searchParams)
    .map((key) => key + '=' + searchParams[key])
    .join('&')
}
export const humanizeDate = (date) => {
  return `${new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(new Date(date))}`
}

