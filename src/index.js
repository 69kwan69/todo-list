import './style/reset.css';
import './style/style.css';

import logoURL from './images/logo.png'
import userAvatarURL from './images/user.png'

import { initialLoadContent, initialLoadSideBar, initialLoadHeader, initialLoadAside } from './ui/load';

function load() {
    initialLoadHeader(logoURL, userAvatarURL);
    initialLoadAside();
    initialLoadSideBar();
    initialLoadContent('Personal');
}

load();
