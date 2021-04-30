class CreatePeople < ActiveRecord::Migration[6.1]
  def change
    create_table :people do |t|
      t.string :name
      t.datetime :dob
      t.integer :number
      t.text :description

      t.timestamps
    end
  end
end
