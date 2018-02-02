import { app, BrowserWindow, Menu, MenuItem, ipcMain, Tray } from 'electron';
import { path } from 'path';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Global reference to mainWindow
// Necessary to prevent win from being garbage collected
let mainWindow;

let appIcon = null;

const menu = new Menu();
menu.append(new MenuItem({ label: 'Hello' }));
menu.append(new MenuItem({ type: 'separator' }));
menu.append(new MenuItem({ label: 'Electron', type: 'checkbox', checked: true }));

function createMainWindow() {
    // Construct new BrowserWindow
    let win = new BrowserWindow();

    // Set url for `win`
    // points to `webpack-dev-server` in development
    // points to `index.html` in production
    global.url = isDevelopment ? 'http://localhost:9080' : `file://${__dirname}/index.html`;

    if (isDevelopment) win.webContents.openDevTools();

    win.loadURL(global.url);

    win.on('closed', () => {
        mainWindow = null;
    });

    return win;
}

ipcMain.on('put-in-tray', function(event) {
    console.log('Put in tray');
    const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png';
    const iconPath = path.join(__dirname, iconName);
    appIcon = new Tray(iconPath);
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Remove',
            click: function() {
                event.sender.send('tray-removed');
            }
        }
    ]);
    appIcon.setToolTip('Electron Demo in the tray.');
    appIcon.setContextMenu(contextMenu);
});

ipcMain.on('remove-tray', function() {
    appIcon.destroy();
});

app.on('browser-window-created', function(event, win) {
    win.webContents.on('context-menu', function(e, params) {
        menu.popup(win, params.x, params.y);
    });
});

ipcMain.on('show-context-menu', function(event) {
    const win = BrowserWindow.fromWebContents(event.sender);
    menu.popup(win);
});

// Quit application when all windows are closed
app.on('window-all-closed', () => {
    // On macOS it is common for applications to stay open
    // until the user explicitly quits
    if (process.platform !== 'darwin') app.quit();
    if (appIcon) appIcon.destroy();
});

app.on('activate', () => {
    // On macOS it is common to re-create a window
    // even after all windows have been closed
    if (mainWindow === null) mainWindow = createMainWindow();
});

// Create main BrowserWindow when electron is ready
app.on('ready', async () => {
    mainWindow = createMainWindow();

    // install custom dev tools
    if (isDevelopment) {
        const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');
        await installExtension(REACT_DEVELOPER_TOOLS);

        require('devtron').install();
    }
});
