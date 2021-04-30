module Api
  class PeopleController < ApplicationController
    def index
      query = Person.all

      if params[:sort]
        query.order(
          params[:sort] => params[:direction] == "asc" ? :asc : :desc
        )
      end
      render json: query.to_json
    end

    def from_csv
      csv = CSV.parse(
        Base64.decode(params[:csv]),
        headers: true
      )

      people = csv.map do |row|
        Person.find_or_create_by(row.to_h)
      end

      render json: people.to_json, status: :ok
    end
  end
end