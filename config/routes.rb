Rails.application.routes.draw do
  root to: "people#index"
  get "/api/people", to: "api/people#index"
  post "/api/people/upload", to: "api/people#from_csv"

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
