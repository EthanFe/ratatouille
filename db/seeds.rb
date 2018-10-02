Recipe.destroy_all
Ingredient.destroy_all
Chef.destroy_all

cheese = Ingredient.create(name:'cheese')
bread = Ingredient.create(name:'bread')
ham = Ingredient.create(name:'ham')
chicken = Ingredient.create(name:'chicken')
strawberries = Ingredient.create(name:'strawberry')
eggs = Ingredient.create(name:'egg')
spinach = Ingredient.create(name:'spinach')

j = Chef.create(name: 'Joan of Arc', password:'jpassword', password_confirmation:'jpassword')
ni = Chef.create(name: 'Nichola', password:'npassword', password_confirmation:'npassword')
et = Chef.create(name: 'Ethan', password:'epassword', password_confirmation:'epassword')


c = Recipe.create(name: 'Une Croque Madame')
sh = Recipe.create(name: 'Un Sandwich Avec Le Jambon')
sc = Recipe.create(name: 'Un Sandwich Avec Du Poulet')
f = Recipe.create(name: 'L\'Omelette Du Fromage')
po = Recipe.create(name: 'L\'Omelette Avec Du Poulet')
e = Recipe.create(name: 'Quiche Des Epinards Avec Les Fraises')
q = Recipe.create(name: 'Quiche Des Epinards')

RecipeIngredient.create(recipe:q, ingredient:eggs)
RecipeIngredient.create(recipe:q, ingredient:spinach)
RecipeIngredient.create(recipe:sc, ingredient:bread)
RecipeIngredient.create(recipe:sc, ingredient:chicken)
RecipeIngredient.create(recipe:sh, ingredient:bread)
RecipeIngredient.create(recipe:sh, ingredient:ham)
RecipeIngredient.create(recipe:c, ingredient:eggs)
RecipeIngredient.create(recipe:f, ingredient:eggs)
RecipeIngredient.create(recipe:po, ingredient:eggs)
RecipeIngredient.create(recipe:e, ingredient:eggs)
RecipeIngredient.create(recipe:e, ingredient:spinach)
RecipeIngredient.create(recipe:po, ingredient:chicken)
RecipeIngredient.create(recipe:c, ingredient:bread)
RecipeIngredient.create(recipe:f, ingredient:cheese)
RecipeIngredient.create(recipe:e, ingredient:strawberries)