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
    
  def self.order_counts_played
    counts = {}
    self.finished_rounds.each do |round|
      unless round.orders.length == 0
        counts[round.orders.length] = true
      end
    end
    counts.map {|k, v|  k }.sort
  end
end
