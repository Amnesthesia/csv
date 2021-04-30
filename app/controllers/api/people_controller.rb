require "csv"
module Api
  class PeopleController < ApplicationController

    def index
      query = Person.all

      
      query = query.search(filter_params[:search]) if filter_params[:search]
      
      if filter_params[:sort]
        query = query.order(
          filter_params[:sort] => filter_params[:direction] == "asc" ? :asc : :desc
        )
      end
      
      result = query.map do |person|
        # Serialize date of birth to js timestamp
        person.as_json.merge(
          dob: person.dob.to_i * 1000
        )
      end

      render json: result.to_json
    end

    def csv
      csv = ::CSV.parse(
        Base64.decode64(csv_params[:csv]),
        headers: true
      )

      result = csv.map do |row|
        data = row.to_h
        
        Person.find_or_create_by(
          name: data["name"],
          dob: DateTime.parse(data["date"]),
          number: data["number"].to_i,
          description: data["description"]
        )
      end

      render json: result.to_json, status: :ok
    end

    private
    def csv_params
      params.permit(:csv, :person)
    end

    def filter_params
      params.permit(:sort, :direction, :person, :search)
    end
  end
end