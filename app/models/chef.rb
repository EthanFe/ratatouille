class Chef < ApplicationRecord
  has_many :rounds
  has_secure_password

  validates :name, uniqueness: true
end
