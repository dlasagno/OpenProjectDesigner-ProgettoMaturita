const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

// Mantenere un riferimento globale dell'oggetto window, altrimenti la finestra verrà
// chiusa automaticamente quando l'oggetto JavaScript è raccolto nel Garbage Collector.
let win;
const isDev = process.env.NODE_ENV === 'development'

function createWindow () {
  // Creazione della finestra del browser.
  win = new BrowserWindow({width: 800, height: 600});

  // e viene caricato il file index.html della nostra app.
  if(isDev) {
    win.loadURL(url.format({
      pathname: 'localhost:8080/',
      protocol: 'http:',
      slashes: true
    }));

    win.webContents.openDevTools();
  }
  else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, '../dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));

    win.setMenu(null);
  }

  // Emesso quando la finestra viene chiusa.
  win.on('closed', () => {
    // Eliminiamo il riferimento dell'oggetto window;  solitamente si tiene traccia delle finestre
    // in array se l'applicazione supporta più finestre, questo è il momento in cui
    // si dovrebbe eliminare l'elemento corrispondente.
    win = null;
  });
}

// Questo metodo viene chiamato quando Electron ha finito
// l'inizializzazione ed è pronto a creare le finestre browser.
// Alcune API possono essere utilizzate solo dopo che si verifica questo evento.
app.on('ready', createWindow);

// Terminiamo l'App quando tutte le finestre vengono chiuse.
app.on('window-all-closed', () => {
  // Su macOS è comune che l'applicazione e la barra menù
  // restano attive finché l'utente non esce espressamente tramite i tasti Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // Su macOS è comune ri-creare la finestra dell'app quando
  // viene cliccata l'icona sul dock e non ci sono altre finestre aperte.
  if (win === null) {
    createWindow();
  }
});

// in questo file possiamo includere il codice specifico necessario
// alla nostra app. Si può anche mettere il codice in file separati e richiederlo qui.
