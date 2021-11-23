//******** QUERY

//https://www.book-secure.com/index.php?s=results&group=ascentral&property=thphu18547&arrival=2021-11-26&departure=2021-12-05&adults1=2&children1=1&childrenAges1=5&locale=en_GB&currency=THB&stid=nof7txqgs&Clusternames=ascentral&cluster=ascentral&Hotelnames=Asia-Centara-Grand-Beach-Resort-Phuket&hname=Asia-Centara-Grand-Beach-Resort-Phuket&arrivalDateValue=2021-11-22&frommonth=11&fromday=22&fromyear=2021&nbdays=8&nbNightsValue=8&adulteresa=2&nbAdultsValue=2&enfantresa=1&nbChildrenValue=1&redir=BIZ-so5523q0o4&rt=1637605699

//*******SPECS

//check in
//check out
//min price
//currency of price - ISO
//number of rooms search
//number guests (adult/children)
//total guests
//language 2code

//******** CODE

const dataScrap = () => {
  const location = window.location
  if (location.hostname !== 'www.book-secure.com')
    throw new Error('Could not run script: wrong address')

  const urlQueryString = location.search
  const urlParams = new URLSearchParams(urlQueryString)

  const listOfPrices = []
  const checkInDate = urlParams.get('arrival')
  const checkOutDate = urlParams.get('departure')
  const currency = urlParams.get('currency')
  const numOfAdults = Number(urlParams.get('adults1'))
  const numOfChildren = Number(urlParams.get('children1'))
  const totalGuests = numOfAdults + numOfChildren
  const language = urlParams.get('locale').slice(0, 2).toUpperCase()

  const numOfNights =
    (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) /
    (1000 * 3600 * 24)

  const numOfRooms = Number(
    document
      .querySelector('#fb-qs-summary-rooms-quantity span')
      .getAttribute('data-placeholders')
      .replace(/\W/g, ''),
  )

  const domPriceSpanElem = document.querySelectorAll(
    '.new-price .fb-price span',
  )
  
  domPriceSpanElem.forEach((elem) => {
    if (elem.childNodes[1])
      listOfPrices.push(
        Number(elem.childNodes[1].textContent.trim().replace(',', '')),
      )
  })

  const minTotalPrice = Math.min(...listOfPrices)
  const minPricePerNight = Number((minTotalPrice / numOfNights).toFixed(2))

  return {
    checkInDate: checkInDate,
    checkOutDate: checkOutDate,
    minPricePerNight: minPricePerNight,
    currency: currency,
    numOfRooms: numOfRooms,
    numOfGuestsDetail: {
      adults: numOfAdults,
      children: numOfChildren,
    },
    totalGuests: totalGuests,
    language: language,
  }
}

dataScrap()
