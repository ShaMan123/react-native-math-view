
#import "RNMathViewManager.h"
#import <React/RCTViewManager.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTView.h>
#import <React/UIView+React.h>
#import <React/RCTUIManager.h>
#import "MTMathUILabel.h"
#import "RCTConvert+MTMathUILabel.h"

@implementation RNMathViewManager

RCT_EXPORT_MODULE(RNMathView)

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (UIView *)view
{
    MTMathUILabel* label = [[MTMathUILabel alloc] init];
    label.textAlignment = kMTTextAlignmentCenter;
    return label;
}

#pragma mark - Props
RCT_CUSTOM_VIEW_PROPERTY(math, NSString, MTMathUILabel)
{
    MTMathUILabel *currentView = !view ? defaultView : view;
    currentView.latex = json;
    [currentView setNeedsLayout];
    [currentView setNeedsDisplay];
}

RCT_CUSTOM_VIEW_PROPERTY(color, UIColor, MTMathUILabel)
{
    MTMathUILabel *currentView = !view ? defaultView : view;
    currentView.textColor = [RCTConvert UIColor:json];
}

RCT_CUSTOM_VIEW_PROPERTY(fontSize, NSInteger, MTMathUILabel)
{
    MTMathUILabel *currentView = !view ? defaultView : view;
    currentView.fontSize = [json floatValue];
}

RCT_CUSTOM_VIEW_PROPERTY(font, NSInteger, MTMathUILabel)
{
    //MTMathUILabel *currentView = !view ? defaultView : view;
    //currentView.font =
}

RCT_CUSTOM_VIEW_PROPERTY(style, NSObject, MTMathUILabel)
{
    [json set_color:json[@"color"] forView:view withDefaultView:defaultView];
}

-(NSDictionary *)constantsToExport {
    return @{};
}

@end
