# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...

Method: Recipe.random -- returns a random recipe


Method: Recipe.get_recipe_set(count) -- returns json for the given number of random recipes
  {recipes:
    [
      {name: '', ingredients: []},
      {name: '', ingredients: []},
      ..
    ]
  }

e.g.
  {recipes:
    [
      {name: 'pizza', ingredients: ["cheese", "tomatoes", "dough"]},
      {name: 'sushi', ingredients: ["fish", "rice"]},
      ..
    ]
  }

routes/controllers/views stuff:
log in as chef (login page); then redirect to new game page
new game page: has a field to select number of recipes in round, and start button
new game page makes a new round instance and then redirects to show round page for that round
show game page has a canvas that javascript draws to

like dis:
<canvas id="canvas" width="<%= @canvas_size %>" height="<%= @canvas_size %>"></canvas>


  
json from hash example:
response = {"board": game_state, "next_player": @game.active_player, "last_move": @game.last_move}.to_json

hello
