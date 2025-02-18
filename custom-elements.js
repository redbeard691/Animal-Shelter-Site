class AppHeader extends HTMLElement {
    connectedCallback() {
        fetch("/templates/header.html")
        .then(x => x.text())
        .then(y => this.innerHTML = y);
    }
}
window.customElements.define('app-header', AppHeader)