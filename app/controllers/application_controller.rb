# frozen_string_literal: true

class ApplicationController < ActionController::Base
  def welcome
    render component: 'Welcome', props: { greeting: 'hello! ' }
  end
end
