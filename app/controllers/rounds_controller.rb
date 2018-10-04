class RoundsController < ApplicationController

  skip_before_action :verify_authenticity_token
  
  def new
    @new_round = Round.new
    chef = Chef.find_by(id: session[:chef_id])
    if chef
      @chef = chef.name
    else
      redirect_to chefs_login_path
    end
  end

  def create
    @round = Round.create(chef_id: session[:chef_id])
    orders_count = params[:round][:orders_count].to_i
    if orders_count == 0
      orders_count = 1
    end
    orders_count.times do
      @round.orders.create(round_id:@round.id,recipe_id:Recipe.all.sample.id)
    end
    redirect_to @round
  end

  def show
    @orders = Round.find(params[:id]).orders
    fastest_round = Round.fastest_round(@orders.length)
    if fastest_round
      @par_time = '%.2f' % (fastest_round.total_time.to_f / 1000)
      @par_time_chef = fastest_round.chef.name
    end
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
