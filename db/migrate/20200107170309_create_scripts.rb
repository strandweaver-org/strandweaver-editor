class CreateScripts < ActiveRecord::Migration[6.0]
  def change
    create_table :scripts do |t|
      t.string :title
      t.text :data

      t.timestamps
    end
  end
end
