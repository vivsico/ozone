import * as styles from "./index.scss";

import React from "react";

import { UserWidget } from "../../models/UserWidget";
import { Widget } from "../../models/Widget";
import { WidgetInstance } from "../../models/WidgetInstance";

import { backendContextPath, backendUrl, frontendUrl } from "../../environment";

import { SYSTEM_WIDGET_URLS } from "../../stores/system-widgets";

export interface WidgetFrameProps {
    widgetInstance: WidgetInstance;
}

const _WidgetFrame: React.FC<WidgetFrameProps> = ({ widgetInstance }) => {
    const userWidget: UserWidget = widgetInstance.userWidget;
    const widget: Widget = userWidget.widget;

    const url = widget.url;
    if (url.startsWith("local:")) {
        const element = SYSTEM_WIDGET_URLS[url];
        if (!element) {
            return <div />;
        }
        return element;
    }

    const nameJson = JSON.stringify({
        id: widgetInstance.id,
        guid: widget.id,
        url: widget.url,
        owf: true,
        version: "1.0",
        containerVersion: "7.15.1",
        locked: false,
        layout: "",
        webContextPath: backendContextPath(),
        preferenceLocation: `${backendUrl()}/prefs`,
        relayUrl: frontendUrl(),
        lang: "en_US",
        currentTheme: {
            themeName: "a_default",
            themeContrast: "standard",
            themeFontSize: 12
        },
        data: userWidget.launchData
    });

    return <iframe className={styles.widgetFrame} src={url} id={`widget-${widgetInstance.id}`} name={nameJson} />;
};

export const WidgetFrame = React.memo(_WidgetFrame);
