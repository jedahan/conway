# conway - a server that calculates the next step for a game of life

This requires [nodejs](http://nodejs.org) v5, which should be installable via most package managers.
If you do not want to install node system-wide, I recommend using [n](https://github.com/tj/n).

### Setup

Install the library dependencies with `npm install`

Run the server with `npm start`

Open the test page with `npm test`, and play around

### Notes

This version is bounded, so no wrapping around for things like gliders :(

Try clicking on everything!

### Algorithm notes

So the algorithm is O(8(m*n)) which reduces down to O(c) where:
  m is the y-distance of the furthest apart living cells
  n is the x-distance of the furthest apart living cells
  c is the total number of cells
