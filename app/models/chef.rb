class Chef < ApplicationRecord
  has_many :rounds, dependent: :destroy
  has_secure_password

  validates :name, uniqueness: true

  def totalTime 
    time = 0.0
    self.rounds.each do |r|
      r.orders.each do |o|
        time += o.time
      end 
    end
    time 
  end

  def totalOrders
    orders = 0
    self.rounds.each do |r|
      orders += r.orders.length
    end
    orders
  end

  def averageTime 
    if(self.totalOrders == 0)
      0.0
    else 
    self.totalTime/self.totalOrders
    end
  end 

  def didNotPlay?
    if(self.averageTime == 0.0)
      true
    else 
      false 
    end 
  end 

end 
