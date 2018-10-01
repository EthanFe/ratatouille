Recipe.destroy_all
Ingredient.destroy_all
Chef.destroy_all

cheese = Ingredient.create(name:'du fromage')
bread = Ingredient.create(name:'du pain')
ham = Ingredient.create(name:'le jambon')
chicken = Ingredient.create(name:'du poulet')
strawberries = Ingredient.create(name:'les fraises')
eggs = Ingredient.create(name:'les oeuvres')
spinach = Ingredient.create(name:'des epinards')

j = Chef.create(name: 'Joan of Arc', password:'jpassword', password_confirmation:'jpassword')
ni = Chef.create(name: 'Nichola', password:'npassword', password_confirmation:'npassword')
et = Chef.create(name: 'Ethan', password:'epassword', password_confirmation:'epassword')


c = Recipe.create(name: 'Une Croque Madame')
f = Recipe.create(name: 'L\'Omelette Du Fromage')
po = Recipe.create(name: 'L\'Omelette Avec Du Poulet')
e = Recipe.create(name: 'Quiche Des Epinards Avec Les Fraises')

RecipeIngredient.create(recipe:c, ingredient:eggs)
RecipeIngredient.create(recipe:f, ingredient:eggs)
RecipeIngredient.create(recipe:po, ingredient:eggs)
RecipeIngredient.create(recipe:e, ingredient:eggs)
RecipeIngredient.create(recipe:e, ingredient:spinach)
RecipeIngredient.create(recipe:po, ingredient:chicken)
RecipeIngredient.create(recipe:c, ingredient:bread)
RecipeIngredient.create(recipe:f, ingredient:cheese)
RecipeIngredient.create(recipe:e, ingredient:strawberries)