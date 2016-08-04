enmeaten
==================

You give it a bone line, and it fleshes it out. The bone line is a series of points in order. The function returns a path that draws around the bone line, as well as the control points used to generate that path.

Installation
------------

    npm install enmeaten

Usage
-----

    var Enmeaten = require('enmeaten');
    var enmeaten = Enmeaten();
    
    console.log(enmeaten({
      bone: [
        [30, 50],
        [0, 20],
        [10, -10]
      ]
    }));

Output:

    {
      controlPoints: [
        [ 60, 45 ],
        [ 29.19746968403191, 13.107412383579167 ],
        [ 38, -30 ],
        [ -13, -28 ],
        [ -29.19746968403191, 26.892587616420833 ],
        [ 33, 80 ]
      ],
      path: 'M35.79831312268794,11.238274922386111C32.13164645602127,-1.2617250776138889,35.065823228010636,-15.630862538806944,28.032911614005318,-22.482097936070137C21,-29.333333333333332,4,-28.666666666666668,-7.199578280671985,-19.184568730596528C-18.39915656134397,-9.70247079452639,-23.79831312268794,8.595058410947223,-16.131646456021272,26.59505841094722C-8.464979789354606,44.59505841094722,12.267510105322698,62.29752920547361,27.133755052661346,65.31543126940348C42,68.33333333333333,51,56.666666666666664,50.36624494733865,45.51790206392986C49.73248989467731,34.369137461193056,39.46497978935461,23.73827492238611,35.79831312268794,11.238274922386111'
    }

[Check out some rendered examples.](http://jimkang.com/enmeaten)

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
