import Node, {EVENT_CHILD_ADDED, EVENT_CHILD_REMOVED, EVENT_PARENT_SET} from "../Node";
import {TransformableDrawer} from "../../../renderer/util/TransformableDrawer";
import Vector2 from "@equinor/videx-vector2";
import {canHandleTransformChange} from "../CanHandleTransformChange";

export interface Transform {
    position: Vector2;
    size: Vector2;
}

export interface ChildTransformInfo extends Transform {
    maxSize: Vector2;
}

export interface CalculatedTransform {
    /**
     * Each value must map to the transform to set on each child
     */
    childTransforms: ChildTransformInfo[];

    /**
     * This object's requested transform. Parent will do with it as it pleases,
     * and set the actual transform of this object.
     */
    requestedTransform: Transform;
}

export type RequestTransformsFn = (maxSizes: Vector2[]) => Transform[];

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

    public static assertDrawable(node: Node): asserts node is DrawableNode<any, any, any> {
        if (!(node instanceof DrawableNode))
            throw new Error(`Invalid child \`${node?.constructor.name ?? "null"}\``);
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
        return this.getParentMaximumPossibleSize();
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
        this.handleTransformChangedImpl(this.getParentMaximumPossibleSize());

        const parent = this.getParent();

        if (canHandleTransformChange(parent)) {
            parent.handleTransformChanged();
        } else {
            this.transform = this.requestedTransform;
        }
    }

    /**
     * Default way to run getRequestedTransforms, calls with this object's max possible size
     * @protected
     */
    protected requestTransformsDefault(requestTransforms: RequestTransformsFn, childCount: number, maxPossibleSize: Vector2) {
        return requestTransforms(Array.from({length: childCount}, () => maxPossibleSize));
    }

    /**
     * Called when this or a child's transform changes.
     * @param requestTransforms - Runs each child's calculateTransform with the specified max size, and returns the
     * result. If not custom, use {@see defaultGetRequestedTransforms}
     * @param childCount - The number of children
     * @param subProps - The SubProps of each child
     * @param maxPossibleSize - The amount of space the node can take up
     * @protected
     */
    protected abstract calculateTransform(requestTransforms: RequestTransformsFn, childCount: number, subProps: SubProps[], maxPossibleSize: Vector2): CalculatedTransform;

    private handleTransformChangedImpl(maxSize: Vector2) {
        const children = this.getChildren();

        const childSubProps = children.map(child => {
            DrawableNode.assertDrawable(child);
            return this.getSubpropsOf(child);
        });

        const getRequestedTransforms: RequestTransformsFn = (maxSizes: Vector2[]) => {
            return children.map((child, i) => {
                DrawableNode.assertDrawable(child);
                child.handleTransformChangedImpl(maxSizes[i]);
                return child.requestedTransform;
            });
        };

        const calculatedTransform = this.calculateTransform(getRequestedTransforms, children.length, childSubProps, maxSize);
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

            if (!transform.size.equals(child.requestedTransform.size)) {
                child.handleTransformChangedImpl(transform.maxSize);
            }

            child.transform = transform;
        });
    }

    private getSubpropsOf(child: DrawableNode<any, any, any>): SubProps | undefined {
        const fullNameEntries = Object.entries(child.props).filter(([key]) => key.startsWith(this.subPrefix));
        const shortNameEntries = fullNameEntries.map(([key, value]) => {
            const subName = key.substring(this.subPrefix.length);
            const lowerName = subName[0].toLowerCase() + subName.substring(1);
            return [lowerName, value];
        });
        return Object.fromEntries(shortNameEntries);
    }
}
