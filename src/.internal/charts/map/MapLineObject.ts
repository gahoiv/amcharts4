/**
 * Map line module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../core/Container";
import { SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { MapLine } from "./MapLine";
import { IOrientationPoint } from "../../core/defs/IPoint";
import { registry } from "../../core/Registry";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[MapLineObject]].
 */
export interface IMapLineObjectProperties extends IContainerProperties {

	/**
	 * Sets object's relative position (0-1) within the line.
	 *
	 * `0` will place the object at the beginning of the line. `1` - at the end.
	 *
	 * Any intermediate number will place the object at some point within the
	 * line.
	 */
	position?: number;

	/**
	 * If set to `true`, the object will be automatically rotated to face the
	 * direction of the line at the specific position.
	 *
	 * This allows creating images that has its "front" always facing the logical
	 * direction of the line.
	 *
	 * @default false
	 */
	adjustRotation?: boolean;

}

/**
 * Defines events for [[MapLineObject]].
 */
export interface IMapLineObjectEvents extends IContainerEvents { }

/**
 * Defines adapters for [[MapLineObject]].
 *
 * @see {@link Adapter}
 */
export interface IMapLineObjectAdapters extends IContainerAdapters, IMapLineObjectProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Draws a line on the map.
 *
 * @see {@link IMapLineObjectEvents} for a list of available events
 * @see {@link IMapLineObjectAdapters} for a list of available Adapters
 */
export class MapLineObject extends Container {

	/**
	 * Defines available properties.
	 */
	public _properties!: IMapLineObjectProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IMapLineObjectAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IMapLineObjectEvents;

	/**
	 * A reference to the [[MapLine]] object this object is attached to.
	 *
	 * @todo Review if necessary (same as parent)
	 */
	public mapLine: MapLine;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.adjustRotation = true;
		this.className = "MapLineObject";
		this.isMeasured = false;
		this.layout = "none";
		this.applyTheme();
	}

	/**
	 * (Re)validates element's position.
	 *
	 * @ignore Exclude from docs
	 */
	public validatePosition() {
		if (this.mapLine) {
			let point: IOrientationPoint = this.mapLine.positionToPoint(this.position);
			this.x = point.x;
			this.y = point.y;

			if (this.adjustRotation) {
				this.rotation = point.angle;
			}

			let dataItem = this.mapLine.dataItem;
			if (dataItem) {
				let series = this.mapLine.dataItem.component;
				this.scale = 1 / series.scale;
			}
		}

		super.validatePosition();
	}

	/**
	 * Sets object's relative position (0-1) within the line.
	 *
	 * `0` will place the object at the beginning of the line. `1` - at the end.
	 *
	 * Any intermediate number will place the object at some point within the
	 * line.
	 *
	 * @param value  Position within the line (0-1)
	 */
	public set position(value: number) {
		this.setPropertyValue("position", value, false, true);
	}

	/**
	 * @return Position within the line
	 */
	public get position(): number {
		return this.getPropertyValue("position");
	}

	/**
	 * If set to `true`, the object will be automatically rotated to face the
	 * direction of the line at the specific position.
	 *
	 * This allows creating images that has its "front" always facing the logical
	 * direction of the line.
	 *
	 * @default false
	 * @param value  Auto-rotate
	 */
	public set adjustRotation(value: boolean) {
		this.setPropertyValue("adjustRotation", value, false, true);
	}

	/**
	 * @return Auto-rotate
	 */
	public get adjustRotation(): boolean {
		return this.getPropertyValue("adjustRotation");
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MapLineObject"] = MapLineObject;
