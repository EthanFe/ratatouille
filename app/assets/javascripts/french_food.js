document.addEventListener("turbolinks:load", function() {
  // only run this file on pages with a canvas. this is really good code
  var canvas = document.getElementById("canvas")
  if (canvas == null || !canvas.getContext)
    return
  var width = canvas.width
  var height = canvas.clientHeight
  var ctx = canvas.getContext("2d")
  
  var orders = []
  var ingredients = {}
  var currentOrderStartTime = getCurrentTime()
  var ordersCompleted = 0
  var timeRoundEnded = null
  var error = {
    message: '',
    timeSet: null,
    duration: 5000
  }

  var roundStartTime = getCurrentTime()
  var par_time_text = document.getElementById("par_time_text")
  if (par_time_text != null)
    var par_time = parseFloat(par_time_text.textContent.split("Best Time: ")[1].split(" seconds (")[0]) * 1000

  var current_music = playBackgroundAudio()

  function noscroll() { window.scrollTo(0,0); }
  window.addEventListener('scroll', noscroll);

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
        playCookingAudio()
      }
      else if(ratIsCarryingMeal() && isNearTable() == true){
        finishOrder();
      }
      else {
        dropItem()
      }
    }
  }

  function dropItem() {
    addError("You dropped the " + rat_state.carrying.name + "!")
    rat_state.carrying = null
  }

  function addError(message) {
    error.message = message
    error.timeSet = getCurrentTime()
  }

  function finishOrder() {
    var timeTaken = getCurrentTime() - currentOrderStartTime
    postData(document.URL + "/order_finished", {time: timeTaken, order_id: nextOrder().id})
    .then(data => console.log("successfully sent a lettuce omelette or whatever")) // JSON-string from `response.json()` call
    .catch(error => console.error(error));

    playDeliveredAudio()
    currentOrderStartTime = getCurrentTime()
    rat_state.carrying = null
    if (ordersCompleted + 1 >= orders.length)
      winRound()

    ordersCompleted++
  }

  function winRound(){
    timeRoundEnded = getCurrentTime()
  }

  function pickupMeal(){
    rat_state.carrying = furnace.cooked_item
    furnace.cooked_item = null
  }

  function isNearTable(){
    return (distance(rat_state.x,rat_state.y,table.x, table.y) < 65)
  }

  function isNearFurnace(){
    var d = distance(rat_state.x,rat_state.y,furnace.x, furnace.y)
    return (d < 65)
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
  var jet_image = findImage("jet_image")
  var chief_image = findImage("chief_image")
  var xwing_image = findImage("xwing_image")
  var space_image = findImage("space_image")
  var sky_image = findImage("sky_image")
  var halo_image = findImage("halo_image")
  var background_image = findImage("background_image")
  var furnace_image = findImage("furnace_image")
  var table_image = findImage("table_image")
  var mk_image = findImage("mk_image")
  var scorpion_image = findImage("scorpion_image")
  
  function moveRat(progress) {
    movespeed_modifier = shiftHeld ? 1 : 0.5
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

  function draw() {
    var furnace_size = 78

    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(background_image, 0, 0, width, height)
    ctx.drawImage(furnace_image, furnace.x, furnace.y, furnace_size, furnace_size)
    ctx.drawImage(table_image, table.x, table.y, 78, 78)
    ctx.drawImage(rat_image, rat_state.x - 32, rat_state.y - 32, 64, 64)
    for(var i in ingredients){
      ctx.drawImage(ingredients[i]['image'], ingredients[i]['x'], ingredients[i]['y'], 50, 50)
    }

    if (rat_state.carrying != null) {
      // if image is a string, then rat is carrying a meal, which is stored differently because bad code
      if (ratIsCarryingMeal()) {
        var image = findImage(rat_state.carrying.image + "_image")
        ctx.drawImage(image, rat_state.x, rat_state.y, 32, 32)
      } else {
        ctx.drawImage(rat_state.carrying['image'], rat_state.x, rat_state.y, 32, 32)
      }
    }

    if (nextOrder() != undefined) {
      var text = document.getElementById('recipe_text')
      text.innerHTML = nextOrder().name + "<br/>"
      for (var i in nextOrder().ingredients) {
        var ingredient_name = nextOrder().ingredients[i]
        var ingredient_image_html = '<img src="/assets/ingredients/' + ingredient_name + '.png" height="32" width="32">'
        var html_class_string = isInFurnace(nextOrder().ingredients[i]) || furnace.cooked_item || ratIsCarryingMeal() ? "<span class=completed>" : "<span>"
        text.innerHTML += html_class_string + ingredient_image_html + "</span>";
      }

      if (furnaceHasAllIngredients() || furnace.cooked_item || ratIsCarryingMeal()) {
        text.classList.add('completed');
      } else {
        text.classList.remove('completed');
      }

      var titleText = document.getElementById('recipe_title')
      titleText.textContent = "Order " + (ordersCompleted + 1) + " of " + orders.length
    } else if (timeRoundEnded != null) { // if all orders have already been completed
      document.getElementById('recipe_text').innerHTML = ""
      var titleText = document.getElementById('recipe_title')
      titleText.textContent = "Round Finished!"
    }

    if (furnace.cooked_item != undefined) {
      var image = findImage(furnace.cooked_item.image + "_image")
      ctx.drawImage(image, furnace.x, furnace.y, 32, 32)
    }

    if (furnace.cooking_time > 0) {
      percent_cooked = furnace.cooking_time / 5000

      // draw background
      ctx.strokeStyle = "#fff"
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.arc(furnace.x + furnace_size / 2, furnace.y + furnace_size / 2, 24, Math.PI, (percent_cooked * Math.PI * 2) - Math.PI, false); // Outer circle
      ctx.stroke();

      // draw green
      ctx.strokeStyle = "#1ccc31"
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(furnace.x + furnace_size / 2, furnace.y + furnace_size / 2, 24, Math.PI, (percent_cooked * Math.PI * 2) - Math.PI, false); // Outer circle
      ctx.stroke();
    }

    updateParTimeDisplay()
  }

  function updateParTimeDisplay() {
    var bar = document.getElementById("par_time_bar")
    // if par time is present, then bar will be rendered in view
    if (bar != null) {
      var bar_width = bar.width
      var bar_height = bar.clientHeight
      var bar_ctx = bar.getContext("2d")
      bar_ctx.fillStyle = "blue";

      var percent_filled = (getCurrentTime() - roundStartTime) / par_time
      bar_ctx.clearRect(0, 0, bar_width, bar_height);
      bar_ctx.fillRect(0, 0, bar_width * (1 - percent_filled), bar_height);
      // bar_ctx.strokeRect(50, 50, 50, 50);

      if (percent_filled >= 1)
      {
        par_time_text.classList.add('over_time');
      }
    }
  }

  function ratIsCarryingMeal() {
    return rat_state.carrying != null && typeof(rat_state.carrying['image']) === 'string'
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

  function updateErrorMessage() {
    document.getElementById("error_text").textContent = error.message
    if (getCurrentTime() - error.timeSet >= error.duration) {
      error.message = ''
      error.timeSet = null
    }
  }

  function endRound() {
    var fadeTime = 4000
    if (timeRoundEnded != null) {
      var timeSinceRoundEnded = getCurrentTime() - timeRoundEnded
      if (timeSinceRoundEnded < fadeTime) {
        current_music.volume = (0.2 + 0.8 * (1 - timeSinceRoundEnded / fadeTime))
      } else {
        timeRoundEnded = null
        var round_id = document.URL.split("/rounds/")[1]
        console.log("redirecting to " + round_id + "/result")
        window.location.replace(round_id + "/result");
      }
    }
  }

  function loop(timestamp) {
    var progress = timestamp - lastRender

    updateErrorMessage()
    moveRat(progress)
    cookMeal(progress)
    draw()
    endRound()

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
        finishedCooking()
      }
    }
  }

  function finishedCooking(){
        furnace.cooked_item = nextOrder()
        furnace.ingredients = []
        furnace.cooking_time = 0
        playFinishedAudio()
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
    if(event.keyCode == 72)
      hPressed()
    if(event.keyCode == 82)
      rPressed()
    if(event.keyCode == 75)
      kPressed()
    if(event.keyCode == 76)
      lPressed()
    if(event.keyCode == 77)
      mPressed()
  }

  function rPressed(){
    background_image = findImage("background_image")
    rat_image = findImage("rat_image")
    current_music = playBackgroundAudio()
  }

  function hPressed(){
    background_image = halo_image
    rat_image = chief_image
    current_music = playHalo()
  }

  function kPressed(){
    background_image = sky_image
    rat_image = jet_image
    current_music = playDangerZone()
  }

  function lPressed(){
    background_image = space_image
    rat_image = xwing_image
    current_music = playStarWars()
  }

  function mPressed(){
    background_image = mk_image
    rat_image = scorpion_image
    current_music = playMK()
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