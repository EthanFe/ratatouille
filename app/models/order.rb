class Order < ApplicationRecord
  belongs_to :round
  belongs_to :recipe
end
