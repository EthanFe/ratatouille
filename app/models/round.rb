class Round < ApplicationRecord
  belongs_to :chef
  has_many :orders, dependent: :destroy

  # find fastest completed round with given number of orders
  def self.fastest_round(orders)
    rounds = self.finished_rounds.select do |round|
      round.orders.length == orders
    end
    rounds = rounds.sort_by do |round|
      round.total_time
    end
    rounds.first
  end

  def self.finished_rounds
    Round.all.select do |round| 
      round.orders.all? do |order| 
        order.time != nil
      end
    end 
  end

  def total_time
    sum = self.orders.inject(0) do |sum, order|
      sum + order.time
    end
  end
end
