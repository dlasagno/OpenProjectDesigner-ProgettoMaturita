export class ModalController {

  private modal = document.createElement('div')

  constructor() {
    //Initialize modal element
    this.modal.id = 'modal'
    document.body.appendChild(this.modal)
  }

  createModal({
    header = document.createElement('span'),
    body = document.createElement('span'),
    footer = document.createElement('span'),
    canBeClosed = true
  }: {header?: Element, body?: Element, footer?: Element, canBeClosed?: boolean}) {
    //Clear modal
    this.modal.innerHTML = `
      <div id="modal-content">
        <div id="modal-header"></div>
        <div id="modal-body"></div>
        <div id="modal-footer"></div>
      </div>
    `

    //Append modal parts
    if(header)
      this.modal.querySelector('#modal-header').appendChild(header)
    if(body)
      this.modal.querySelector('#modal-body').appendChild(body)
    if(footer)  
      this.modal.querySelector('#modal-footer').appendChild(footer)

    //Add the close button if allowed
    if(canBeClosed) {
      const closeButton = document.createElement('button')
        closeButton.classList.add('button', 'delete-button')
        closeButton.innerHTML = '<span class="fas fa-times"></span>'
        closeButton.addEventListener('click', () => this.closeModal())
      this.modal.querySelector('#modal-header').appendChild(closeButton)
    }

    //Show modal element to the user
    this.modal.classList.add('opened')
  }

  closeModal() {
    this.modal.classList.remove('opened')
  }

}