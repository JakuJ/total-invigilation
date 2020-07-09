Notification.requestPermission()

function notify(message) {
  if (Notification.permission === 'granted') {
    new Notification(message)
  }

  const events = document.getElementById('events')
  events.innerHTML += `<tr><td>${new Date().toLocaleTimeString()}</td><td>${message}</td></tr>`
}

// Track mouse position inside the page

var mouseLeaving = 0

function updateMouse() {
  document.getElementById(
    'mouse',
  ).innerText = `Times your mouse has left the body of the page: ${mouseLeaving}`
}

updateMouse()

document.getElementById('mainBody').onmouseleave = () => {
  mouseLeaving++
  updateMouse()
  // notify('Your mouse has left the body of the page')
}

// Detect other open tabs

window.onpagehide = () => {
  notify("You must've navigated away before and now you're back")
}

// Count idle time and check focus

var idleTime = 0
var idleAlerted = false
var focusAlerted = false

function updateTime() {
  document.getElementById(
    'idle',
  ).innerText = `Current inactivity: ${idleTime} seconds`
}

let clock = new Worker('./clock.js')
clock.postMessage('start')

clock.onmessage = () => {
  idleTime += 1
  updateTime()

  if (!idleAlerted && idleTime > 20) {
    idleAlerted = true
    notify("You've been inactive for over 20 seconds now")
  }

  if (document.hasFocus()) {
    focusAlerted = false
  } else if (!focusAlerted) {
    focusAlerted = true
    notify('Your window has lost focus')
  }
}

function registerActivity() {
  idleTime = 0
  updateTime()
}

window.onmousemove = registerActivity
window.onkeydown = registerActivity

// Use the Visibility API

// Set the name of the hidden property and the change event for visibility
var hidden, visibilityChange

if (typeof document.hidden !== 'undefined') {
  // Opera 12.10 and Firefox 18 and later support
  hidden = 'hidden'
  visibilityChange = 'visibilitychange'
} else if (typeof document.msHidden !== 'undefined') {
  hidden = 'msHidden'
  visibilityChange = 'msvisibilitychange'
} else if (typeof document.webkitHidden !== 'undefined') {
  hidden = 'webkitHidden'
  visibilityChange = 'webkitvisibilitychange'
}

function handleVisibilityChange() {
  if (document[hidden]) {
    notify("You've hidden the page")
  } else {
    notify("You're back on the page")
  }
}

document.addEventListener(visibilityChange, handleVisibilityChange, false)
