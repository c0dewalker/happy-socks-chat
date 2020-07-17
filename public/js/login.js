const form = document.querySelector('#login-form')
const errorMessage = document.querySelector('.error')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const response = await fetch('/auth/login', {
    method: 'post',
    body: new FormData(form)
  })
  const responseJson = await response.json()
  if (response.status === 200)
    window.location = 'http://localhost:3000/home/'
  else if (response.status >= 400) {
    errorMessage.innerText = responseJson.message
    if (errorMessage.classList.contains('invisible'))
      errorMessage.classList.remove('invisible')
  }
})
