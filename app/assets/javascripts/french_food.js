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

  function spaceBarPressed() {
    if (rat_state.carrying === null) {
      var rat_grab_range = 60
      var ingredient = closestIngredient(rat_state.x, rat_state.y)
      var d = distance(rat_state.x,rat_state.y,ingredient.x, ingredient.y)
      if (d < rat_grab_range) {
        pickupIngredient(ingredient)
      }
    } else {
      if(isNearFurnace() == true){
        furnace['ingredients'].push(rat_state.carrying.name)
        rat_state.carrying = null
      }
      else {
        rat_state.carrying = null
      }
    }
  }

  function isNearFurnace(){
    var d = distance(rat_state.x,rat_state.y,furnace.x, furnace.y)
    return (d < 60)
  }

  function pickupIngredient(ingredient) {
    console.log("Pickin up an ingredient")
    rat_state.carrying = ingredient
  }

  function closestIngredient(x, y) {
    var currentClosest = null
    for (var i in ingredients) {
      var d = distance(x,y,ingredients[i].x, ingredients[i].y)
      if(currentClosest === null || d < distance(x,y,currentClosest.x, currentClosest.y)) {
         currentClosest = ingredients[i]
         currentClosest.name = i
      }
    }
    return currentClosest
  }



  var rat_image = findImage("rat_image")
  var background_image = findImage("background_image")
  var furnace_image = findImage("furnace_image")
  var table_image = findImage("table_image")
  
  function findImage(image_id) {
    images_collection = document.images
    for(var i = 0; i < images_collection.length; i++) {
      if(images_collection[i].id == image_id) {
        return images_collection[i]
      }
    }
  }
  
  function update(progress) {
    if (rat_state.pressedKeys.left) {
      rat_state.x -= progress
    }
    if (rat_state.pressedKeys.right) {
      rat_state.x += progress
    }
    if (rat_state.pressedKeys.up) {
      rat_state.y -= progress
    }
    if (rat_state.pressedKeys.down) {
      rat_state.y += progress
    }

    // Prevent moving past boundaries
    if (rat_state.x > width) {
      rat_state.x = width
    }
    else if (rat_state.x < 0) {
      rat_state.x = 0
    }
    if (rat_state.y > height) {
      rat_state.y = height
    }
    else if (rat_state.y < 0) {
      rat_state.y = 0
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
    ctx.drawImage(table_image, table.x, table.y, 78, 78)
    ctx.drawImage(rat_image, rat_state.x - 32, rat_state.y - 32, 64, 64)
    for(var i in ingredients){
      ctx.drawImage(ingredients[i]['image'], ingredients[i]['x'], ingredients[i]['y'], 50, 50)
    }

    if (rat_state.carrying != null) {
      ctx.drawImage(rat_state.carrying['image'], rat_state.x, rat_state.y, 32, 32)
    }

    if (orders[0] != undefined) {
      var text = document.getElementById('recipe_text')
      var nextOrder = orders[0]
      text.innerHTML = nextOrder.name
      for (var i in nextOrder.ingredients) {
        var ingredient_name = capitalize(nextOrder.ingredients[i])
        var html_class_string = isInFurnace(nextOrder.ingredients[i]) ? "<div class=completed>" : ""
        text.innerHTML += "<br />" + html_class_string + ingredient_name + "</div>";
      }
    }
  }

  function isInFurnace(name) {
    return furnace["ingredients"].indexOf(name) > -1
  }

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }


  var furnace = {
    x: width-75,
    y: 0,
    ingredients: []
  }

  var table = {
    x: 0, 
    y: height-75
  }


  var rat_state = {
    x: (width / 2),
    y: (height / 2),
    pressedKeys: {
      left: false,
      right: false,
      up: false,
      down: false
    },
    carrying: null
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
    rat_state.pressedKeys[key] = true
    if (event.keyCode === 32)
      spaceBarPressed()
  }
  function keyup(event) {
    var key = keyMap[event.keyCode]
    rat_state.pressedKeys[key] = false
  }

  window.addEventListener("keydown", keydown, false)
  window.addEventListener("keyup", keyup, false)


});