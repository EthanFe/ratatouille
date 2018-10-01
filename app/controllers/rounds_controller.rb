class RoundsController < ApplicationController
  def new
    @new_round = Round.new
  end

  def create
    byebug
    @round = Round.new(round_params)
    params[:round][:orders_count].times do
      @round.orders.create(round_id:@round.id,recipe_id:Recipe.all.sample.id)
    end
    redirect_to show
  end

  def show

  end

  private 

  def round_params 
    params.require(:round).permit(:chef_id)
  end 

  def count_params 
    params.require(:round).permit(:orders_count)
  end

end
