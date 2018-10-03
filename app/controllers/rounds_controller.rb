class RoundsController < ApplicationController

  skip_before_action :verify_authenticity_token
  
  def new
    @new_round = Round.new
    @chef = Chef.find(session[:chef_id]).name
  end

  def create
    @round = Round.create(chef_id: session[:chef_id])
    params[:round][:orders_count].to_i.times do
      @round.orders.create(round_id:@round.id,recipe_id:Recipe.all.sample.id)
    end
    redirect_to @round
  end

  def show
    @orders = Round.find(params[:id]).orders 
    @images = Dir.chdir(Rails.root.join('app/assets/images')) do
      Dir.glob("ingredients/*.png")
    end
    @recipes = Dir.chdir(Rails.root.join('app/assets/images')) do
      Dir.glob("recipes/*.png")
    end
  end

  def result
    @round = Round.find(params[:id])
    @total_time = 0.0
  end 

  def orders 
    @orders = Round.find(params[:id]).orders
    @orders_json = {
      orders: @orders.map do |o|
        {
          name: o.recipe.name, 
          ingredients: o.recipe.ingredients.map do |i| 
            i.name
          end, 
          id: o.id,
          image: o.recipe.image
        }
      end 
    }
  render json: @orders_json
  end 

  def order_finished 
    order = Order.find(params[:order_id])
    order.update(time: params[:time])
  end 

  private 

  def count_params 
    params.require(:round).permit(:orders_count)
  end

end
