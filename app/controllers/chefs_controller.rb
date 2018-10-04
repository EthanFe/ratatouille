class ChefsController < ApplicationController
  def new
    @chef = Chef.new
  end

  def create
    if params[:password] != "" && params[:password] == params[:password_confirmation]
      chef = Chef.new(params.require(:chef).permit(:name, :password, :password_confirmation))
      if chef.save
        session[:chef_id] = chef.id
        flash[:notice] = "Successfully logged in as user #{Chef.find(session[:chef_id]).name}!"
        redirect_to :controller => 'rounds', :action => 'new'
      else
        flash[:notice] = "validations failed!"
        redirect_to action: "new"
      end
    else
      flash[:notice] = "passwords didn't match"
      redirect_to action: "new"
    end
  end

  def leaderboard
    @chefs_played = Chef.all.select{|c| c.didNotPlay? == false}
    @chefs_played = @chefs_played.sort_by{|c| c.averageTime}
    @chefs_not_played = Chef.all.select{|c| c.didNotPlay? == true}
  end

  def login_page
  end

  def login
    @chef = Chef.find_by(name: params[:username])
    if @chef && @chef.authenticate(params[:password])
      session[:chef_id] = @chef.id
      flash[:notice] = "Successfully logged in as user #{Chef.find(session[:chef_id]).name}!"
      redirect_to :controller => 'rounds', :action => 'new'
    else
      redirect_to :chefs_login_page
    end
  end

  def logout
    session[:chef_id] = nil
    flash[:notice] = "Successfully logged out"
    redirect_to :chefs_login_page
  end

  def show 
    @chef = Chef.find(params[:id])
  end 
  
end
