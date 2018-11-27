/* global __dirname */

var test = require('tape');
var Enmeaten = require('../index');
var meatToHTML = require('../tools/meat-to-html');
var fs = require('fs');
var queue = require('d3-queue').queue;
var seedrandom = require('seedrandom');
var d3 = require('d3-shape');

var resultHTMLFragments = [];

var testCases = [
  {
    name: 'Three-segment bone, high rounding',
    seed: 'asdf',
    renderCurve: d3.curveBasisClosed,
    opts: {
      bone: [[30, 50], [0, 20], [10, -10], [0, -30]],
      extraRoundness: 20
    }
  },

  {
    name: 'Three-segment bone, symmetrical ends',
    seed: 'asdf',
    renderCurve: d3.curveBasisClosed,
    opts: {
      bone: [[30, 50], [0, 20], [10, -10], [0, -30]],
      symmetricalEnds: true
    }
  },

  {
    name: 'Three-segment bone, symmetrical and wide ends',
    seed: 'zxcv',
    renderCurve: d3.curveBasisClosed,
    opts: {
      bone: [[30, 50], [0, 20], [10, -10], [0, -30]],
      symmetricalEnds: true,
      wideEnds: true
    }
  },

  {
    name: 'Two-segment bone',
    seed: 'asdf',
    renderCurve: d3.curveBasisClosed,
    opts: {
      bone: [[30, 50], [0, 20], [10, -10]]
    }
  },

  {
    name: 'Five-segment bone',
    seed: 'asdf',
    opts: {
      bone: [[200, 100], [140, 60], [130, 30], [50, 50], [10, 0]],
      forkLengthRange: [150, 300]
    }
  },

  {
    name: 'Five-segment bone, crunched',
    seed: 'asdf',
    opts: {
      bone: [[100, 100], [50, 60], [70, 30], [25, 75], [10, 0]],
      forkLengthRange: [1, 10]
    }
  },

  {
    name: 'Ten-segment bone',
    seed: 'qwer ',
    renderCurve: d3.curveStepClosed,
    opts: {
      bone: [
        [200, 100],
        [140, 60],
        [130, 30],
        [50, 50],
        [10, 0],
        [0, -30],
        [20, -40],
        [33, -35],
        [80, -80],
        [128, -64]
      ]
    }
  }
];

(function go() {
  var q = queue(1);
  testCases.forEach(queueTestRun);
  q.awaitAll(writeOutHTMLFragments);

  function queueTestRun(testCase) {
    q.defer(runTest, testCase);
  }
})();

function runTest(testCase, done) {
  test(testCase.name, basicTest);

  function basicTest(t) {
    var enmeaten = Enmeaten({
      random: seedrandom(testCase.seed)
    });
    var meatPoints = enmeaten(testCase.opts);

    resultHTMLFragments.push(
      meatToHTML({
        title: testCase.name,
        originalLine: testCase.opts.bone,
        meatPoints: meatPoints,
        curve: testCase.renderCurve
      })
    );

    console.log(meatPoints);
    // I don't think there's much point in checking against specific
    // values if I'm not sure the values are right anyway. It's a better
    // idea to look at the rendered results.
    //meatPoints.forEach(comparePair);
    meatPoints.forEach(checkPair);
    t.end();
    done();

    function checkPair(pair) {
      t.ok(!isNaN(pair[0]), 'x in point is valid.');
      t.ok(!isNaN(pair[1]), 'y in point is valid.');
    }
  }
}

function writeOutHTMLFragments() {
  const html = `<html>
  <head>
    <title>Result graphs of basictests.js</title>
    <style>
        body {
          font-family: "Helvetica Neue", sans-serif;
        }

        path {
          fill: none;
          stroke-width: 1;
        }

        .original-line {
          stroke: #333;
          stroke-dashoffset: 10;
          stroke-dasharray: 3, 2;
        }

        .meat-line {
          stroke: hsl(327, 69%, 48%);
        }

        .control-point {
          fill: hsla(327, 80%, 50%, 0.8);
        }
    </style>
  </head>

  <body>
  ${resultHTMLFragments.join('\n')}
  </body>
  </html>
   `;
  var filepath = __dirname + '/basic-test-results.html';
  fs.writeFileSync(filepath, html);
  console.log('Wrote rendered test results to', filepath);
}
