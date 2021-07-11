// DOM event listeners

const uiDataEls = document.querySelectorAll('.ui-data')
const btnSubEl = document.querySelector('.btn-submit')
const errorEl = document.querySelector('.error')
const btnResetEl = document.querySelector('.btn-reset')

// Reset button
export const btnResetElement = btnResetEl.addEventListener('click', () => {
    document.querySelector('.city-entered').value = ''
    document.querySelector('.date').value = ''

    uiDataEls.forEach(uiDataEl => {
        uiDataEl.classList.add('hide')
    })
    errorEl.classList.add('hide')
    localStorage.clear()
})


// Submit button
export const btnSubElement = btnSubEl.addEventListener('click', async () => {
    const city = document.querySelector('.city-entered').value
    const date = document.querySelector('.date').value

    if(city == '' || date == '') {
        errorEl.innerHTML = '<i class="fas fa-exclamation-triangle"></i>City or Date incorrect, please re-enter input'
        errorEl.classList.remove('hide')
        return
    }
    // console.log(city)
    // console.log(date)
    // const serverResp = await Client.makePost('http://localhost:8080/getCityInfo', {city, date})
    const serverResp = await Client.makePost('/getCityInfo', {city, date})
    // console.log(serverResp)
    Client.updateUI(serverResp)
})