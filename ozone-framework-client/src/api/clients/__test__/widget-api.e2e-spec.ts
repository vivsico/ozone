import "reflect-metadata";

import { WidgetAPI, WidgetCreateRequest } from "../..";

import { NodeGateway } from "./node-gateway";
import { WIDGETS } from "../../models/__test__/data";


describe("Widget API", () => {

    let gateway: NodeGateway;
    let widgetApi: WidgetAPI;

    beforeAll(async () => {
        gateway = new NodeGateway();
        widgetApi = new WidgetAPI(gateway);

        await gateway.login("testAdmin1", "password");
        expect(gateway.isAuthenticated).toEqual(true);
    });

    test("getWidgets - GET /widget/", async () => {
        const response = await widgetApi.getWidgets();

        expect(response.status).toEqual(200);
        expect(response.data).toMatchObject({
            "success": true,
            "results": 21
        });
    });

    test("getWidgetById - GET /widget/:id/", async () => {
        const widget = WIDGETS[0];

        const response = await widgetApi.getWidgetById(widget.id);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            "success": true,
            "results": 1,
            "data": [widget]
        });
    });

    let createRequest: WidgetCreateRequest;

    test("createWidget - POST /widget/", async () => {
        createRequest = {
            name: "My Test Widget",
            version: "1.0",
            description: "A test widget",
            url: "http://www.ozone.test/widget1/",
            headerIcon: "http://www.ozone.test/widget1/small_icon.png",
            image: "http://www.ozone.test/widget1/large_icon.png",
            width: 200,
            height: 200,
            widgetGuid: "12345678-1234-1234-1234-1234567890a0",
            universalName: "TestWidget.ozone.test",
            visible: true,
            background: false,
            singleton: false,
            mobileReady: false,
            widgetTypes: [{
                id: 1,
                name: "standard"
            }],
            title: "My Test Widget"
        };

        const createResponse = await widgetApi.createWidget(createRequest);

        expect(createResponse.status).toEqual(200);
        expect(createResponse.data).toEqual({
            success: true,
            data: [{
                id: createRequest.widgetGuid,
                namespace: "widget",
                path: createRequest.widgetGuid,
                value: {
                    universalName: createRequest.universalName,
                    namespace: createRequest.name,
                    description: createRequest.description,
                    url: createRequest.url,
                    headerIcon: createRequest.headerIcon,
                    image: createRequest.image,
                    smallIconUrl: createRequest.headerIcon,
                    mediumIconUrl: createRequest.image,
                    width: createRequest.width,
                    height: createRequest.height,
                    x: 0,
                    y:0,
                    minimized: false,
                    maximized:false,
                    widgetVersion: createRequest.version,
                    totalUsers:0,
                    totalGroups:0,
                    singleton:createRequest.singleton,
                    visible: createRequest.visible,
                    background: createRequest.background,
                    mobileReady: createRequest.mobileReady,
                    descriptorUrl: null,
                    definitionVisible: true,
                    directRequired:[],
                    allRequired: [],
                    intents:{
                        send:[],
                        receive:[]
                    },
                    widgetTypes:[{
                        id:createRequest.widgetTypes[0].id,
                        name:createRequest.widgetTypes[0].name,
                        displayName:createRequest.widgetTypes[0].name
                    }]
                }
            }]
        });
    });

    test("getWidgets - GET /widget/ - additional result after created", async () => {
        const response = await widgetApi.getWidgets();

        expect(response.status).toEqual(200);
        expect(response.data).toMatchObject({
            success: true,
            results: 22
        });
    });

    test("deleteWidget - DELETE /widget/", async () => {
        const response = await widgetApi.deleteWidget(createRequest.widgetGuid);

        console.dir(response.data);

        expect(response.status).toEqual(200);
        expect(response.data).toEqual({
            success: true,
            data: [{
                id: createRequest.widgetGuid,
                value: {}
            }]
        });
    });

    test("getWidgets - GET /widget/ - removed after deleted", async () => {
        const response = await widgetApi.getWidgets();

        expect(response.status).toEqual(200);
        expect(response.data).toMatchObject({
            success: true,
            results: 21
        });
    });

});
