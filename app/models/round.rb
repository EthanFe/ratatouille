class Round < ApplicationRecord
  belongs_to :chef
  has_many :orders, dependent: :destroy
end
