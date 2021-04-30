require "csv"
module Api
  class PeopleController < ApplicationController

    def index
      query = Person.all

      if sort_params[:sort]
        query = query.order(
          sort_params[:sort] => sort_params[:direction] == "asc" ? :asc : :desc
        )
      end
      render json: query.to_json
    end

    def csv
      csv = ::CSV.parse(
        Base64.decode64(csv_params[:csv]),
        headers: true
      )

      result = csv.map do |row|
        data = row.to_h

        puts DateTime.parse(data["date"])
        
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

    def sort_params
      params.permit(:sort, :direction, :person)
    end
  end
end