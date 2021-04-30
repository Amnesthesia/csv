Rails.application.routes.draw do
  root to: "people#index"
  namespace :api do
    post "upload", to: "people#csv"
    get "people", to: "people#index"
  end

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
