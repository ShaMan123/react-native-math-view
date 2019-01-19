
#import "RNMathViewManager.h"
#import <React/RCTViewManager.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTView.h>
#import <React/UIView+React.h>
#import <React/RCTUIManager.h>
#import <IosMath/IosMath.h>
#import <IosMath/MTMathUILabel.h>
#import "RNMathView/RNMathView.h"


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

//RCT_EXPORT_VIEW_PROPERTY(onChange, RCTBubblingEventBlock);
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
 
 RCT_CUSTOM_VIEW_PROPERTY(text, NSString*, RNMathViewManager)
 {
 RNMathViewManager *currentView = !view ? defaultView : view;
 NSArray *arr = [RCTConvert NSArray:json];
 dispatch_async(dispatch_get_main_queue(), ^{
 [currentView late:arr];
 });
 }
 */

RCT_CUSTOM_VIEW_PROPERTY(text, NSString, RNMathView)
{
    NSString* latex = [RCTConvert NSString:json];
    MTMathUILabel *mathLabel = [(view == nil ? defaultView : view) addMathView];
    mathLabel.fontSize=500;
    mathLabel.latex = @"x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}";
    mathLabel.textColor = [UIColor redColor];
    if(mathLabel.error) RCTLogError(@"RNMathView Error: %@",view.mathLabel.error);
    /*
     dispatch_async(dispatch_get_main_queue(), ^{
     view.mathLabel.fontSize=50;
     //view.mathLabel.latex = @"x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}";
     if(view.mathLabel.error) RCTLogError(@"RNMathView Error: %@",view.mathLabel.error);
     });
     */
}


#pragma mark - Lifecycle

- (UIView *)view
{
    return [[RNMathView alloc] init];
    //return [[RNMathView alloc] initWithEventDispatcher: self.bridge.eventDispatcher];
}

@end

