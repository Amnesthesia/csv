class Person < ApplicationRecord

  include SearchCop

  search_scope :search do
    attributes :name, :description
  end
end
