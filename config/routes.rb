Rails.application.routes.draw do
<<<<<<< HEAD
  resources :chefs, only: [:new, :create, :index]
 

  get 'rounds/new'
  get 'rounds/create'
  get 'rounds/show'
=======
  resources :chef, only: [:new, :create]
  resources :rounds, only: [:new, :show, :create]
  get 'chefs/login', to: 'chefs#login_page', as: "chefs_login_page"
  post 'chefs/login'
  post 'chefs/logout'
>>>>>>> backend
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
