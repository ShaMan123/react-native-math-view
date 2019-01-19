#import <React/RCTEventDispatcher.h>
#import "RNMathView.h"

@implementation RNMathView
{
    RCTEventDispatcher *_eventDispatcher;
    MTMathUILabel *_mathLabel;
}

- (instancetype)init
{
    self = [super init];
    return self;
}

- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher
{
    self = [self init];
    if (self) {
        _eventDispatcher = eventDispatcher;
    }
    return self;
}

- (MTMathUILabel*)addMathView
{
    MTMathUILabel *view = [[MTMathUILabel alloc] init];
    [super addSubview:view];
    _mathLabel=view;
    return view;
}

@end
