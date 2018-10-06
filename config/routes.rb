Rails.application.routes.draw do
  root 'rounds#new'
  resources :rounds, only: [:new, :show, :create]
  resources :orders, only: [:new, :create]
  get 'rounds/:id/orders', to:'rounds#orders'
  get 'rounds/:id/result', to:'rounds#result'
  post 'rounds/:id/order_finished', to:'rounds#order_finished'
  get 'chefs/login', to: 'chefs#login_page', as: "chefs_login_page"
  get 'chefs/leaderboard', to: 'chefs#leaderboard', as: "leaderboard"
  post 'chefs/login'
  post 'chefs/logout'
  resources :chefs, only: [:new, :create,:show]
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
