const xs = require('xstream').default;
const path = require('path');
const pathJoin = path.join;
const pathBasename = path.basename;

const timeDivider = ';';
const timeRegexp = new RegExp(`((?:\\d+${timeDivider}?)+)(?:\\..{3,4})$`);

const getStepStream = ({ path, steps }) => {
  const title = pathBasename(path);
  return xs
    .periodic(1000)
    .startWith(0)
    .take(steps.length + 1)
    .map(i => ({ title, file: steps[i].file, time: steps[i].time }));
};

function filesToSteps({ path, files }) {
  const parsedFiles = files
    .sort()
    .map(timeMatch)
    .filter(({ match }) => match)
    .map(({ match, file }) => ({ match, file: pathJoin(path, file) }))
    .map(timeSplit)
    .map(multiplyPerTime)
    .reduce((acc, times) => acc.concat(times), [])
    .map(multiplyPerSecond)
    .reduce((acc, times) => acc.concat(...times), []);

  return { path, steps: parsedFiles };
}

const timeMatch = file => ({ file, match: timeRegexp.exec(file) });

const timeSplit = ({ file, match }) => ({
  file,
  times: match[1].split(timeDivider),
});

const multiplyPerTime = ({ file, times }) =>
  times.map(time => ({ file, time: Number(time) }));

const multiplyPerSecond = ({ file, time }) =>
  [...Array(time + 1)].map((v, i) => ({ file, time: Number(time - i) }));

module.exports = {
  getStepStream,
  filesToSteps,
};
