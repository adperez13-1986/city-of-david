import './style.css';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Missing #app root');

app.innerHTML = `
  <header class="topbar">
    <h1 class="title">City of David</h1>
    <p class="subtitle">A scribe's chronicle</p>
  </header>
  <main class="stage">
    <p class="placeholder">
      The desk is empty. The first scroll has not yet been drafted.
    </p>
  </main>
`;
