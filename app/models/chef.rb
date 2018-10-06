class Chef < ApplicationRecord
  has_many :rounds, dependent: :destroy
  has_secure_password

  validates :name, uniqueness: true

  def validRounds(order_count)
    self.rounds.select do |r| 
      all_orders_finished = r.orders.all? do |o|
        o.time != nil
      end
      all_orders_finished && (!order_count || r.orders.length == order_count)
    end 
  end

  def totalTime(order_count)
    time = 0.0
    self.validRounds(order_count).each do |r|
      r.orders.each do |o|
        time += o.time
      end 
    end
    time 
  end

  def totalOrders(order_count)
    orders = 0
    self.validRounds(order_count).each do |r|
      orders += r.orders.length
    end
    orders
  end

  def averageTime(order_count)
    if(self.totalOrders(order_count) == 0)
      0.0
    else 
      self.totalTime(order_count)/self.totalOrders(order_count)
    end
  end

  def didNotPlay?(order_count)
    self.validRounds(order_count).length == 0
  end

  def best_time(order_count)
    round = self.validRounds(order_count).sort_by { |round| round.total_time }.first
    round ? round.total_time : nil
  end
end 
