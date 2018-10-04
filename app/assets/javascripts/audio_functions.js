

function playGoodAudio(){
  var x = document.getElementsByClassName('play')[0]
  x.play()
}
function playBadAudio(){
  var x = document.getElementsByClassName('bad')[0]
  x.play()
}

function playBackgroundAudio(){
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

function playDangerZone(){
  var y = document.getElementsByClassName('background')[0]
  y.pause()
  var z = document.getElementsByClassName('starwars')[0]
  z.pause()
  var x = document.getElementsByClassName('danger')[0]
  x.play()
  return x
}

function playStarWars(){
  var y = document.getElementsByClassName('background')[0]
  y.pause()
  var x = document.getElementsByClassName('danger')[0]
  x.pause()
  var z = document.getElementsByClassName('starwars')[0]
  z.play()
  return z
}

function playHalo(){
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