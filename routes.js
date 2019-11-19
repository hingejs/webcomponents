import { Router } from 'https://cdn.jsdelivr.net/npm/@hingejs/services/index.min.js'
Router.setPath('tutorials/route.html', async (req, next) => {
    const routeDisplay = document.querySelector('h-route-display')
    await routeDisplay.insertContent(HtmlCache.get('tutorials/route.html'))
    next()
  })
Router.setPath('tutorials/test.html', async (req, next) => {
    const routeDisplay = document.querySelector('h-route-display')
    await routeDisplay.insertContent(HtmlCache.get('tutorials/test.html'))
    next()
  })