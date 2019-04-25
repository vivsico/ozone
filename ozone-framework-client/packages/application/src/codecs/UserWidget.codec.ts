import { UserWidgetDTO } from "../api/models/UserWidgetDTO";

import { UserWidget } from "../models/UserWidget";
import { Widget } from "../models/Widget";

import { intentFromJson } from "./Intent.codec";
import { widgetTypeFromJson } from "./WidgetType.codec";

import { optional } from "../utility";

export function userWidgetFromJson(dto: UserWidgetDTO): UserWidget {
    const props = dto.value;

    return new UserWidget({
        id: dto.id,
        isDisabled: props.disabled,
        isEditable: props.editable,
        isFavorite: props.favorite,
        isGroupWidget: props.groupWidget,
        originalTitle: props.originalName,
        position: props.position,
        user: {
            username: props.userId,
            displayName: props.userRealName
        },
        widget: new Widget({
            isBackground: props.background,
            isDefinitionVisible: props.definitionVisible,
            description: optional(props.description),
            descriptorUrl: optional(props.descriptorUrl),
            height: props.height,
            id: dto.path,
            images: {
                smallUrl: props.smallIconUrl,
                largeUrl: props.largeIconUrl
            },
            intents: {
                send: props.intents.send.map(intentFromJson),
                receive: props.intents.receive.map(intentFromJson)
            },
            isMaximized: props.maximized,
            isMinimized: props.minimized,
            isMobileReady: props.mobileReady,
            isSingleton: props.singleton,
            title: props.namespace,
            universalName: optional(props.universalName),
            url: props.url,
            isVisible: props.visible,
            types: props.widgetTypes.map(widgetTypeFromJson),
            version: optional(props.widgetVersion),
            width: props.width,
            x: props.x,
            y: props.y
        })
    });
}