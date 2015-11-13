'use strict'

const koa = require('koa')
const response_time = require('koa-response-time')
const logger = require('koa-logger')
const cors = require('koa-cors')
const app = koa()
require('koa-safe-jsonp')(app)
require('koa-qs')(app)

console.log('Environment:' + app.env)

app.use(response_time())
app.use(logger())
app.use(cors())

app.use(function * () {
  const m = parseInt(this.query.M)
  const n = parseInt(this.query.N)
  const cells = []
  for(let y=0; y<m; y++){
    cells.push(new Array(n).fill(0))
  }

  let liveCells = this.query.liveCells
  for (let [x, y] of liveCells) {
    cells[parseInt(x)][parseInt(y)] = 1
  }

  const neighbors = function (x, y) {
    let sum = 0
    sum += (cells[x-1] && cells[x-1][y-1] ? 1 : 0)
    sum += (cells[x-1] && cells[x-1][y] || 0)
    sum += (cells[x-1] && cells[x-1][y+1] ? 1 : 0)
    sum += (cells[x][y-1] || 0)
    sum += (cells[x][y+1] || 0)
    sum += (cells[x+1] && cells[x+1][y-1] ? 1 : 0)
    sum += (cells[x+1] && cells[x+1][y] ? 1 : 0)
    sum += (cells[x+1] && cells[x+1][y+1] ? 1 : 0)
    return sum
  }

  liveCells = []
  for (let x = 0; x < m; x++) {
    for (let y = 0; y < n; y++) {
      const friends = neighbors(x, y)
      if (friends === 3 || (friends === 2 && cells[x][y])) {
        liveCells.push([x, y])
      }
    }
  }

  this.jsonp = liveCells
})

app.listen(process.env.PORT || 5000, function () {
  const key = this._connectionKey.split(':')
  const port = key[key.length - 1]
  return console.log(`[${process.pid}] listening on :${port}`)
})
