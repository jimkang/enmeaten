const d3 = require('d3-shape');
const scaleToFit = require('scale-to-fit');

function meatToHTML(opts) {
  var { title, originalLine, meatPoints, curve } = opts;

  if (!curve) {
    curve = d3.curveLinearClosed;
  }

  const boneLine = d3.line();
  boneLine.curve(d3.curveLinear);
  const meatLine = d3.line();
  meatLine.curve(curve);
  const meatPath = meatLine(meatPoints);

  const bounds = getBounds(originalLine.concat(meatPoints));

  const boardWidth = 480;
  const boardHeight = 480;
  const margin = 20;

  var matrixPoints = scaleToFit({
    view: {
      left: 0,
      top: 0,
      right: boardWidth - 2 * margin,
      bottom: boardHeight - 2 * margin
    },
    content: bounds
  });

  matrixPoints[4] += margin;
  matrixPoints[5] += margin;

  return `  <p>${title}</p>
    <svg width="${boardWidth}" height="${boardHeight}">
      <g transform="matrix(${matrixPoints.join(' ')})">
        <path d=${boneLine(originalLine)} class="original-line"></path>
        <path d=${meatPath} class="meat-line"></path>
        ${meatPoints.map(getMeatPointCircle).join('\n')}
      </g>
    </svg>
    `;
}

function getBounds(points) {
  var left = 0;
  var right = 0;
  var top = 0;
  var bottom = 0;

  points.forEach(updateBoundsForPoint);

  function updateBoundsForPoint(point) {
    if (point[0] < left) {
      left = point[0];
    } else if (point[0] > right) {
      right = point[0];
    }

    if (point[1] < top) {
      top = point[1];
    } else if (point[1] > bottom) {
      bottom = point[1];
    }
  }

  return {
    left: left,
    right: right,
    bottom: bottom,
    top: top
  };
}

function getMeatPointCircle(point) {
  return `<circle r="1" cx="${point[0]}" cy="${
    point[1]
  }" class="control-point"></circle>`;
}

module.exports = meatToHTML;
