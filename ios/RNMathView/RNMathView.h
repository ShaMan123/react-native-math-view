
#import <UIKit/UIKit.h>
#import <IosMath/IosMath.h>
#import <IosMath/MTMathUILabel.h>

@class RCTEventDispatcher;

@interface RNMathView : UIView

//@property (nonatomic, copy) RCTBubblingEventBlock onChange;
- (instancetype)init;
- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher;
- (MTMathUILabel*)addMathView;

@property (nonatomic) MTMathUILabel *mathLabel;

//- (BOOL)openSketchFile:(NSString *)filename directory:(NSString*) directory contentMode:(NSString*)mode;

@end

