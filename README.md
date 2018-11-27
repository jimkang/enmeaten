enmeaten
==================

You give it a bone line, and it fleshes it out. The bone line is just a series of points in order. The function returns control points that can be used to draw a line around the bone using Beziér curves or your line interpolation method of choice. (The examples linked below use various forms of [d3-line](https://github.com/d3/d3-line).)

Installation
------------

    npm install enmeaten

Usage
-----

    var Enmeaten = require('enmeaten');
    var enmeaten = Enmeaten({
      numberOfDecimalsToConsider: 4
    });
    
    console.log(enmeaten({
      bone: [
        [30, 50],
        [0, 20],
        [10, -10]
      ],
      forkLengthRange: [10, 25]
    }));

Output:

    [
      [ 60, 45 ],
      [ 29.19746968403191, 13.107412383579167 ],
      [ 38, -30 ],
      [ -13, -28 ],
      [ -29.19746968403191, 26.892587616420833 ],
      [ 33, 80 ]
    ]

[Check out some rendered examples.](http://jimkang.com/enmeaten)

You can also provide an `extraRoundness` opt (a number) to make it that much meatier in the middle of the bone. 

`symmetricalEnds` will make the ends of the meat symmetrical along the axis of the bone.
`wideEnds` will make the ends of the meat wide, rather than narrow.
`widthInterpolator` is a function you provide to alter the width at the "elbows" of the bone. The function signature is ({ width, start, elbow, end, endToEndDistance }), where `width` is the width it was planning to use at the elbow. `endToEndDistance` is the total length of the bone. The other three opts are [x, y] values of the bend it is currently working on. enmeaten expects the interpolator to return a new width.

When creating an Enmeaten instance, the following opts can be specified:

  - `random`: A function that behaves like `Math.random`. You can substitute one created by [seedrandom](https://github.com/davidbau/seedrandom) or something you've written yourself. Helps with situations in which you want reproducible results.
  - `numberOfDecimalsToConsider`: A positive number that tells it how precise to be when picking numbers in a range. If it encounters a range of 0.001, by default, it will always pick 0. (If the range is 100, it'll pick a whole number between 0 and 99.) If you specify 3 as `numberOfDecimalsToConsider`, it can pick numbers like 0.003 and 0.995. Useful for working for points that are really close together.

Tests
-----

Run tests with `make test`.

Tests and tools require Node 6. Module itself should work in all versions of Node and modern browsers.

License
-------

The MIT License (MIT)

Copyright (c) 2016 Jim Kang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
