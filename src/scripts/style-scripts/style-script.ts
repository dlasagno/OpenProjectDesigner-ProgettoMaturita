const sideMenuToggler = document.querySelector('#side-menu-toggler')
const sideMenu = document.querySelector('#side-menu')
const tabNav = document.querySelector('#tab-nav')
const tabWindow = document.querySelector('#tab-window')

sideMenuToggler.addEventListener('click', () => {
  sideMenu.classList.toggle('opened')
  tabNav.classList.toggle('move-left')
})
