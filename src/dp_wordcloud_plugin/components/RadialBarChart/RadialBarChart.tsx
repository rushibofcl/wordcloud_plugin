import {
    selectColorPalette,
    useDashboardSelector,
    useInsightWidgetDataView,
} from "@gooddata/sdk-ui-dashboard";
import React, { useMemo, useEffect, useState, useRef } from "react";
import { IInsightWidget } from "@gooddata/sdk-model";
import { IErrorProps, ILoadingProps } from "@gooddata/sdk-ui";
import * as am5 from "@amcharts/amcharts5";
import * as am5themes_Animated from "@amcharts/amcharts5/themes/Animated.js";
import * as am5wc from "@amcharts/amcharts5/wc.js";

interface IRadialBarChartProps {
    widget: IInsightWidget;
    ErrorComponent: React.ComponentType<IErrorProps>;
    LoadingComponent: React.ComponentType<ILoadingProps>;
    wrapperHeight?: number;
}

export const RadialBarChart: React.FC<IRadialBarChartProps> = ({
    wrapperHeight,
    widget,
    ErrorComponent,
    LoadingComponent,
}) => {
    const colorPalette = useDashboardSelector(selectColorPalette);
    const colors = useMemo(
        () => colorPalette.map((color) => `rgb(${color.fill.r}, ${color.fill.g}, ${color.fill.b})`),
        [colorPalette],
    );

    const { result, error, status } = useInsightWidgetDataView({
        insightWidget: widget,
    });

    const [data, setData] = useState<any[]>([]);
    const rootRef = useRef<am5.Root | null>(null);

    useEffect(() => {
        if (status === "error" || !result) {
            return;
        }

        const slices = result.data().slices().toArray();
        const newData = slices.map((slice) => ({
            weight: slice.rawData()[0],
            tag: slice.sliceTitles()[1],
        }));

        setData(newData);
    }, [result, status]);

    useEffect(() => {
        if (!result) {
            return;
        }

        if (!rootRef.current) {
            rootRef.current = am5.Root.new("chartdiv");
            // rootRef.current.setThemes([am5themes_Animated.new(rootRef.current)]);
        }

        var series = rootRef.current.container.children.push(am5wc.WordCloud.new(rootRef.current, {
            categoryField: "tag",
            valueField: "weight",
            maxFontSize: am5.percent(15),
        }));

        series.labels.template.setAll({
            fontFamily: "Courier New",
        });

        series.data.setAll(data);

        return () => {
            // Cleanup if needed
        };
    }, [data, result]);

    if (status === "loading" || status === "pending") {
        return <LoadingComponent />;
    }

    if (status === "error" || !result) {
        return <ErrorComponent message={error?.message ?? "Unknown error"} />;
    }

    return <div id="chartdiv" style={{ width: "100%", height: `${wrapperHeight}px` }} />;
};


// import {
//     selectColorPalette,
//     useDashboardSelector,
//     useInsightWidgetDataView,
// } from "@gooddata/sdk-ui-dashboard";
// import React, { useMemo } from "react";
// import { IInsightWidget } from "@gooddata/sdk-model";
// import { IErrorProps, ILoadingProps } from "@gooddata/sdk-ui";
// import { Legend, RadialBar, ResponsiveContainer, RadialBarChart as RBC } from "recharts";

// interface IRadialBarChartProps {
//     widget: IInsightWidget;
//     ErrorComponent: React.ComponentType<IErrorProps>;
//     LoadingComponent: React.ComponentType<ILoadingProps>;
//     wrapperHeight?: number;
// }

// export const RadialBarChart: React.FC<IRadialBarChartProps> = ({
//     wrapperHeight,
//     widget,
//     ErrorComponent,
//     LoadingComponent,
// }) => {
//     const colorPalette = useDashboardSelector(selectColorPalette);
//     const colors = useMemo(
//         () => colorPalette.map((color) => `rgb(${color.fill.r}, ${color.fill.g}, ${color.fill.b})`),
//         [colorPalette],
//     );

//     const { result, error, status } = useInsightWidgetDataView({
//         insightWidget: widget,
//     });

//     if (status === "loading" || status === "pending") {
//         return <LoadingComponent />;
//     }

//     if (status === "error" || !result) {
//         return <ErrorComponent message={error?.message ?? "Unknown error"} />;
//     }

//     const data = result
//         .data()
//         .slices()
//         .toArray()
//         .map((slice, i) => ({
//             name: slice.sliceTitles()[0],
//             value: parseFloat(`${slice.rawData()[0] ?? ""}`),
//             fill: colors[i % colors.length],
//         }));

//     return (
//         <ResponsiveContainer width={"100%"} height={wrapperHeight}>
//             <RBC innerRadius="10%" outerRadius="100%" barSize={10} data={data}>
//                 <RadialBar
//                     // minAngle={15}
//                     // uncomment the following line to display labels
//                     // label={{ position: 'insideStart', fill: '#fff' }}
//                     background
//                     // clockWise
//                     dataKey="value"
//                 />
//                 <Legend
//                     layout="vertical"
//                     verticalAlign="top"
//                     align="right"
//                     iconSize={12}
//                     wrapperStyle={{ fontSize: 12 }}
//                 />
//             </RBC>
//         </ResponsiveContainer>
//     );
// };
