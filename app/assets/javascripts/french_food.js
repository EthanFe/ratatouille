document.addEventListener("turbolinks:load", function() {
  getData(document.URL + "/orders", {})
  .then(data => setOrders(data)) // JSON-string from `response.json()` call
  .catch(error => console.error(error));

  function setOrders(data) {
  }

  images_collection = document.images
	for(var i = 0; i < images_collection.length; i++) {
  	if(images_collection[i].id == "rat_image") {
			rat_image = images_collection[i]
		}
	}
  
  function update(progress) {
    if (state.pressedKeys.left) {
      state.x -= progress
    }
    if (state.pressedKeys.right) {
      state.x += progress
    }
    if (state.pressedKeys.up) {
      state.y -= progress
    }
    if (state.pressedKeys.down) {
      state.y += progress
    }

    // Prevent moving past boundaries
    if (state.x > width) {
      state.x = width
    }
    else if (state.x < 0) {
      state.x = 0
    }
    if (state.y > height) {
      state.y = height
    }
    else if (state.y < 0) {
      state.y = 0
    }
  }

  var canvas = document.getElementById("canvas")
  var width = canvas.width
  var height = canvas.height
  var ctx = canvas.getContext("2d")

  function draw() {
    ctx.clearRect(0, 0, width, height)

    ctx.drawImage(rat_image, state.x - 32, state.y - 32, 64, 64);
  }



  var state = {
    x: (width / 2),
    y: (height / 2),
    pressedKeys: {
      left: false,
      right: false,
      up: false,
      down: false
    }
  }



  function loop(timestamp) {
    var progress = timestamp - lastRender

    update(progress)
    draw()

    lastRender = timestamp
    window.requestAnimationFrame(loop)
  }
  var lastRender = 0
  window.requestAnimationFrame(loop)



  var keyMap = {
    39: 'right',
    37: 'left',
    38: 'up',
    40: 'down'
  }
  function keydown(event) {
    var key = keyMap[event.keyCode]
    state.pressedKeys[key] = true
  }
  function keyup(event) {
    var key = keyMap[event.keyCode]
    state.pressedKeys[key] = false
  }

  window.addEventListener("keydown", keydown, false)
  window.addEventListener("keyup", keyup, false)


});