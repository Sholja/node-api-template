import 'app-module-path/register';
import config from 'config';

config.init().then(() => {
    require(`./server`);
});
