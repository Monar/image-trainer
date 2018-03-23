const { run } = require('@cycle/run');
const { makeDOMDriver, div, span, button, img, header } = require('@cycle/dom');

const { listDirectoryDriver, beepDriver } = require('./app/drivers');
const { filesToSteps, getStepStream } = require('./app/utils');

function main(sources) {
  const loadClicks$ = sources.DOM.select('.mui-btn').events('click');

  const steps$ = sources.FS.map(filesToSteps)
    .map(getStepStream)
    .flatten();

  const beep$ = steps$.filter(({ time }) => time === 0);

  const vdom$ = steps$
    .startWith({ title: '', file: '', time: '' })
    .map(({ title, file, time } = {}) =>
      div('.app', [
        header('.mui-appbar appbar', [
          button('.mui-btn .mui-btn--small', 'Select folder'),
          span('.file-path', title),
          span('.timer', time),
        ]),
        file &&
          div('.photo-wrapper', [img('.photo', { attrs: { src: file } })]),
      ]),
    );

  return {
    DOM: vdom$,
    FS: loadClicks$,
    BEEP: beep$,
  };
}

const drivers = {
  DOM: makeDOMDriver('#app'),
  FS: listDirectoryDriver,
  BEEP: beepDriver,
};

run(main, drivers);
