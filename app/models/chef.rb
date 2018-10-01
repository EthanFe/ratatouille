class Chef < ApplicationRecord
  has_many :rounds, dependent: :destroy
  has_secure_password

  validates :name, uniqueness: true
end
