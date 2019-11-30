
#import "RNMathView.h"
#import "MTMathUILabel.h"
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>

@implementation RNMathView

- (instancetype)init
{
    self = [super init];
    if (self) {
        NSLog(@"hello baby");
        //_view = [self view];
    }
    return self;
}

- (UIView *)view
{
    MTMathUILabel* label = [[MTMathUILabel alloc] init];
    label.textAlignment = kMTTextAlignmentCenter;
    [self addSubview:label];
    return label;
}

- (void)reactSetFrame:(CGRect)frame
{
    
    CGRect r = [self frame];
    NSLog(@"existing frame %f %f %f %f", r.origin.x, r.origin.y, r.size.width, r.size.height);
    NSLog(@"setting frame %f %f %f %f", frame.origin.x, frame.origin.y, frame.size.width, frame.size.height);
    /*
    [[self mathLabel] setFrame:frame];
    [[self mathLabel] setNeedsLayout];
    NSString* latex = [[self mathLabel] latex];
    MTMathUILabel* mathLabel = [[MTMathUILabel alloc] init];
    mathLabel.textAlignment = kMTTextAlignmentCenter;
    mathLabel.latex = latex;
    [self addSubview:mathLabel];
    //[self setAutoresizesSubviews:YES];
    NSLog(@"hello baby");
    //[self insertReactSubview:mathLabel atIndex:0];
     */
}

- (void)didUpdateReactSubviews
{
    NSLog(@"didUpdateReactSubviews");
}

@end
