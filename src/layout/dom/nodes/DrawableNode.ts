import Node, {EVENT_CHILD_ADDED, EVENT_CHILD_REMOVED, EVENT_PARENT_SET} from "../Node";
import {TransformableDrawer} from "../../../renderer/util/TransformableDrawer";
import Vector2 from "@equinor/videx-vector2";
import {canHandleTransformChange} from "../CanHandleTransformChange";

export interface Transform {
    position: Vector2;
    size: Vector2;
}

export interface CalculatedTransform {
    /**
     * Each value must map to the transform to set on a child
     */
    childTransforms: Transform[];

    /**
     * This object's requested transform. Parent will do with it as it pleases, and set the actual transform of this
     * object.
     */
    requestedTransform: Transform;
}

export interface TransformCalculationInfo<SubProps = {}> {
    /**
     * Subprops of the child
     */
    subProps?: SubProps;

    /**
     * The child's `requestedTransform` from its `calculateTransform()`
     */
    requestedTransform: Transform;
}

export default abstract class DrawableNode<Props, SubProps = {}, SubPropPrefix extends string = never> extends Node {
    protected abstract readonly subPrefix: SubPropPrefix;

    private requestedTransform: Transform;
    private transform: Transform;

    private props: Props = {} as Props;

    protected constructor(protected readonly drawer: TransformableDrawer) {
        super();

        this.on(EVENT_CHILD_ADDED, () => this.handleTransformChanged());
        this.on(EVENT_CHILD_REMOVED, () => this.handleTransformChanged());
        this.on(EVENT_PARENT_SET, () => this.handleTransformChanged());
    }

    /**
     * Set the specified props on the object.
     *
     * Important: `drawer.size`, `drawer.transform.position` and `drawer.transform.viewportSize`
     * must not be set here. These should be set in local values instead.
     *
     * Important: If you change any variables used in `handleTransformChanged()`, you must call that method.
     *
     * Important: You must call the super method if you override this.
     */
    applyProps(props: Props) {
        Object.assign(this.props, props);
    }

    /**
     * Override to set a custom maximum possible size, defaults to the size of the parent
     */
    getMaximumPossibleSize() {
        return this.getParent().getMaximumPossibleSize();
    }

    setViewportSize(size: Vector2) {
        this.drawer.transform.viewportSize = size;

        for (const child of this.getChildren()) {
            if (!(child instanceof DrawableNode))
                throw new Error(`Invalid child \`${child?.constructor.name ?? "null"}\``);

            child.setViewportSize(size);
        }

        this.handleTransformChanged();
    }

    draw(offset = Vector2.zero) {
        const position = this.transform.position.add(offset);
        this.drawer.transform.offset = position;
        this.drawer.size = this.transform.size;
        this.drawer.draw();

        for (const child of this.getChildren()) {
            if (!(child instanceof DrawableNode))
                throw new Error(`Invalid child \`${child?.constructor.name ?? "null"}\``);

            child.draw(position);
        }
    }

    /**
     * Must be called whenever a transform value changes. Must also be called in constructor.
     * @protected
     */
    protected handleTransformChanged() {
        const childInfos = this.getChildren().map(child => {
            if (!(child instanceof DrawableNode))
                throw new Error(`Invalid child \`${child?.constructor.name ?? "null"}\``);

            return {
                requestedTransform: child.requestedTransform,
                subProps: this.getSubpropsOf(child)
            };
        });

        const calculatedTransform = this.calculateTransform(childInfos);
        if (!calculatedTransform.requestedTransform) throw new Error("No requested transform set");
        if (!calculatedTransform.requestedTransform.position) throw new Error("Requested transform does not have a position");
        if (!calculatedTransform.requestedTransform.size) throw new Error("Requested transform does not have a size");

        this.requestedTransform = calculatedTransform.requestedTransform;

        this.getChildren().forEach((child, index) => {
            if (!(child instanceof DrawableNode))
                throw new Error(`Invalid child \`${child?.constructor.name ?? "null"}\``);

            const transform = calculatedTransform.childTransforms[index];
            if (!transform) throw new Error(`No transform specified for child ${index}`);
            if (!transform.position) throw new Error("Child transform does not have a position");
            if (!transform.size) throw new Error("Child transform does not have a size");

            child.transform = transform;
        });

        const parent = this.getParent();

        if (canHandleTransformChange(parent)) {
            parent.handleTransformChanged();
        } else {
            this.transform = this.requestedTransform;
        }
    }

    /**
     * Called when this or a child's transform changes.
     * @param infos - Maps to child of same index
     * @protected
     */
    protected abstract calculateTransform(infos: TransformCalculationInfo<SubProps>[]): CalculatedTransform;

    private getSubpropsOf(child: DrawableNode<any, any, any>): SubProps | undefined {
        const fullNameEntries = Object.entries(child.props).filter(([key]) => key.startsWith(this.subPrefix));
        if (fullNameEntries.length === 0) return undefined;
        const shortNameEntries = fullNameEntries.map(([key, value]) => {
            const subName = key.substring(this.subPrefix.length);
            const lowerName = subName[0].toLowerCase() + subName.substring(1);
            return [lowerName, value];
        });
        return Object.fromEntries(shortNameEntries);
    }
}
