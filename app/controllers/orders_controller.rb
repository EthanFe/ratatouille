class OrdersController < ApplicationController
  def new
    @order = Order.new
    @recipes = Dir.chdir(Rails.root.join('app/assets/images')) do
      Dir.glob("recipes/*.png")
    end
    @ingredients = Ingredient.all
  end

  def create
    if params[:order][:recipe_id]
      # save order to list to send to live game
      flash[:notice] = "Order sent to live game!"
      redirect_to new_order_path
    else
      recipe = Recipe.new(params.require(:order).permit(:name, :image))
      params[:order][:ingredient_ids].each do |ingredient_id|
        # i think build doesnt work here
        # should be recipe.recipe_ingredients, probably
        # recipe.ingredients.build(id: ingredient_id)
      end
      if recipe.valid?
        # recipe.save
        # save order to list to send to live game
        flash[:notice] = "Order sent to live game!"
        redirect_to new_order_path
      else
        flash[:errors] = recipe.errors.full_messages
        redirect_to new_order_path
      end
    end
  end
end
