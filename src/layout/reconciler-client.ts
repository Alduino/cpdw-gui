import Reconciler, {OpaqueHandle} from "react-reconciler";
import RootNode, {NodeName, NodeProps} from "./dom/RootNode";
import DrawableNode from "./dom/DrawableNode";
import {ReactNode, version} from "react";
import {GLContext} from "../graphics";
import Vector2 from "@equinor/videx-vector2";

type Type = NodeName;
type Props = NodeProps;
type Container = RootNode;
type Instance = DrawableNode;
type TextInstance = never;
type SuspenseInstance = never;
type HydratableInstance = never;
type PublicInstance = Instance;
type HostContext = null;
type UpdatePayload = Record<string, any>;
type ChildSet = never;
type TimeoutHandle = NodeJS.Timeout;
type NoTimeout = -1;

const CpdwRenderer = Reconciler<Type,
    Props,
    Container,
    Instance,
    TextInstance,
    SuspenseInstance,
    HydratableInstance,
    PublicInstance,
    HostContext,
    UpdatePayload,
    ChildSet,
    TimeoutHandle,
    NoTimeout>({
    appendChild(parentInstance: Instance, child: Instance | TextInstance): void {
        parentInstance.appendChild(child);
    },
    appendChildToContainer(container: Container, child: Instance | TextInstance): void {
        container.appendChild(child);
    },
    appendInitialChild(parentInstance: Instance, child: Instance | TextInstance): void {
        parentInstance.appendChild(child);
    },
    canHydrateInstance(instance: HydratableInstance, type: Type, props: Props): null | Instance {
        throw new Error("Hydration is not supported");
    },
    canHydrateSuspenseInstance(instance: HydratableInstance): SuspenseInstance {
        throw new Error("Hydration is not supported");
    },
    canHydrateTextInstance(instance: HydratableInstance, text: string): TextInstance {
        throw new Error("Hydration is not supported");
    },
    cancelTimeout(id: TimeoutHandle): void {
        clearTimeout(id);
    },
    clearContainer(container: Container): void {
        container.clearChildren();
    },
    commitHydratedContainer(container: Container): void {
        throw new Error("Hydration is not supported");
    },
    commitHydratedSuspenseInstance(suspenseInstance: SuspenseInstance): void {
        throw new Error("Hydration is not supported");
    },
    commitMount(instance: Instance, type: Type, props: Props, internalInstanceHandle: OpaqueHandle): void {
        throw new Error("Not implemented");
    },
    commitTextUpdate(textInstance: TextInstance, oldText: string, newText: string): void {
        throw new Error("Text nodes are not supported");
    },
    commitUpdate(instance: Instance, updatePayload: UpdatePayload, type: Type, prevProps: Props, nextProps: Props, internalHandle: OpaqueHandle): void {
        instance.applyProps(updatePayload);
    },
    createInstance(type: Type, props: Props, rootContainer: Container, hostContext: HostContext, internalHandle: OpaqueHandle): Instance {
        return rootContainer.createNode(type, props);
    },
    createTextInstance(text: string, rootContainer: Container, hostContext: HostContext, internalHandle: OpaqueHandle): TextInstance {
        throw new Error("Text nodes are not supported");
    },
    didNotFindHydratableContainerInstance(parentContainer: Container, type: Type, props: Props): void {
        throw new Error("Hydration is not supported");
    },
    didNotFindHydratableContainerSuspenseInstance(parentContainer: Container): void {
        throw new Error("Hydration is not supported");
    },
    didNotFindHydratableContainerTextInstance(parentContainer: Container, text: string): void {
        throw new Error("Hydration is not supported");
    },
    didNotFindHydratableInstance(parentType: Type, parentProps: Props, parentInstance: Instance, type: Type, props: Props): void {
        throw new Error("Hydration is not supported");
    },
    didNotFindHydratableSuspenseInstance(parentType: Type, parentProps: Props, parentInstance: Instance): void {
        throw new Error("Hydration is not supported");
    },
    didNotFindHydratableTextInstance(parentType: Type, parentProps: Props, parentInstance: Instance, text: string): void {
        throw new Error("Hydration is not supported");
    },
    didNotHydrateContainerInstance(parentContainer: Container, instance: HydratableInstance): void {
        throw new Error("Hydration is not supported");
    },
    didNotHydrateInstance(parentType: Type, parentProps: Props, parentInstance: Instance, instance: HydratableInstance): void {
        throw new Error("Hydration is not supported");
    },
    didNotMatchHydratedContainerTextInstance(parentContainer: Container, textInstance: TextInstance, text: string): void {
        throw new Error("Hydration is not supported");
    },
    didNotMatchHydratedTextInstance(parentType: Type, parentProps: Props, parentInstance: Instance, textInstance: TextInstance, text: string): void {
        throw new Error("Hydration is not supported");
    },
    finalizeInitialChildren(instance: Instance, type: Type, props: Props, rootContainer: Container, hostContext: HostContext): boolean {
        return false;
    },
    getChildHostContext(parentHostContext: HostContext, type: Type, rootContainer: Container): HostContext {
        return parentHostContext;
    },
    getFirstHydratableChild(parentInstance: Container | Instance): HydratableInstance {
        throw new Error("Hydration is not supported");
    },
    getNextHydratableInstanceAfterSuspenseInstance(suspenseInstance: SuspenseInstance): HydratableInstance {
        throw new Error("Hydration is not supported");
    },
    getNextHydratableSibling(instance: HydratableInstance): HydratableInstance {
        throw new Error("Hydration is not supported");
    },
    getParentSuspenseInstance(targetInstance: any): SuspenseInstance {
        throw new Error("Hydration is not supported");
    },
    getPublicInstance(instance: Instance | TextInstance): PublicInstance {
        return instance;
    },
    getRootHostContext(rootContainer: Container): HostContext | null {
        return null;
    },
    hideInstance(instance: Instance): void {
        // TODO
    },
    hideTextInstance(textInstance: TextInstance): void {
        throw new Error("Text nodes are not supported");
    },
    hydrateInstance(instance: Instance, type: Type, props: Props, rootContainerInstance: Container, hostContext: HostContext, internalInstanceHandle: any): any[] | null {
        throw new Error("Hydration is not supported");
    },
    hydrateSuspenseInstance(suspenseInstance: SuspenseInstance, internalInstanceHandle: any): void {
        throw new Error("Hydration is not supported");
    },
    hydrateTextInstance(textInstance: TextInstance, text: string, internalInstanceHandle: any): boolean {
        throw new Error("Hydration is not supported");
    },
    insertBefore(parentInstance: Instance, child: Instance | TextInstance, beforeChild: Instance | TextInstance | SuspenseInstance): void {
        parentInstance.insertChildBefore(beforeChild, child);
    },
    insertInContainerBefore(container: Container, child: Instance | TextInstance, beforeChild: Instance | TextInstance | SuspenseInstance): void {
        container.insertChildBefore(beforeChild, child);
    },
    isPrimaryRenderer: true,
    isSuspenseInstanceFallback(instance: SuspenseInstance): boolean {
        throw new Error("Hydration is not supported");
    },
    isSuspenseInstancePending(instance: SuspenseInstance): boolean {
        throw new Error("Hydration is not supported");
    },
    noTimeout: -1,
    prepareForCommit(containerInfo: Container): Record<string, any> | null {
        return null;
    },
    preparePortalMount(containerInfo: Container): void {
    },
    prepareUpdate(instance: Instance, type: Type, oldProps: Props, newProps: Props, rootContainer: Container, hostContext: HostContext): UpdatePayload | null {
        const entries = Object.entries(newProps) as [keyof NodeProps, NodeProps[keyof NodeProps]][];
        const resultEntries = entries.filter(([key, value]) => oldProps[key] !== value);

        return Object.fromEntries(resultEntries);
    },
    registerSuspenseInstanceRetry(instance: SuspenseInstance, callback: () => void): void {
        throw new Error("Hydration is not supported");
    },
    removeChild(parentInstance: Instance, child: Instance | TextInstance | SuspenseInstance): void {
        parentInstance.removeChild(child);
    },
    removeChildFromContainer(container: Container, child: Instance | TextInstance | SuspenseInstance): void {
        container.removeChild(child);
    },
    resetAfterCommit(containerInfo: Container): void {
    },
    resetTextContent(instance: Instance): void {
    },
    scheduleTimeout(fn: (...args: unknown[]) => unknown, delay: number | undefined): TimeoutHandle {
        return setTimeout(fn, delay);
    },
    shouldSetTextContent(type: Type, props: Props): boolean {
        return false;
    },
    supportsHydration: false,
    supportsMutation: true,
    supportsPersistence: false,
    unhideInstance(instance: Instance, props: Props): void {
    },
    unhideTextInstance(textInstance: TextInstance, text: string): void {
    },
    now(): number {
        return performance.now();
    },
    queueMicrotask(fn: () => void): void {
        queueMicrotask(fn);
    }
});

export interface RenderOptions {
    gl: GLContext;
    listenForResize(cb: (size: Vector2) => void): void;
}

const roots = new Map<GLContext, {container: any, node: RootNode}>();

/**
 * Renders a React node with the specified options
 * @returns Call this function every frame, it does the actual page rendering.
 */
export function render(element: ReactNode, opts: RenderOptions, callback: () => void) {
    CpdwRenderer.injectIntoDevTools({
        bundleType: process.env.NODE_ENV === "production" ? 0 : 1,
        version,
        rendererPackageName: "cpdw-react"
    });

    let {container, node} = roots.get(opts.gl) || {};
    let needsInit = false;
    if (!container) {
        node = new RootNode(opts.gl);
        container = CpdwRenderer.createContainer(node, undefined, undefined, undefined);
        roots.set(opts.gl, {container, node});

        needsInit = true;
    }

    CpdwRenderer.updateContainer(element, container, null, callback);

    if (needsInit) {
        opts.listenForResize(node.onResize.bind(node));
    }

    return () => node.draw();
}
