import { SimonGame } from './webcomponents/simongame.js';

customElements.define('simon-game', SimonGame);

// register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .catch(console.error);
}