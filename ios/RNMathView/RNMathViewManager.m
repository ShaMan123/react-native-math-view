
#import "RNMathViewManager.h"
#import <React/RCTViewManager.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTView.h>
#import <React/UIView+React.h>
#import <React/RCTUIManager.h>
#import "MTMathUILabel.h"

@implementation RNMathViewManager

RCT_EXPORT_MODULE(RNMathView)

- (UIView *)view
{
    MTMathUILabel* label = [[MTMathUILabel alloc] init];
    label.latex = @"x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}";
    //label.frame = CGRectMake(0, 0, 500, 500);
    return label;
}

#pragma mark - Props
RCT_CUSTOM_VIEW_PROPERTY(math, NSString, MTMathUILabel)
{
    MTMathUILabel *currentView = !view ? defaultView : view;
    currentView.latex = json;
}



- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

/*
-(NSDictionary *)constantsToExport {
    //return @{};
}
 */

@end
