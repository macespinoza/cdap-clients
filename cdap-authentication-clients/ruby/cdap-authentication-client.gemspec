#  Copyright © 2014 Cask Data, Inc.
#
#  Licensed under the Apache License, Version 2.0 (the "License"); you may not
#  use this file except in compliance with the License. You may obtain a copy of
#  the License at
#
#  http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
#  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
#  License for the specific language governing permissions and limitations under
#  the License.

#encoding: utf-8
$:.push File.expand_path("../lib", __FILE__)
require "cdap-authentication-client/version"

Gem::Specification.new do |s|
  s.name        = "cdap-authentication-client"
  s.version     = AuthenticationClient::VERSION
  s.authors     = ["Yura Tolochkevych"]
  s.email       = ["ytolochkevych@cask.co"]
  s.summary     = "A Ruby client for authentication in Cask CDAP services"
  s.description = "Provide a more Ruby experience when using authentication in Cask CDAP services."

  s.rubyforge_project = "cdap-authentication-client"

  s.add_dependency 'httparty'

  s.add_development_dependency 'pry'
  s.add_development_dependency 'simplecov'
  s.add_development_dependency 'simplecov-rcov'

  s.require_paths = ["lib"]

  s.files = Dir['lib/**/*']
end
