class AppHeader extends HTMLElement {
    connectedCallback() {
        //
        fetch("/template/header")
        .then(x => x.text())
        .then(y => this.innerHTML = y);
    }
}
window.customElements.define('app-header', AppHeader)