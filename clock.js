var working = false
var interval

self.addEventListener(
  'message',
  function (e) {
    switch (e.data) {
      case 'start':
        if (!working) {
          working = true
          interval = setInterval(function () {
            self.postMessage('tick')
          }, 1000)
        }
        break
      case 'stop':
        clearInterval(interval)
        working = false
        break
    }
  },
  false,
)
