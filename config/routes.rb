Rails.application.routes.draw do
  resources :chefs, only: [:new, :create]
  resources :rounds, only: [:new, :show, :create]
  get 'rounds/:id/orders', to:'rounds#orders'
  get 'rounds/:id/result', to:'rounds#result'
  post 'rounds/:id/order_finished', to:'rounds#order_finished'
  get 'chefs/login', to: 'chefs#login_page', as: "chefs_login_page"
  post 'chefs/login'
  post 'chefs/logout'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
