/**
 * 3D slice module
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Slice } from "../Slice";
import { Sprite } from "../../Sprite";
import { Container } from "../../Container";
import { LightenFilter } from "../../rendering/filters/LightenFilter";
import * as $math from "../../utils/Math";
import * as $path from "../../rendering/Path";
import * as $type from "../../utils/Type";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Used to draw a 3D slice of a Pie chart.
 *
 * @see {@link ISlice3DEvents} for a list of available events
 * @see {@link ISlice3DAdapters} for a list of available Adapters
 */
var Slice3D = /** @class */ (function (_super) {
    tslib_1.__extends(Slice3D, _super);
    /**
     * Constructor
     */
    function Slice3D() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "Slice3D";
        _this.layout = "none";
        // Create edge container
        var edge = _this.createChild(Container);
        _this.edge = edge;
        edge.shouldClone = false;
        edge.isMeasured = false;
        var lightenFilter = new LightenFilter();
        lightenFilter.lightness = -0.25;
        edge.filters.push(lightenFilter);
        edge.toBack();
        //edge.strokeOpacity = 0;
        _this._disposers.push(edge);
        // Set defaults
        _this.angle = 30;
        _this.depth = 20;
        // Create side A element
        var sideA = _this.createChild(Sprite);
        _this.sideA = sideA;
        sideA.shouldClone = false;
        sideA.isMeasured = false;
        sideA.setElement(_this.paper.add("path"));
        var lightenFilterA = new LightenFilter();
        lightenFilterA.lightness = -0.25;
        sideA.filters.push(lightenFilterA);
        //sideA.strokeOpacity = 0;
        _this._disposers.push(sideA);
        // Crate side B element
        var sideB = _this.createChild(Sprite);
        _this.sideB = sideB;
        sideB.shouldClone = false;
        sideB.isMeasured = false;
        sideB.setElement(_this.paper.add("path"));
        var lightenFilterB = new LightenFilter();
        lightenFilterB.lightness = -0.25;
        sideB.filters.push(lightenFilterB);
        _this._disposers.push(sideB);
        //sideB.strokeOpacity = 0;
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Draws the element.
     *
     * @ignore Exclude from docs
     */
    Slice3D.prototype.draw = function () {
        _super.prototype.draw.call(this);
        // this should go here to hide 3d slices if arc = 0
        for (var i = 0, len = this.edge.children.length; i < len; i++) {
            var slice = this.edge.children.getIndex(i);
            if (slice instanceof Slice) {
                slice.radiusY = this.radiusY;
                slice.radius = this.radius;
                slice.fill = this.fill;
                slice.startAngle = this.startAngle;
                slice.arc = this.arc;
                slice.cornerRadius = this.cornerRadius;
                slice.innerRadius = this.innerRadius;
                slice.strokeOpacity = 0;
            }
        }
        if (this.arc !== 0 && this.radius > 0 && this.depth > 0) {
            this.sideB.show(0);
            this.sideA.show(0);
            this.edge.show(0);
            var startAngle = this.startAngle;
            var arc = this.arc;
            var innerRadius = this.pixelInnerRadius || 0;
            var radiusY = this.radiusY || 0;
            var cornerRadius = this.cornerRadius || 0;
            var innerCornerRadius = this.innerCornerRadius;
            var radius = this.radius;
            // this is code duplicate with $path.arc. @todo to think how to avoid it
            var endAngle = startAngle + arc;
            var crSin = $math.sin($math.min(arc, 45) / 2);
            innerCornerRadius = innerCornerRadius || cornerRadius;
            var innerRadiusY = (radiusY / radius) * innerRadius;
            var cornerRadiusY = (radiusY / radius) * cornerRadius;
            var innerCornerRadiusY = (radiusY / radius) * innerCornerRadius;
            cornerRadius = $math.fitToRange(cornerRadius, 0, (radius - innerRadius) / 2);
            cornerRadiusY = $math.fitToRange(cornerRadiusY, 0, (radiusY - innerRadiusY) / 2);
            innerCornerRadius = $math.fitToRange(innerCornerRadius, 0, (radius - innerRadius) / 2);
            innerCornerRadiusY = $math.fitToRange(innerCornerRadiusY, 0, (radiusY - innerRadiusY) / 2);
            cornerRadius = $math.fitToRange(cornerRadius, 0, radius * crSin);
            cornerRadiusY = $math.fitToRange(cornerRadiusY, 0, radiusY * crSin);
            innerCornerRadius = $math.fitToRange(innerCornerRadius, 0, innerRadius * crSin);
            innerCornerRadiusY = $math.fitToRange(innerCornerRadiusY, 0, innerRadiusY * crSin);
            //let crAngle: number = Math.asin(cornerRadius / radius / 2) * $math.DEGREES * 2;
            //let crAngleY: number = Math.asin(cornerRadiusY / radiusY / 2) * $math.DEGREES * 2;
            if (innerRadius < innerCornerRadius) {
                innerRadius = innerCornerRadius;
            }
            if (innerRadiusY < innerCornerRadiusY) {
                innerRadiusY = innerCornerRadiusY;
            }
            var crInnerAngle = Math.asin(innerCornerRadius / innerRadius / 2) * $math.DEGREES * 2;
            var crInnerAngleY = Math.asin(innerCornerRadiusY / innerRadiusY / 2) * $math.DEGREES * 2;
            if (!$type.isNumber(crInnerAngle)) {
                crInnerAngle = 0;
            }
            if (!$type.isNumber(crInnerAngleY)) {
                crInnerAngleY = 0;
            }
            //let middleAngle = startAngle + arc / 2;
            //let mPoint = { x: $math.round($math.cos(middleAngle) * innerRadius, 4), y: $math.round($math.sin(middleAngle) * innerRadiusY, 4) };
            var a0 = { x: $math.round($math.cos(startAngle) * (innerRadius + innerCornerRadius), 4), y: $math.round($math.sin(startAngle) * (innerRadiusY + innerCornerRadiusY), 4) };
            var b0 = { x: $math.round($math.cos(startAngle) * (radius - cornerRadius), 4), y: $math.round($math.sin(startAngle) * (radiusY - cornerRadiusY), 4) };
            var c0 = { x: $math.round($math.cos(endAngle) * (radius - cornerRadius), 4), y: $math.round($math.sin(endAngle) * (radiusY - cornerRadiusY), 4) };
            var d0 = { x: $math.round($math.cos(endAngle) * (innerRadius + innerCornerRadius), 4), y: $math.round($math.sin(endAngle) * (innerRadiusY + innerCornerRadiusY), 4) };
            // end of duplicate
            var h = this.depth;
            var ah = { x: a0.x, y: a0.y - h };
            var bh = { x: b0.x, y: b0.y - h };
            var ch = { x: c0.x, y: c0.y - h };
            var dh = { x: d0.x, y: d0.y - h };
            this.sideA.path = $path.moveTo(a0) + $path.lineTo(b0) + $path.lineTo(bh) + $path.lineTo(ah) + $path.closePath();
            this.sideB.path = $path.moveTo(c0) + $path.lineTo(d0) + $path.lineTo(dh) + $path.lineTo(ch) + $path.closePath();
            if (this.startAngle < 90) {
                this.sideA.toBack();
            }
            else {
                this.sideA.toFront();
            }
            if (this.startAngle + this.arc > 90) {
                this.sideB.toBack();
            }
            else {
                this.sideB.toFront();
            }
        }
        else {
            this.sideA.hide(0);
            this.sideB.hide(0);
            this.edge.hide(0);
        }
    };
    Object.defineProperty(Slice3D.prototype, "depth", {
        /**
         * @return Depth (px)
         */
        get: function () {
            return this.getPropertyValue("depth");
        },
        /**
         * Depth (height) of the 3D slice in pixels.
         *
         * @default 20
         * @param depth  Depth (px)
         */
        set: function (depth) {
            if (this.setPropertyValue("depth", depth, true)) {
                this.edge.removeChildren();
                var d = 3;
                if (depth > 0) {
                    var count = Math.ceil(this.depth / d);
                    var step = depth / count;
                    for (var i = 0; i <= count; i++) {
                        var slice = this.edge.createChild(Slice);
                        slice.isMeasured = false;
                        slice.y = -step * i;
                    }
                }
                this.slice.dy = -this.depth;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slice3D.prototype, "angle", {
        /**
         * @return Angle
         */
        get: function () {
            var angle = this.getPropertyValue("angle");
            if (!$type.isNumber(angle)) {
                angle = 0;
            }
            return angle;
        },
        /**
         * Angle of the point of view to the 3D element. (0-360)
         *
         * @default 30
         * @param value  Angle
         */
        set: function (value) {
            this.setPropertyValue("angle", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slice3D.prototype, "radiusY", {
        /**
         * @return Vertical radius (0-1)
         */
        get: function () {
            var radiusY = this.getPropertyValue("radiusY");
            if (!$type.isNumber(radiusY)) {
                radiusY = this.radius - this.radius * this.angle / 90;
            }
            return radiusY;
        },
        /**
         * Vertical radius for creating skewed slices.
         *
         * This is relevant to `radius`, e.g. 0.5 will set vertical radius to half
         * the `radius`.
         *
         * @param value Vertical radius (0-1)
         */
        set: function (value) {
            this.setPropertyValue("radiusY", value, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Copies all properties and related data from a different instance of Axis.
     *
     * @param source Source Axis
     */
    Slice3D.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        this.edge.copyFrom(source.edge);
        this.sideA.copyFrom(source.sideA);
        this.sideB.copyFrom(source.sideB);
    };
    return Slice3D;
}(Slice));
export { Slice3D };
//# sourceMappingURL=Slice3D.js.map