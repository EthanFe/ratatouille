class Chef < ApplicationRecord
  has_many :rounds
  has_secure_passwords
end
