
#import <React/RCTConvert.h>
#import "MTMathUILabel.h"


@implementation RCTConvert(MTMathUILabel)

+ (UIColor *)UIColor:(id)json
{
    long color = [json longValue];
    return [UIColor colorWithRed:(CGFloat)((color & 0x00FF0000) >> 16) / 0xFF
                    green:(CGFloat)((color & 0x0000FF00) >> 8) / 0xFF
                     blue:(CGFloat)((color & 0x000000FF)) / 0xFF
                    alpha:(CGFloat)((color & 0xFF000000) >> 24) / 0xFF];
}

@end
