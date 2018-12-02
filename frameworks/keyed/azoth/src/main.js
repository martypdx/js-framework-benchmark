import app from './app';
import store from './store';
import measurer from './measurer';

measurer.start('load');
document.querySelector('#main').append(app(store));
measurer.stop();