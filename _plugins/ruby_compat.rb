# frozen_string_literal: true

unless Object.method_defined?(:tainted?)
  class Object
    def tainted?
      false
    end
  end
end
