Rails.application.routes.draw do
  resources :chefs, only: [:new, :create, :index]
  get 'chefs/login', to: 'chefs#login_page', as: "chefs_login_page"
  post 'chefs/login'
  post 'chefs/logout'

  get 'rounds/new'
  get 'rounds/create'
  get 'rounds/show'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
