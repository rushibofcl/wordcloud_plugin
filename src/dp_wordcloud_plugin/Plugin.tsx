// (C) 2021-2022 GoodData Corporation
import {
    DashboardContext,
    DashboardPluginV1,
    IDashboardCustomizer,
    IDashboardEventHandling,
    IDashboardWidgetProps,
    newDashboardSection,
    newDashboardItem,
    newCustomWidget,
    
} from "@gooddata/sdk-ui-dashboard";
import { insightVisualizationUrl, widgetTitle } from "@gooddata/sdk-model";

// this import will be renamed in plugin-toolkit
import entryPoint from "../dp_wordcloud_plugin_entry/index.js";

import React from "react";
import RadialBarChartWrapper from "./components/RadialBarChart/RadialBarChartWrapper.js";

export const WIDGET_TITLE_SUFFIX = "wordcloud_plugin";
const RE = new RegExp(`(.*)${WIDGET_TITLE_SUFFIX}$`);

/*
 * Component to render 'myCustomWidget'. If you create custom widget instance and also pass extra data,
 * then that data will be available in
 */
function MyCustomWidget(_props: IDashboardWidgetProps): JSX.Element {
    return <div>Hello from custom widget</div>;
}

export class Plugin extends DashboardPluginV1 {
    public readonly author = entryPoint.author;
    public readonly displayName = entryPoint.displayName;
    public readonly version = entryPoint.version;
    public readonly minEngineVersion = entryPoint.minEngineVersion;
    public readonly maxEngineVersion = entryPoint.maxEngineVersion;
    public readonly compatibility = entryPoint.compatibility;

    public onPluginLoaded(_ctx: DashboardContext, _parameters?: string): Promise<void> | void {
        /*
         * This will be called when the plugin is loaded in context of some dashboard and before
         * the register() method.
         *
         * If the link between the dashboard and this plugin is parameterized, then all the parameters will
         * be included in the parameters string.
         *
         * The parameters are useful to modify plugin behavior in context of particular dashboard.
         *
         * Note: it is safe to delete this stub if your plugin does not need any specific initialization.
         */
    }

    public register(
        _ctx: DashboardContext,
        customize: IDashboardCustomizer,
        handlers: IDashboardEventHandling,
    ): void {
        customize.insightWidgets().withCustomProvider((insight, widget) => {
            if (insightVisualizationUrl(insight) === "local:table" && widgetTitle(widget).match(RE)) {
                console.log("insight",insight);
                console.log("widget",widget);
                return RadialBarChartWrapper;
            }
            return undefined;
        });
        handlers.addEventHandler("GDC.DASH/EVT.INITIALIZED", (evt) => {
            // eslint-disable-next-line no-console
            console.log("### Dashboard initialized", evt);
        });
    }

    public onPluginUnload(_ctx: DashboardContext): Promise<void> | void {
        /*
         * This will be called when user navigates away from the dashboard enhanced by the plugin. At this point,
         * your code may do additional teardown and cleanup.
         *
         * Note: it is safe to delete this stub if your plugin does not need to do anything extra during unload.
         */
    }
}
