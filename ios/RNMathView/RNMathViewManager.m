
#import "RNMathViewManager.m"
#import <React/RCTEventDispatcher.h>
#import <React/RCTView.h>
#import <React/UIView+React.h>
#import <React/RCTUIManager.h>

@implementation RNMathViewManager

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

-(NSDictionary *)constantsToExport {
  return @{
           @"MainBundlePath": [[NSBundle mainBundle] bundlePath],
           @"NSDocumentDirectory": [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject],
           @"NSLibraryDirectory": [NSSearchPathForDirectoriesInDomains(NSLibraryDirectory, NSUserDomainMask, YES) firstObject],
           @"NSCachesDirectory": [NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) firstObject],
           };
}


#pragma mark - Events

RCT_EXPORT_VIEW_PROPERTY(onChange, RCTBubblingEventBlock);

#pragma mark - Props
RCT_CUSTOM_VIEW_PROPERTY(localSourceImage, NSDictionary, RNSketchCanvas)
{
  RNSketchCanvas *currentView = !view ? defaultView : view;
  NSDictionary *dict = [RCTConvert NSDictionary:json];
  dispatch_async(dispatch_get_main_queue(), ^{
    [currentView openSketchFile:dict[@"filename"]
                      directory:[dict[@"directory"] isEqual: [NSNull null]] ? @"" : dict[@"directory"]
                    contentMode:[dict[@"mode"] isEqual: [NSNull null]] ? @"" : dict[@"mode"]];
  });
}

RCT_CUSTOM_VIEW_PROPERTY(text, NSArray, RNSketchCanvas)
{
  RNSketchCanvas *currentView = !view ? defaultView : view;
  NSArray *arr = [RCTConvert NSArray:json];
  dispatch_async(dispatch_get_main_queue(), ^{
    [currentView setCanvasText:arr];
  });
}

#pragma mark - Lifecycle

- (UIView *)view
{
  return [[RNSketchCanvas alloc] initWithEventDispatcher: self.bridge.eventDispatcher];
}

#pragma mark - Exported methods

@end

