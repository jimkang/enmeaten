/* global __dirname */

var test = require('tape');
var Enmeaten = require('../index');
var meatToHTML = require('../tools/meat-to-html');
var fs = require('fs');
var queue = require('d3-queue').queue;
var seedrandom = require('seedrandom');
var d3 = require('d3-shape');

const tolerance = 0.001;
var resultHTMLFragments = [];

var testCases = [
  {
    name: 'Three-segment bone, high rounding',
    seed: 'asdf',
    renderCurve: d3.curveBasisClosed,
    opts: {
      bone: [
        [30, 50],
        [0, 20],
        [10, -10],
        [0, -30]
      ],
      extraRoundness: 20
    },
    expected: [
      [ 60.41348671995223, 69.26187492263641 ],
      [ 43.93895986159147, 9.627418612029667 ],
      [ 55.033099533511745, -13.200403845366832 ],
      [ -7.735737130957593, -51.660063966681264 ],
      [ -54.36044337078394, -21.63685486603324 ],
      [ -35.033099533511745, -6.799596154633169 ],
      [ -43.93895986159147, 30.372581387970335 ],
      [ 8.366692347216063, 82.4499614791759 ]
    ]
  },

{
    name: 'Three-segment bone, symmetrical ends',
    seed: 'asdf',
    renderCurve: d3.curveBasisClosed,
    opts: {
      bone: [
        [30, 50],
        [0, 20],
        [10, -10],
        [0, -30]
      ],
      symmetricalEnds: true
    },
    expected: [
      [ 63.494702141415296, 36.80511733823034 ],
      [ 27.718143370462627, 13.456633954485687 ],
      [ 38.4083627199677, -12.018920177188843 ],
      [ 38.07933573285286, -65.41135679615616 ],
      [ -51.176686876636644, -20.78334549141141 ],
      [ -18.4083627199677, -7.981079822811156 ],
      [ -27.718143370462627, 26.54336604551431 ],
      [ 16.80511733823034, 83.4947021414153 ]
    ]
  },

  {
    name: 'Two-segment bone',
    seed: 'asdf',
    renderCurve: d3.curveBasisClosed,
    opts: {
      bone: [
        [30, 50],
        [0, 20],
        [10, -10]
      ]
    },
    expected: [
      [ 60.41348671995223, 69.26187492263641 ],
      [ 30.776835371752536, 12.734574719946394 ],
      [ 32.41099750097626, -15.171768654071444 ],
      [ -4.171445780818278, -63.14292167806854 ],
      [ -30.776835371752536, 27.265425280053606 ],
      [ 8.366692347216063, 82.4499614791759 ]
    ]
  },

  {
    name: 'Five-segment bone',
    seed: 'asdf',
    opts: {
      bone: [
        [200, 100],
        [140, 60],
        [130, 30],
        [50, 50],
        [10, 0]
      ],
      forkLengthRange: [150, 300]
    },
    expected: [
      [ 483.8761762317378, 216.8901902130685 ],
      [ 182.65768995995043, 27.41823382195581 ],
      [ 155.82999698140185, -17.053812342261615 ],
      [ 67.1670084268687, -0.8580752847747775 ],
      [ -103.62216375019129, -199.97500820033667 ],
      [ -382.03742002805666, 164.1086874536051 ],
      [ 32.832991573131295, 100.85807528477477 ],
      [ 104.17000301859815, 77.05381234226161 ],
      [ 97.34231004004957, 92.58176617804419 ],
      [ 62.548917792547, 397.81067811614815 ]
    ]
  },

  {
    name: 'Five-segment bone, crunched',
    seed: 'asdf',
    opts: {
      bone: [
        [100, 100],
        [50, 60],
        [70, 30],
        [25, 75],
        [10, 0]
      ],
      forkLengthRange: [1, 10]
    },
    expected: [
      [ 105.36656314599949, 102.68328157299975 ],
      [ 83.23587887088291, 54.83992677571347 ],
      [ 91.32362096508153, 3.9893639267023033 ],
      [ 34.74661747813862, 42.80910924291092 ],
      [ 10, -3 ],
      [ 0.17429754302932388, -1.8589166810485063 ],
      [ 15.253382521861381, 107.19089075708908 ],
      [ 48.67637903491847, 56.0106360732977 ],
      [ 16.764121129117086, 65.16007322428652 ],
      [ 97.0476564599926, 105.22337703232081 ]
    ]
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
    },
    expected: [
      [ 217.8010178816764, 85.43553082408296 ],
      [ 155.8154492326627, 47.92022565255798 ],
      [ 139.57653839958817, 12.554676987878302 ],
      [ 56.36471291593001, 31.144236631368038 ],
      [ 27.481471850075188, -9.510390353244084 ],
      [ 18.386116867344693, -22.384221034169105 ],
      [ 20.9595895635795, -20.122158804701186 ],
      [ 36.91946671994827, -15.488793903316296 ],
      [ 84.36154928478854, -60.58283567169475 ],
      [ 126.67763300586826, -45.04607308411181 ],
      [ 163.4676231735083, -70.16828229104492 ],
      [ 75.63845071521146, -99.41716432830525 ],
      [ 29.080533280051732, -54.51120609668371 ],
      [ 19.0404104364205, -59.877841195298814 ],
      [ -18.386116867344693, -37.6157789658309 ],
      [ -7.481471850075188, 9.510390353244084 ],
      [ 43.63528708406999, 68.85576336863195 ],
      [ 120.42346160041184, 47.4453230121217 ],
      [ 124.1845507673373, 72.07977434744203 ],
      [ 212.14810563784474, 110.41266197529549 ] 
    ]
  }

];

((function go() {
  var q = queue(1);
  testCases.forEach(queueTestRun);
  q.awaitAll(writeOutHTMLFragments);

  function queueTestRun(testCase) {
    q.defer(runTest, testCase);
  }
})());

function runTest(testCase, done) {
  test(testCase.name, basicTest);

  function basicTest(t) {
    var enmeaten = Enmeaten({
      random: seedrandom(testCase.seed)
    });
    var meatPoints = enmeaten(testCase.opts);

    resultHTMLFragments.push(meatToHTML({
      title: testCase.name,
      originalLine: testCase.opts.bone,
      meatPoints: meatPoints,
      curve: testCase.renderCurve
    }));

    console.log(meatPoints);
    meatPoints.forEach(comparePair);
    t.end();
    done();

    function comparePair(pair, i) {
      t.ok(
        Math.abs(pair[0] - testCase.expected[i][0]) < tolerance &&
        Math.abs(pair[1] - testCase.expected[i][1]) < tolerance,
        'Control point is correct.'
      );
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
