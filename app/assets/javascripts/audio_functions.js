

function playGoodAudio(){
  var x = document.getElementsByClassName('play')[0]
  x.play()
}
function playBadAudio(){
  var x = document.getElementsByClassName('bad')[0]
  x.play()
}

function playCookingAudio(){
  var x = document.getElementsByClassName('cooking')[0]
  x.play()
}

function playFinishedAudio(){
  var x = document.getElementsByClassName('finished')[0]
  x.play()
}

function playDeliveredAudio(){
  var x = document.getElementsByClassName('delivered')[0]
  x.play()
}

function playBackgroundAudio(){
  var b = document.getElementsByClassName('mk')[0]
  b.pause()
  var y = document.getElementsByClassName('danger')[0]
  y.pause()
  var a = document.getElementsByClassName('halo')[0]
  a.pause()
  var z = document.getElementsByClassName('starwars')[0]
  z.pause()
  var x = document.getElementsByClassName('background')[0]
  x.play()
  return x
}

function playDangerZone(){
  var b = document.getElementsByClassName('mk')[0]
  b.pause()
  var y = document.getElementsByClassName('background')[0]
  y.pause()
  var z = document.getElementsByClassName('starwars')[0]
  z.pause()
  var x = document.getElementsByClassName('danger')[0]
  x.play()
  return x
}

function playStarWars(){
  var b = document.getElementsByClassName('mk')[0]
  b.pause()
  var y = document.getElementsByClassName('background')[0]
  y.pause()
  var x = document.getElementsByClassName('danger')[0]
  x.pause()
  var z = document.getElementsByClassName('starwars')[0]
  z.play()
  return z
}

function playHalo(){
  var b = document.getElementsByClassName('mk')[0]
  b.pause()
  var y = document.getElementsByClassName('danger')[0]
  y.pause()
  var z = document.getElementsByClassName('starwars')[0]
  z.pause()
  var x = document.getElementsByClassName('background')[0]
  x.pause()
  var a = document.getElementsByClassName('halo')[0]
  a.play()
  return a
}


function playMK(){
  var y = document.getElementsByClassName('danger')[0]
  y.pause()
  var z = document.getElementsByClassName('starwars')[0]
  z.pause()
  var x = document.getElementsByClassName('background')[0]
  x.pause()
  var a = document.getElementsByClassName('halo')[0]
  a.pause()
  var b = document.getElementsByClassName('mk')[0]
  b.play()
  return b
}