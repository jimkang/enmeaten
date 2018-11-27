var ForkBone = require('fork-bone');
var widenBend = require('widen-bend');
var math = require('basic-2d-math');

function Enmeaten(createOpts) {
  var random;
  var numberOfDecimalsToConsider;

  if (createOpts) {
    random = createOpts.random;
    numberOfDecimalsToConsider = createOpts.numberOfDecimalsToConsider;
  }
  var forkBone = ForkBone({
    random,
    numberOfDecimalsToConsider
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
    var forkLengthRange;
    var extraRoundness;
    var symmetricalEnds;
    var wideEnds;

    if (opts) {
      bone = opts.bone;
      forkLengthRange = opts.forkLengthRange;
      extraRoundness = opts.extraRoundness;
      symmetricalEnds = opts.symmetricalEnds,
      wideEnds = opts.wideEnds;
    }

    var alpha = [];
    var beta = [];

    var segmentCount = bone.length - 1;
    var endToEndDistance = math.getVectorMagnitude(
      math.subtractPairs(bone[segmentCount], bone[0])
    );
    var indexMidpoint = (segmentCount)/2;

    bone.forEach(enmeatenPoint);
    return alpha.concat(beta);

    function enmeatenPoint(point, i) {
      if (i === 0 && bone.length > 1) {
        var startFork = forkBone({
          line: [
            bone[1],
            point
          ],
          lengthRange: forkLengthRange,
          symmetrical: symmetricalEnds,
          obtuse: wideEnds
        });
        alpha.push(startFork[0]);
        beta.unshift(startFork[1]);
      }
      else if (i === segmentCount && bone.length > 1) {
        var endFork = forkBone({
          line: [
            bone[i - 1],
            point
          ],
          lengthRange: forkLengthRange,
          symmetrical: symmetricalEnds,
          obtuse: wideEnds
        });
        alpha.push(endFork[1]);
        beta.unshift(endFork[0]);
      }
      else if (bone.length > 2) {
        var a = bone[i - 1];
        var widenDistance = endToEndDistance/(segmentCount);
        // TODO: Should take some kind of interpolation function.
        if (!isNaN(extraRoundness)) {
          var extraWideningProportion = 1.0 - Math.abs(i - indexMidpoint)/segmentCount;
          widenDistance += extraWideningProportion * extraRoundness;
        }
        var widenPoints = widenBend({
          start: a,
          elbow: point,
          end: bone[i + 1],
          widenDistance: widenDistance
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

module.exports = Enmeaten;
