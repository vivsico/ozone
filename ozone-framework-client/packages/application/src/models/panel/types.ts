import { BehaviorObservable } from "../../observables";

import { FitPanel } from "./FitPanel";
import { TabbedPanel, TabbedPanelState } from "./TabbedPanel";
import { ExpandoPanel, ExpandoPanelState } from "./ExpandoPanel";
import { WidgetInstance } from "../WidgetInstance";

export type LayoutType = "fit" | "tabbed" | "accordion" | "portal";

export interface PanelState {
    id: string;
    title: string;
    type: LayoutType;
    widgets: WidgetInstance[];
}

export interface Panel<T extends PanelState = PanelState> {
    readonly id: string;
    readonly type: LayoutType;
    readonly title: string;

    state(): BehaviorObservable<T>;

    closeWidget(instanceId: string): void;

    findWidget(instanceId: string): WidgetInstance | undefined;
}

export function isFitPanel(panel: Panel<any>): panel is FitPanel {
    return panel.type === "fit";
}

export function isTabbedPanel(panel: Panel<any>): panel is TabbedPanel {
    return panel.type === "tabbed";
}

export function isTabbedPanelState(state: PanelState): state is TabbedPanelState {
    return state.type === "tabbed";
}

export function isExpandoPanel(panel: Panel<any>): panel is ExpandoPanel {
    return panel.type === "accordion" || panel.type === "portal";
}

export function isExpandoPanelState(state: PanelState): state is ExpandoPanelState {
    return state.type === "accordion" || state.type === "portal";
}
