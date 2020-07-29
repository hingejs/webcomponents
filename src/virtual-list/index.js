const TAG_NAME = 'h-virtual-list'
if (!window.customElements.get(TAG_NAME)) {
  window.customElements.define(TAG_NAME, class extends window.HTMLElement {

    constructor() {
      super()
      this.isKeyDown = false
    }

    _generateTemplate() {
      return `
        <style>
        virtual-list .v-container {
          contain: strict;
          height: 14rem;
          overflow-y: auto;
          position: relative;
          will-change: scroll-position;
        }
        virtual-list .v-list {
          height: 100%;
          left: 0;
          max-height: 100vh;
          max-width: 100vw;
          position: absolute;
          top: 0;
          width: 100%;
        }
        virtual-list .v-item {
          display: block;
        }
        virtual-list .v-push {
          box-sizing: border-box;
          opacity: 0;
          width: 1px;
        }
        </style>
        <div class="v-container">
          <div class="v-push"></div>
          <div class="v-list"></div>
        </div>
      `
    }

    connectedCallback() {
      this.innerHTML = this._generateTemplate()
      this.$container = this.querySelector('div.v-container')
      this.$list = this.$container.querySelector('div.v-list')
      this.$push = this.$container.querySelector('div.v-push')
      this.listItems = []
      this.displayAmt = 4

      this.adjustScrollBind = this.debounce.bind(this, this.adjustScroll.bind(this))
      this.$container.addEventListener('scroll', this.adjustScrollBind)
    }

    stopScroll() {
      this.$container.style.overflowY = 'hidden'
    }

    startScroll() {
      this.$container.style.overflowY = 'auto'
    }

    vItemDown() {
      this.isKeyDown = true
      const selectedDiv = this.$list.querySelector('.selected')
      if (selectedDiv) {
        if (selectedDiv.nextElementSibling && selectedDiv.nextElementSibling.nextElementSibling) {
          selectedDiv.classList.remove('selected')
          selectedDiv.nextElementSibling.classList.add('selected')
        } else if (this.listItems.length >= this.displayAmt && !selectedDiv.nextElementSibling) {
          selectedDiv.classList.remove('selected')
          selectedDiv.previousElementSibling.classList.add('selected')
        } else {
          this.$container.scrollTop += this.itemHeight
          this.adjustScroll()
        }
      } else {
        this.viewPortItems[0].classList.add('selected')
      }
    }

    vItemUp() {
      this.isKeyDown = true
      const selectedDiv = this.$list.querySelector('.selected')
      if (selectedDiv) {
        if (this.lastTopItem === 0 && selectedDiv.previousElementSibling && !selectedDiv.previousElementSibling.previousElementSibling) {
          selectedDiv.classList.remove('selected')
          this.viewPortItems[0].classList.add('selected')
          this.$container.scrollTop = 0
        } else if (selectedDiv.previousElementSibling && selectedDiv.previousElementSibling.previousElementSibling) {
          selectedDiv.classList.remove('selected')
          selectedDiv.previousElementSibling.classList.add('selected')
        } else if (!selectedDiv.previousElementSibling && this.lastTopItem !== 0) {
          selectedDiv.classList.remove('selected')
          this.viewPortItems[1].classList.add('selected')
        } else {
          this.$container.scrollTop -= this.itemHeight
          this.adjustScroll()
        }
      } else {
        this.viewPortItems[0].classList.add('selected')
      }
    }

    triggerSelected() {
      const selectedElement = this.$list.querySelector('.selected')
      if (selectedElement) {
        this.dispatchEvent(new CustomEvent('v-item-selected', { detail: selectedElement.cloneNode(true) }))
      }
    }

    async render({ listItems, tag, displayAmt = 4 }) {
      if (!Array.isArray(listItems) ||
        !listItems.length ||
        !tag ||
        JSON.stringify(listItems) === JSON.stringify(this.listItems)) {
        return
      }
      let doInit = true
      if (this.listItems.length) {
        doInit = false
      }
      const RENDER = !!(this.tag !== tag || this.displayAmt !== displayAmt)

      this.listItems = listItems
      this.tag = tag
      this.displayAmt = displayAmt
      this.itemHeight = await this._discoverElementHeight()
      this.listItemsLength = this.listItems.length
      this.totalHeight = this.itemHeight * this.listItems.length
      this.$push.style.height = `${this.totalHeight}px`
      const listViewAmt = Math.min(this.displayAmt, this.listItemsLength)
      this.$container.style.height = `${this.itemHeight * listViewAmt}px`
      const listAmtEnd = this.listItems.length - listViewAmt
      this.scrollMax = this.itemHeight * (listAmtEnd)

      if (RENDER) {
        this.$list.innerHTML = ''
        this.viewPortItems = []
        Array.from(new Array(listViewAmt)).forEach(() => {
          const tag = document.createElement(this.tag)
          tag.style.height = `${this.itemHeight}px`
          tag.classList.add('v-item')
          tag.addEventListener('click', this.triggerSelected.bind(this))
          tag.addEventListener('mouseover', () => {
            if (!this.isKeyDown) {
              this.viewPortItems.forEach(viewDiv => { viewDiv.classList.remove('selected') })
              tag.classList.add('selected')
            }
          })
          tag.addEventListener('mouseout', () => {
            if (!this.isKeyDown) {
              tag.classList.remove('selected')
            }
          })
          tag.addEventListener('mousemove', () => {
            this.isKeyDown = false
          })
          this.$list.appendChild(tag)
          this.viewPortItems.push(tag)
        })
      }
      this.viewPortItemsLength = this.viewPortItems.length
      this.adjustList()
      if (doInit) {
        this.$container.scrollTop = 0
      }
      this.lastTopItem = -1
      this.adjustScroll()
    }

    debounce(func) {
      if (this.timer) {
        window.cancelAnimationFrame(this.timer)
      }
      this.timer = window.requestAnimationFrame(func)
    }

    adjustScroll() {
      if (!this.listItems.length || !this.viewPortItemsLength) {
        return
      }
      const scrollTop = this.$container.scrollTop
      const topItem = Math.floor(scrollTop / this.itemHeight)

      if (topItem !== this.lastTopItem) {
        let translateY = scrollTop
        if (topItem <= this.lastTopItem) {
          translateY -= this.itemHeight
        }
        this.adjustList(translateY)
        const viewportItems = this.listItems.slice(topItem, topItem + this.viewPortItemsLength)
        this.viewPortItems.forEach((tag, i) => {
          tag.style.display = (typeof viewportItems[i] === 'undefined') ? 'none' : 'block'
          tag.updateModel(viewportItems[i])
        })
      }
      if (topItem === 0) {
        this.adjustList()
      }
      if (this.atScrollEnd()) {
        this.adjustList(this.scrollMax)
      }
      this.lastTopItem = topItem
    }

    adjustList(pos = 0) {
      this.$list.style.transform = `translateY(${pos}px)`
    }

    atScrollEnd() {
      return !!(this.$container.scrollTop > this.totalHeight)
    }

    _discoverElementHeight() {
      return new Promise(resolve => {
        const tag = document.createElement(this.tag)
        tag.classList.add('v-item')
        tag.style.visibility = 'hidden'
        /* Find potential largest row */
        const mapLengths = this.listItems.map(listItem => undefined === listItem ? '' : JSON.stringify(listItem).length)
        const maxIndex = mapLengths.indexOf(Math.max(...mapLengths))
        tag.updateModel(this.listItems[maxIndex])
        this.$list.appendChild(tag)
        /* Extra time given to make sure browser has time to process */
        const MAX_TRIES = 5
        let currentTry = 0
        const findHeight = () => {
          const height = Math.ceil(tag.offsetHeight)
          currentTry++
          if (height > 0 || currentTry > MAX_TRIES) {
            tag.remove()
            resolve(height)
          } else {
            window.requestAnimationFrame(findHeight)
          }
        }
        window.requestAnimationFrame(findHeight)
      })
    }

  })
}
