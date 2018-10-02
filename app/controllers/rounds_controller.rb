class RoundsController < ApplicationController
  def new
    @new_round = Round.new
    @chef = Chef.find(session[:chef_id]).name
  end

  def create
    @round = Round.create(chef_id: session[:chef_id])
    params[:round][:orders_count].to_i.times do
      @round.orders.create(round_id:@round.id,recipe_id:Recipe.all.sample.id)
    end
    redirect_to show
  end

  def show
  
  end

  def orders 
    @orders = Round.find(params[:id]).orders
    @orders_json = {
      orders: @orders.map do |o|
        {
          name:o.recipe.name, 
          ingredients: o.recipe.ingredients.map do |i| 
            i.name
          end 
        }, 
      end 
    }
  render json: @orders_json
  end 

  private 

  def count_params 
    params.require(:round).permit(:orders_count)
  end

end
