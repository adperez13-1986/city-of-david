import './style.css';
import { mount } from './ui/render.ts';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Missing #app root');

mount(app);
