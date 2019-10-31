window.am4core.ready(async function() {
  const data = await (await fetch("api/data")).json();
  console.log("data: ", data);

  // Themes begin
  window.am4core.useTheme(window.am4themes_animated);
  // Themes end

  const chartByExtensionData = [
    {
      category: "All found assets in scope by extension",
      units: Object.keys(data.allAssets).length,
      pie: [
        {
          value: Object.keys(data.allAssets).filter(file =>
            /\.(js|jsx|ts|tsx|vue)$/.test(file)
          ).length,
          title: "JS (js, jsx, ts, tsx, vue)"
        },
        {
          value: Object.keys(data.allAssets).filter(file =>
            /\.(scss|sass|less|css)$/.test(file)
          ).length,
          title: "styles (scss, sass, less, css)"
        },
        {
          value: Object.keys(data.allAssets).filter(file =>
            /\.(jpg|png|gif|svg)$/.test(file)
          ).length,
          title: "images (jpg, png, gif, svg)"
        }
      ]
    },

    {
      category: "All imported assets by extension",
      units: Object.keys(data.usedAssets).length,
      pie: [
        {
          value: Object.keys(data.usedAssets).filter(file =>
            /\.(js|jsx|ts|tsx|vue)$/.test(file)
          ).length,
          title: "JS (js, jsx, ts, tsx, vue)"
        },
        {
          value: Object.keys(data.usedAssets).filter(file =>
            /\.(scss|sass|less|css)$/.test(file)
          ).length,
          title: "styles (scss, sass, less, css)"
        },
        {
          value: Object.keys(data.usedAssets).filter(file =>
            /\.(jpg|png|gif|svg)$/.test(file)
          ).length,
          title: "images (jpg, png, gif, svg)"
        }
      ]
    }
    // {
    //   category: "All imported assets by import type",
    //   units: Object.keys(data.usedAssets).length,
    //   pie: [
    //     {
    //       value: Object.values(data.usedAssets).filter(
    //         ({ asyncImport, syncImport }) => asyncImport && !syncImport
    //       ).length,
    //       title: "Only with dynamic import"
    //     },
    //     {
    //       value: Object.values(data.usedAssets).filter(
    //         ({ asyncImport, syncImport }) => !asyncImport && syncImport
    //       ).length,
    //       title: "Only with sync import"
    //     },
    //     {
    //       value: Object.values(data.usedAssets).filter(
    //         ({ asyncImport, syncImport }) => asyncImport && syncImport
    //       ).length,
    //       title: "Both with sync and dynamic import"
    //     }
    //   ]
    // }
  ];

  var chartData = [
    {
      category: "All assets found in search dir",
      units: Object.keys(data.allAssets).length,
      pie: [
        {
          value: Object.keys(data.usedAssets).length,
          title: "imported assets"
        },
        {
          value: Object.keys(data.unusedAssets).length,
          title: "unused assets"
        }
      ]
    },
    {
      category: "All imported assets by types",
      units: Object.keys(data.usedAssets).length,
      pie: [
        {
          value: data.importedButNotFound.length,
          title: "imported but file does not exist"
        },
        {
          value: data.importedButNotFoundInScope.length,
          title: "imported and exist but not in search scope"
        },
        {
          value: data.importedNodeModules.length,
          title: "imported from node_module"
        },
        {
          value:
            Object.keys(data.usedAssets).length -
            data.importedButNotFound.length -
            data.importedButNotFoundInScope.length -
            data.importedNodeModules.length,
          title: "imported from project"
        }
      ]
    }
  ];

  // Create chart instance
  var chart = window.am4core.create("chartdiv", window.am4charts.XYChart);
  chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
  chart.data = chartData; // Add data
  setChartStyle(chart); // Add style

  // Create chart instance for extension
  var chartByExtension = window.am4core.create(
    "chartdivExt",
    window.am4charts.XYChart
  );
  chartByExtension.hiddenState.properties.opacity = 0; // this creates initial fade-in
  chartByExtension.data = chartByExtensionData; // Add data
  setChartStyle(chartByExtension); // Add style
}); // end window.am4core.ready()

function setChartStyle(chart) {
  // Create axes
  var categoryAxis = chart.xAxes.push(new window.am4charts.CategoryAxis());
  categoryAxis.dataFields.category = "category";
  categoryAxis.renderer.grid.template.disabled = true;

  var valueAxis = chart.yAxes.push(new window.am4charts.ValueAxis());
  valueAxis.title.text = "List of files in project";
  valueAxis.min = 0;
  valueAxis.renderer.baseGrid.disabled = true;
  valueAxis.renderer.grid.template.strokeOpacity = 0.07;

  // Create series
  var series = chart.series.push(new window.am4charts.ColumnSeries());
  series.dataFields.valueY = "units";
  series.dataFields.categoryX = "category";
  series.tooltip.pointerOrientation = "vertical";

  var columnTemplate = series.columns.template;
  // add tooltip on column, not template, so that slices could also have tooltip
  columnTemplate.column.tooltipText =
    "Series: {name}\nCategory: {categoryX}\nValue: {valueY}";
  columnTemplate.column.tooltipY = 0;
  columnTemplate.column.cornerRadiusTopLeft = 20;
  columnTemplate.column.cornerRadiusTopRight = 20;
  columnTemplate.strokeOpacity = 0;

  // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
  columnTemplate.adapter.add("fill", function(fill, target) {
    var color = chart.colors.getIndex(target.dataItem.index * 3);
    return color;
  });

  // create pie chart as a column child
  var pieChart = series.columns.template.createChild(window.am4charts.PieChart);
  pieChart.width = window.am4core.percent(80);
  pieChart.height = window.am4core.percent(80);
  pieChart.align = "center";
  pieChart.valign = "middle";
  pieChart.dataFields.data = "pie";

  var pieSeries = pieChart.series.push(new window.am4charts.PieSeries());
  pieSeries.dataFields.value = "value";
  pieSeries.dataFields.category = "title";
  pieSeries.labels.template.disabled = true;
  pieSeries.ticks.template.disabled = true;
  pieSeries.slices.template.stroke = window.am4core.color("#ffffff");
  pieSeries.slices.template.strokeWidth = 1;
  pieSeries.slices.template.strokeOpacity = 0;

  pieSeries.slices.template.adapter.add("fill", function() {
    return window.am4core.color("#ffffff");
  });

  pieSeries.slices.template.adapter.add("fillOpacity", function(
    fillOpacity,
    target
  ) {
    return (target.dataItem.index + 1) * 0.2;
  });

  pieSeries.hiddenState.properties.startAngle = -90;
  pieSeries.hiddenState.properties.endAngle = 270;
}
