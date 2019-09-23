package io.autodidact.rnmathview;

import com.facebook.react.uimanager.PixelUtil;

public class SVGAttributes {
    String svg;
    float width;
    float height;
    static int ex = 8;

    SVGAttributes(String svg) {
        this.svg = svg;
        SVGLength widthAttr = new SVGLength(getAttr("width"));
        SVGLength heightAttr = new SVGLength(getAttr("height"));
        width = ((float) (PixelUtil.toPixelFromDIP(widthAttr.value) * ex));
        height = ((float) (PixelUtil.toPixelFromDIP(heightAttr.value) * ex));
    }

    String getAttr(String name){
        String svgXMLDec = svg.substring(svg.indexOf("<svg"), svg.indexOf(">"));
        int startAt = svgXMLDec.indexOf(name);
        return svgXMLDec.substring(svgXMLDec.indexOf("=", startAt) + 2, svgXMLDec.indexOf(" ", startAt) - 1);
    }
}
