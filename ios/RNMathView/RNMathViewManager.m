
#import "RNMathViewManager.h"
#import <React/RCTViewManager.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTView.h>
#import <React/UIView+React.h>
#import <React/RCTUIManager.h>
#import <IosMath/IosMath.h>
#import "MTMathUILabel.h"

@implementation RNMathViewManager

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
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
/*
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
 */
#pragma mark - Lifecycle

- (UIView *)view
{
    MTMathUILabel* label = [[MTMathUILabel alloc] init];
    label.latex = @"x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}";
    return label;
    //return [[RNSketchCanvas alloc] initWithEventDispatcher: self.bridge.eventDispatcher];
}

@end

