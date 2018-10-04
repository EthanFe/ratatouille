class Recipe < ApplicationRecord
  has_many :recipe_ingredients, dependent: :destroy
  has_many :ingredients, through: :recipe_ingredients
  has_many :orders, dependent: :destroy

  validates :name, presence: true, uniqueness: true
  validates :image, presence: true
  # validate :must_have_ingredients
  # wow fuck this

  def must_have_ingredients
    unless ingredients.length > 0
      errors.add(:ingredients, "must have at least one ingredient")
    end
  end
end
