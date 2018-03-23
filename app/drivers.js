const fs = require('fs');
const { dialog } = require('electron').remote;
const xs = require('xstream').default;
const beep = new Audio('./app/beep.mp3');

function listDirectoryDriver(sink$) {
  return sink$
    .map(() => xs.fromPromise(getDirectoryPath().then(listDirectory)))
    .flatten();
}

function beepDriver(sink$) {
  sink$.subscribe({
    next: () => {
      beep.play();
    },
    error: () => {},
    complete: () => {},
  });
}

function getDirectoryPath() {
  return new Promise(resolve => {
    dialog.showOpenDialog(
      { title: 'Select a folder', properties: ['openDirectory'] },
      paths => resolve(paths[0]),
    );
  });
}

function listDirectory(path) {
  return new Promise(resolve => {
    fs.readdir(path, (erro, files) => resolve({ path, files }));
  });
}

module.exports = { listDirectoryDriver, beepDriver };
