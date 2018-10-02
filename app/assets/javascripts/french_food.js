function noscroll(){
  window.scrollTo(0,0);
}

window.addEventListener('scroll', noscroll);

document.addEventListener("turbolinks:load", function() {
  var orders = []
  var ingredients = {}

  getData(document.URL + "/orders", {})
  .then(data => setOrders(data)) // JSON-string from `response.json()` call
  .catch(error => console.error(error));

  function setOrders(data) {
    for(var i = 0; i < data["orders"].length; i++) {
      order = data["orders"][i]
      orders.push(order)
      for(var j = 0; j < order["ingredients"].length; j++) {
        if (ingredients[order["ingredients"][j]] === undefined) {
          x = 50 + Math.random() * (width - 100)
          y = 50 + Math.random() * (height - 100)
          var re_place_attempts = 0
          while (distanceToOtherIngredients(x, y) < 100 && re_place_attempts < 10)
          {
            re_place_attempts++
            x = 50 + Math.random() * (width - 100)
            y = 50 + Math.random() * (height - 100)
          }
          name = order["ingredients"][j]
          ingredients[name] = {x: x, y: y, image: findImage(name + "_image")}
        } 
      }
    }
  }

  function distance(x1, y1, x2, y2) {
    return Math.sqrt((Math.abs(x2 - x1) ** 2) + (Math.abs(y2 - y1) ** 2))
  }

  function distanceToOtherIngredients(x, y) {
    lowest = 1000
    for (var i in ingredients) {
      d = distance(x,y,ingredients[i].x, ingredients[i].y)
      if(d < lowest)
        lowest = d
    }
    return lowest
  }


  var rat_image = findImage("rat_image")
  var background_image = findImage("background_image")
  var furnace_image = findImage("furnace_image")
  
  function findImage(image_id) {
    images_collection = document.images
    for(var i = 0; i < images_collection.length; i++) {
      if(images_collection[i].id == image_id) {
        return images_collection[i]
      }
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
    ctx.drawImage(background_image, 0, 0, width, height)
    ctx.drawImage(furnace_image, furnace.x, furnace.y, 78, 78)
    ctx.drawImage(rat_image, state.x - 32, state.y - 32, 64, 64);
    for(var i in ingredients){
      ctx.drawImage(ingredients[i]['image'], ingredients[i]['x'], ingredients[i]['y'], 50, 50)
    }
  }

  var furnace = {
    x: width-75,
    y: 0
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