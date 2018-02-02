import React, { Component } from 'react';
import styles from './HelloWorld.scss';
import cx from 'classnames';
// const BrowserWindow = require('electron').remote.BrowserWindow;
import { remote, ipcRenderer } from 'electron';
const BrowserWindow = remote.BrowserWindow;
let url = remote.getGlobal('url');

const trayBtn = document.getElementById('put-in-tray');
let trayOn = false;

trayBtn.addEventListener('click', function(event) {
    if (trayOn) {
        trayOn = false;
        document.getElementById('tray-countdown').innerHTML = '';
        ipcRenderer.send('remove-tray');
    } else {
        trayOn = true;
        const message = 'Click demo again to remove.';
        document.getElementById('tray-countdown').innerHTML = message;
        ipcRenderer.send('put-in-tray');
    }
});
// Tray removed from context menu on icon
ipcRenderer.on('tray-removed', function() {
    ipcRenderer.send('remove-tray');
    trayOn = false;
    document.getElementById('tray-countdown').innerHTML = '';
});

export default class HelloWorld extends Component {
    constructor({ isOpen }) {
        super();
        this.isOpen = isOpen;
    }

    openWindow() {
        let win = new BrowserWindow();
        win.on('close', () => {
            win = null;
        });
        win.webContents.openDevTools();
        win.loadURL(url + '#foo');
        win.show();
    }

    render() {
        return (
            <div className={cx(styles.HelloWorld)}>
                {this.isOpen && <p onClick={this.openWindow}>Hello World!</p>}
                <p id="put-in-tray">TrayButton</p>
            </div>
        );
    }
}
