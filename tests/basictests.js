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
      [ 29.19746968403191, 13.107412383579167 ],
      [ 39.23173587083859, -16.745785200962754 ],
      [ -4.42910843137861, -64.10915661766978 ],
      [ -29.19746968403191, 26.892587616420833 ],
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
      [ 163.84120031807225, 41.79019035262721 ],
      [ 144.43627474499837, 3.701825700499242 ],
      [ 59.594567524666004, 21.575639426459833 ],
      [ -4.820282228285823, -26.083696721783046 ],
      [ -41.65669534487335, 21.623732935063263 ],
      [ 40.405432475333996, 78.42436057354017 ],
      [ 115.56372525500163, 56.29817429950076 ],
      [ 116.15879968192775, 78.2098096473728 ],
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
      [ 79.64484105212858, 55.3974573338173 ],
      [ 89.01966716816614, 6.7997357598629335 ],
      [ 33.6935244606529, 46.28723920532841 ],
      [ 10, -30 ],
      [ -45.02393375903579, -10.409933413871636 ],
      [ 16.306475539347097, 103.7127607946716 ],
      [ 50.980332831833856, 53.20026424013707 ],
      [ 20.355158947871423, 64.6025426661827 ],
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
      [ 163.84120031807225, 41.79019035262721 ],
      [ 144.43627474499837, 3.701825700499242 ],
      [ 59.594567524666004, 21.575639426459833 ],
      [ 36.3526673255436, -14.336559030298266 ],
      [ 27.716385975338603, -18.519497029047308 ],
      [ 21.446545505718696, -10.034895192910053 ],
      [ 38.90845001211337, -5.587583940547194 ],
      [ 86.57487300335644, -50.72934840168851 ],
      [ 126.12084690307596, -37.06547227742204 ],
      [ 167.40847019278698, -70.85364699004991 ],
      [ 73.42512699664356, -109.27065159831149 ],
      [ 27.09154998788663, -64.41241605945281 ],
      [ 18.553454494281304, -69.96510480708994 ],
      [ -27.716385975338603, -41.48050297095269 ],
      [ -16.3526673255436, 14.336559030298266 ],
      [ 40.405432475333996, 78.42436057354017 ],
      [ 115.56372525500163, 56.29817429950076 ],
      [ 116.15879968192775, 78.2098096473728 ],
      [ 212.14810563784474, 110.41266197529549 ]
    ]
  }

];

((function go() {
  var q = queue(1);
  testCases.forEach(queueTestRun);
  q.awaitAll(writeOutHTMLFragments)

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
        'Contol point is correct.'
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
