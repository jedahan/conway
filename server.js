'use strict'

const koa = require('koa')
const response_time = require('koa-response-time')
const logger = require('koa-logger')
const cors = require('koa-cors')
const serve = require('koa-static')
const app = koa()
require('koa-safe-jsonp')(app)
require('koa-qs')(app)
const router = require('koa-router')()

console.log('Environment:' + app.env)

app.use(response_time())
app.use(logger())
app.use(cors())
app.use(serve('static'))

router.get('/step', function * (next) {
  // parse query
  const m = parseInt(this.query.M, 10)
  const n = parseInt(this.query.N, 10)
  let liveCells = this.query.liveCells

  // calculate simulation bounds
  const xs = liveCells.map(coord => parseInt(coord[0], 10))
  const ys = liveCells.map(coord => parseInt(coord[1], 10))
  const minX = Math.max(0, Math.min(...xs) - 1)
  const maxX = Math.min(n, Math.max(...xs) + 1)
  const minY = Math.max(0, Math.min(...ys) - 1)
  const maxY = Math.min(m, Math.max(...ys) + 1)

  // create empty array of the correct size
  const cells = []
  for (let y = minY; y <= maxY; y++) {
    cells.push(new Array(maxX - minX + 1).fill(0))
  }
  // turn on the live cells
  for (let [x, y] of liveCells) {
    cells[parseInt(y, 10) - minY][parseInt(x, 10) - minX] = 1
  }

  // count the number of living neighbors, counterclockwise from NW
  const neighbors = function (x, y) {
    let sum = 0
    // i miss coffeescripts ? operator...
    sum += (cells[y - 1] || [])[x - 1] || 0
    sum += (cells[y - 1] || [])[x] || 0
    sum += (cells[y - 1] || [])[x + 1] || 0
    sum += (cells[y] || [])[x + 1] || 0
    sum += (cells[y + 1] || [])[x + 1] || 0
    sum += (cells[y + 1] || [])[x] || 0
    sum += (cells[y + 1] || [])[x - 1] || 0
    sum += (cells[y] || [])[x - 1] || 0
    return sum
  }

  // for each cell in the reduced simulation, check if it should be alive
  liveCells = []
  for (let y = 0; y < cells.length; y++) {
    for (let x = 0; x < cells[0].length; x++) {
      const friends = neighbors(x, y)
      if (friends === 3 || (friends === 2 && cells[y][x])) {
        liveCells.push([x + minX, y + minY])
      }
    }
  }

  this.jsonp = liveCells
  return this.jsonp
})

app.use(router.routes())
app.use(serve('static'))

app.listen(process.env.PORT || 5000, function () {
  const key = this._connectionKey.split(':')
  const port = key[key.length - 1]
  return console.log(`[${process.pid}] listening on :${port}`)
})
