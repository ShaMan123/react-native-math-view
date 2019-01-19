
Pod::Spec.new do |s|
  s.name         = "RNMathView"
  s.version      = "1.0.0"
  s.summary      = "RNMathView"
  s.description  = <<-DESC
                  RNMathView
                   DESC
  s.homepage     = "https://github.com/ShaMan123/react-native-math-view"
  s.license      = "MIT"
  # s.license      = { :type => "MIT", :file => "FILE_LICENSE" }
s.author             = { "ShaMan123" => "github: ShaMan123" }
  s.platform     = :ios, "7.0"
  s.source       = { :git => "https://github.com/ShaMan123/react-native-math-view.git", :tag => "master" }
  s.source_files  = "ios/**/*.{h,m}"
  s.requires_arc = true


  s.dependency "iosMath"
  #s.dependency "others"

end

  
