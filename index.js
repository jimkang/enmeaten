var createProbable = require('probable').createProbable;
var ForkBone = require('fork-bone');
var widenBend = require('widen-bend');
var d3 = require('d3-shape');
var line = d3.line();

function Enmeaten(createOpts) {
  var random;
  if (createOpts) {
    random = createOpts.random;
  }
  var probable = createProbable({
    random: random
  });
  var forkBone = ForkBone({
    random: random
  });

  return enmeaten;

  // Re: "alpha" and "beta": Imagine the bone is pointing up, and we are starting
  // at the bottom of the bone. Then, the meat control points around it on the
  // left would be in alpha, and the ones on the right would be in beta. alpha starts 
  // from the bottom and goes up, and beta starts from the top and goes down.
  // Concatenating them gives you all of the control points in clockwise order.
  // 
  // The bone might not be oriented this way, but alpha and beta will still put the
  // points in that order.

  function enmeaten(opts) {
    var bone;
    var curve;

    if (opts) {
      bone = opts.bone;
      curve = opts.curve;
    }

    if (!curve) {
      curve = d3.curveBasisClosed;
    }

    line.curve(curve);


    var alpha = [];
    var beta = [];

    bone.forEach(enmeatenPoint);
    var controlPoints = alpha.concat(beta);

    return {
      controlPoints: controlPoints,
      path: line(controlPoints)
    };

    function enmeatenPoint(point, i) {
      if (i === 0 && bone.length > 1) {
        var startFork = forkBone({
          line: [
            bone[1],
            point
          ],
          lengthRange: [20, 40] // lengthRange currently not used.
        });
        alpha.push(startFork[0]);
        beta.unshift(startFork[1]);
      }
      else if (i === bone.length - 1 && bone.length > 1) {
        var endFork = forkBone({
          line: [
            bone[i - 1],
            point
          ],
          lengthRange: [20, 40] // lengthRange currently not used.
        });
        alpha.push(endFork[1]);
        beta.unshift(endFork[0]);
      }
      else if (bone.length > 2) {
        var a = bone[i - 1];
        var widenPoints = widenBend({
          start: a,
          elbow: point,
          end: bone[i + 1],
          widenDistance: 30
        });
        var ab = [point[0] - a[0], point[1] - a[1]];
        var eb = [widenPoints[1][0] - point[0], widenPoints[1][1] - point[1]];
        if (isVectorAToTheRightOfVectorB(eb, ab)) {
          alpha.push(widenPoints[0]);
          beta.unshift(widenPoints[1]);
        }
        else {
          alpha.push(widenPoints[1]);
          beta.unshift(widenPoints[0]);
        }
      }
    }

  }

  function between(a, b) {
    var range = b - a;
    var sign = range >= 0 ? 1 : -1;
    // TODO: Make this OK for really small numbers.
    var extent = sign * probable.roll(Math.abs(range));
    return a + extent;
  }
}

// If two vectors are at 90 degrees, to each other, their dot product is 0.
// So, if a vector and a vector rotated -90 degrees has a dot product of 0,
// those vectors have the same direction.
function isVectorAToTheRightOfVectorB(a, b) {
  var aRotatedNegative90 = [-a[1], a[0]];
  var dp = dotProduct(b, aRotatedNegative90);
  return (dp > 0);
}

function dotProduct(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}

function getVectorMagnitude(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}

function addPairs(a, b) {
  return [a[0] + b[0], a[1] + b[1]];
}

function subtractPairs(a, b) {
  return [a[0] - b[0], a[1] - b[1]];
}

function multiplyPairBySingleValue(pair, single) {
  return [pair[0] * single, pair[1] * single];
}

function getPerpendicularVector(v) {
  return [-v[1], v[0]];
}

function changeVectorMagnitude(v, newMagnitude) {
  var currentMagnitude = getVectorMagnitude(v);
  return multiplyPairBySingleValue(v, newMagnitude/currentMagnitude);
}

module.exports = Enmeaten;
