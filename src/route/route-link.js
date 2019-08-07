class RouteLink extends HTMLElement {

  constructor() {
    super()
    this._activateRouteBind = this._activateRoute.bind(this)
    this._isActivatedBind = this._isActivated.bind(this)
    this._basePath = `${window.location.origin}/`
  }

  connectedCallback() {
    this.addEventListener('click', this._activateRouteBind)
    window.addEventListener('url-change', this._isActivatedBind)
    window.addEventListener('popstate', this._isActivatedBind)
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._activateRouteBind)
    window.removeEventListener('url-change', this._isActivatedBind)
    window.removeEventListener('popstate', this._isActivatedBind)
  }

  _isActivated() {
    const currentPath = this._getAdjustedPath(decodeURI(window.location.pathname))
    this.classList.remove('active')
    if (currentPath && this.dataset.route && this.dataset.route.includes(currentPath)) {
      this.classList.add('active')
    }
    if (!currentPath.length && this.dataset.route === '/') {
      this.classList.add('active')
    }
  }

  _getAdjustedPath(path) {
    return path ? path.trim().split('/')
      .filter(pathName => pathName.length)
      .join('/') : ''
  }

  _activateRoute() {
    if (!this._isDisabled()) {
      if (this.dataset.title && this.dataset.title.length) {
        document.title = this.dataset.title
      }
      let route = this._getAdjustedPath(this.dataset.route || '')
      if (this.dataset.back && this.dataset.back.toLowerCase() === 'true') {
        const path = window.sessionStorage.getItem('last-route-path')
        if (path) {
          route = this._getAdjustedPath(path)
        } else {
          return window.history.back()
        }
      }
      window.history.pushState(route, document.title, `${this._basePath}${route}`)
      window.dispatchEvent(new CustomEvent('url-change', { detail: route }))
    }
  }

  _isDisabled() {
    return this.dataset.disabled && this.dataset.disabled.toLowerCase() === 'true'
  }

}

window.customElements.define('route-link', RouteLink)
export default RouteLink
