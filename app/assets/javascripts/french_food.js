function noscroll(){
  window.scrollTo(0,0);
}

window.addEventListener('scroll', noscroll);

document.addEventListener("turbolinks:load", function() {
  var orders = []
  var ingredients = {}
  var currentOrderStartTime = new Date().valueOf()
  var ordersCompleted = 0

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
      if(furnace.cooked_item != undefined && distance(rat_state.x,rat_state.y,furnace.x, furnace.y) < rat_grab_range){
        pickupMeal()
      } else {
        var ingredient = closestIngredient(rat_state.x, rat_state.y)
        var d = distance(rat_state.x,rat_state.y,ingredient.x, ingredient.y)
        if (d < rat_grab_range) {
          pickupIngredient(ingredient)
        }
      }
    } else {
      if(isNearFurnace() == true){
        furnace['ingredients'].push(rat_state.carrying.name)
        rat_state.carrying = null
      }
      else if(isNearTable() == true){
        finishOrder();
      }
      else {
        rat_state.carrying = null
      }
    }
  }

  function finishOrder() {
    var timeTaken = new Date().valueOf() - currentOrderStartTime
    postData(document.URL + "/order_finished", {time: timeTaken, order_id: nextOrder().id})
    .then(data => console.log("successfully sent a lettuce omelette or whatever")) // JSON-string from `response.json()` call
    .catch(error => console.error(error));

    if (ordersCompleted + 1 >= orders.length) {
      winRound()
    } else {
      ordersCompleted++
      currentOrderStartTime = new Date().valueOf()
      rat_state.carrying = null
    }
  }

  function winRound(){
    var round_id = document.URL.split("/rounds/")[1]
    window.location.replace(round_id + "/result");
  }

  function pickupMeal(){
    rat_state.carrying = furnace.cooked_item
    furnace.cooked_item = null
  }

  function isNearTable(){
    return (distance(rat_state.x,rat_state.y,table.x, table.y) < 60)
  }

  function isNearFurnace(){
    var d = distance(rat_state.x,rat_state.y,furnace.x, furnace.y)
    return (d < 60)
  }

  function pickupIngredient(ingredient) {
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
  
 
  
  function moveRat(progress) {
    movespeed_modifier = shiftHeld ? 0.5 : 1
    movement = movespeed_modifier * progress
    if (rat_state.pressedKeys.left) {
      rat_state.x -= movement
    }
    if (rat_state.pressedKeys.right) {
      rat_state.x += movement
    }
    if (rat_state.pressedKeys.up) {
      rat_state.y -= movement
    }
    if (rat_state.pressedKeys.down) {
      rat_state.y += movement
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
      if (rat_state.carrying['image'] != undefined) {
        ctx.drawImage(rat_state.carrying['image'], rat_state.x, rat_state.y, 32, 32)
      } else {
        var image = findImage(recipe_image_names[rat_state.carrying] + "_image")
        ctx.drawImage(image, rat_state.x, rat_state.y, 32, 32)
      }
    }

    if (nextOrder() != undefined) {
      var text = document.getElementById('recipe_text')
      text.innerHTML = nextOrder().name
      for (var i in nextOrder().ingredients) {
        var ingredient_name = capitalize(nextOrder().ingredients[i])
        var html_class_string = isInFurnace(nextOrder().ingredients[i]) ? "<div class=completed>" : ""
        text.innerHTML += "<br />" + html_class_string + ingredient_name + "</div>";
      }
    }

    if (furnace.cooked_item != undefined) {
      var image = findImage(recipe_image_names[furnace.cooked_item] + "_image")
      ctx.drawImage(image, furnace.x, furnace.y, 32, 32)
    }
  }

  function nextOrder() {
    return orders[ordersCompleted]
  }

  function isInFurnace(name) {
    return furnace["ingredients"].indexOf(name) > -1
  }

  

  var furnace = {
    x: width-75,
    y: 0,
    ingredients: [],
    cooking_time: 0,
    cooked_item: null
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

    moveRat(progress)
    cookMeal(progress)
    draw()

    lastRender = timestamp
    window.requestAnimationFrame(loop)
  }
  var lastRender = 0
  window.requestAnimationFrame(loop)

  function cookMeal(progress) {
    if (furnaceHasAllIngredients()) {
      cook_time_required = 5000
      if (furnace.cooking_time < cook_time_required) {
        furnace.cooking_time += progress
      } else {
        furnace.cooked_item = nextOrder().name
        furnace.ingredients = []
        furnace.cooking_time = 0
      }
    }
  }

  function furnaceHasAllIngredients() {
    order = nextOrder()
    if (order != undefined && furnace != undefined) {
      for (var i in order.ingredients) {
        var ingredient = order.ingredients[i]
        if (furnace.ingredients.indexOf(ingredient) === -1)
          return false
      }
      return true
    }
  }

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
    if (event.keyCode === 16)
      shiftPressed()
  }
  function keyup(event) {
    var key = keyMap[event.keyCode]
    rat_state.pressedKeys[key] = false
    if (event.keyCode === 16)
      shiftReleased()
  }

  var shiftHeld = false
  function shiftPressed() {
    shiftHeld = true
  }

  function shiftReleased() {
    shiftHeld = false
  }

  window.addEventListener("keydown", keydown, false)
  window.addEventListener("keyup", keyup, false)


});