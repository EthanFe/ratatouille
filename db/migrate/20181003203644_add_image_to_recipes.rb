class AddImageToRecipes < ActiveRecord::Migration[5.2]
  def change
    add_column :recipes, :image, :string
  end
end
