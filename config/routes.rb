Rails.application.routes.draw do
  resources :chef, only: [:new, :create]
  resources :rounds, only: [:new, :show, :create]
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
