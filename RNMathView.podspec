require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
s.name         = "RNMathView"
s.version      = package["version"]
s.summary      = package["description"]
s.description  = <<-DESC
RNMathView
DESC
s.homepage     = package["homepage"]
s.license      = "MIT"
# s.license    = { :type => "MIT", :file => "FILE_LICENSE" }
s.author       = { "author" => package["author"] }
s.platforms    = { :ios => "9.0", :tvos => "9.0" }
s.source       = { :git => package["repository"]["url"], :tag => "#{s.version}" }

s.source_files = "ios/**/*.{h,m}"
s.requires_arc = true

s.dependency "React"
s.dependency "iosMath"
end

