// PBIR visual factories. Every factory returns a complete visual.json object.
export const VISUAL_SCHEMA =
  "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/2.9.0/schema.json";

const MEASURES = "_Measures";
const INK = "#1F1B16";
const MUTED = "#6B6257";
const RULE = "#E7E1D8";
const CARD = "#FFFFFF";

export const lit = (value) => ({ expr: { Literal: { Value: value } } });
export const litStr = (value) =>
  lit(`'${String(value).replace(/'/g, "''")}'`);
export const litNum = (value) => lit(`${value}D`);
export const litInt = (value) => lit(`${value}L`);
export const litBool = (value) => lit(value ? "true" : "false");
export const color = (hex) => ({
  solid: { color: { expr: { Literal: { Value: `'${hex}'` } } } },
});

export const col = (table, name) => ({ kind: "column", table, name });
export const meas = (name) => ({ kind: "measure", name });

const columnField = (table, name) => ({
  Column: {
    Expression: { SourceRef: { Entity: table } },
    Property: name,
  },
});

const measureField = (name) => ({
  Measure: {
    Expression: { SourceRef: { Entity: MEASURES } },
    Property: name,
  },
});

export const fieldOf = (spec) =>
  spec.kind === "measure"
    ? measureField(spec.name)
    : columnField(spec.table, spec.name);

const queryRefOf = (spec) =>
  spec.kind === "measure" ? `${MEASURES}.${spec.name}` : `${spec.table}.${spec.name}`;

export function projection(spec, active = false) {
  const out = {
    field: fieldOf(spec),
    queryRef: queryRefOf(spec),
    nativeQueryRef: spec.name,
  };
  if (active) out.active = true;
  return out;
}

function queryState(roles, { activeCategory = false } = {}) {
  const state = {};
  for (const [role, specs] of Object.entries(roles)) {
    state[role] = {
      projections: specs.map((spec, i) =>
        projection(spec, activeCategory && role === "Category" && i === 0),
      ),
    };
  }
  return { queryState: state };
}

function sortDefinition(spec, direction = "Descending") {
  return {
    sort: [{ field: fieldOf(spec), direction }],
    isDefaultSort: false,
  };
}

function container({
  title,
  subtitle,
  alt,
  padding = 10,
  background = true,
} = {}) {
  const vco = {
    title: [
      {
        properties: {
          show: litBool(Boolean(title)),
          ...(title ? { text: litStr(title) } : {}),
          fontSize: litNum(11),
          fontColor: color(MUTED),
          alignment: litStr("left"),
        },
      },
    ],
    subTitle: [
      {
        properties: {
          show: litBool(Boolean(subtitle)),
          ...(subtitle ? { text: litStr(subtitle) } : {}),
        },
      },
    ],
    background: [
      {
        properties: background
          ? {
              show: litBool(true),
              color: color(CARD),
              transparency: litNum(0),
            }
          : { show: litBool(false) },
      },
    ],
    border: [{ properties: { show: litBool(false) } }],
    visualHeader: [{ properties: { show: litBool(false) } }],
    padding: [
      {
        properties: {
          top: litNum(padding),
          bottom: litNum(padding),
          left: litNum(padding),
          right: litNum(padding),
        },
      },
    ],
  };
  if (alt) vco.general = [{ properties: { altText: litStr(alt) } }];
  return vco;
}

function position(rect, z = 1000, tabOrder = 1000) {
  return {
    x: rect.x,
    y: rect.y,
    z,
    height: rect.height,
    width: rect.width,
    tabOrder,
  };
}

function visual(id, rect, visualType, body) {
  return {
    $schema: VISUAL_SCHEMA,
    name: id,
    position: position(rect),
    visual: { visualType, ...body },
  };
}

function axis(name, extra = {}) {
  return {
    [name]: [
      {
        properties: {
          show: litBool(true),
          fontSize: litNum(9),
          labelColor: color(MUTED),
          ...extra,
        },
      },
    ],
  };
}

const categoryAxis = (extra = {}) => axis("categoryAxis", extra);
const hiddenValueAxis = () => axis("valueAxis", { show: litBool(false) });
const visibleValueAxis = (extra = {}) =>
  axis("valueAxis", {
    gridlineShow: litBool(true),
    gridlineStyle: litStr("dotted"),
    gridlineColor: color(RULE),
    gridlineThickness: litNum(1),
    ...extra,
  });

function dataLabels({
  show = true,
  fontSize = 9,
  colorHex = INK,
  position = null,
  units = null,
  precision = null,
} = {}) {
  return {
    labels: [
      {
        properties: {
          show: litBool(show),
          fontSize: litNum(fontSize),
          color: color(colorHex),
          ...(position ? { labelPosition: litStr(position) } : {}),
          ...(units !== null ? { labelDisplayUnits: litNum(units) } : {}),
          ...(precision !== null ? { labelPrecision: litInt(precision) } : {}),
        },
      },
    ],
  };
}

function legend(show = false, position = "Bottom") {
  return {
    legend: [
      {
        properties: {
          show: litBool(show),
          position: litStr(position),
          fontSize: litNum(8),
          labelColor: color(MUTED),
        },
      },
    ],
  };
}

const singleColor = (hex) => ({
  dataPoint: [
    {
      properties: { fill: color(hex) },
      selector: { id: "default" },
    },
  ],
});

export function textbox({
  id,
  rect,
  title,
  subtitle,
  titleSize = 32,
  subtitleSize = 12,
  blocks = null,
  card = false,
  alt = null,
}) {
  let paragraphs;
  if (blocks) {
    paragraphs = blocks.map((block) => ({
      textRuns: [
        {
          value: block.text,
          textStyle: {
            fontFamily: block.fontFamily ?? "Segoe UI",
            fontSize: `${block.size ?? 12}px`,
            color: block.color ?? INK,
            ...(block.bold ? { fontWeight: "bold" } : {}),
            ...(block.italic ? { fontStyle: "italic" } : {}),
          },
        },
      ],
      horizontalTextAlignment: "left",
    }));
  } else {
    paragraphs = [
      {
        textRuns: [
          {
            value: title,
            textStyle: {
              fontFamily: "Georgia",
              fontSize: `${titleSize}px`,
              color: INK,
            },
          },
        ],
        horizontalTextAlignment: "left",
      },
    ];
    if (subtitle) {
      paragraphs.push({
        textRuns: [
          {
            value: subtitle,
            textStyle: {
              fontFamily: "Segoe UI",
              fontSize: `${subtitleSize}px`,
              color: MUTED,
            },
          },
        ],
        horizontalTextAlignment: "left",
      });
    }
  }
  return {
    $schema: VISUAL_SCHEMA,
    name: id,
    position: position(rect),
    visual: {
      visualType: "textbox",
      objects: { general: [{ properties: { paragraphs } }] },
      visualContainerObjects: {
        background: [
          {
            properties: card
              ? {
                  show: litBool(true),
                  color: color(CARD),
                  transparency: litNum(0),
                }
              : { show: litBool(false) },
          },
        ],
        border: [{ properties: { show: litBool(false) } }],
        visualHeader: [{ properties: { show: litBool(false) } }],
        ...(alt ? { general: [{ properties: { altText: litStr(alt) } }] } : {}),
        padding: [
          {
            properties: {
              top: litNum(card ? 16 : 0),
              bottom: litNum(card ? 12 : 0),
              left: litNum(card ? 16 : 0),
              right: litNum(card ? 16 : 0),
            },
          },
        ],
      },
    },
  };
}

export function card({
  id,
  rect,
  measure,
  label,
  valueColor = INK,
  valueSize = 28,
  accent = null,
  displayUnits = null,
  precision = null,
  alt,
}) {
  const objects = {
    value: [
      {
        properties: {
          fontSize: litNum(valueSize),
          fontColor: color(valueColor),
          ...(displayUnits !== null
            ? { labelDisplayUnits: litNum(displayUnits) }
            : {}),
          ...(precision !== null
            ? { labelPrecision: litInt(precision) }
            : {}),
        },
        selector: { id: "default" },
      },
    ],
    label: [
      {
        properties: {
          show: litBool(true),
          text: litStr(label ?? measure),
          position: litStr("belowValue"),
          fontSize: litNum(9),
          fontColor: color(MUTED),
        },
        selector: { id: "default" },
      },
    ],
    padding: [
      {
        properties: { paddingUniform: litNum(8) },
        selector: { id: "default" },
      },
    ],
    layout: [
      {
        properties: { paddingUniform: litNum(0) },
        selector: { id: "default" },
      },
    ],
  };
  if (accent) {
    objects.accentBar = [
      {
        properties: {
          show: litBool(true),
          position: litStr("Top"),
          color: color(accent),
          width: litNum(3),
        },
        selector: { id: "default" },
      },
    ];
  }
  return visual(id, rect, "cardVisual", {
    query: queryState({ Data: [meas(measure)] }),
    objects,
    visualContainerObjects: container({ alt, padding: 10 }),
  });
}

function categoricalSelection(table, column, value) {
  const literal = { Literal: { Value: `'${String(value).replace(/'/g, "''")}'` } };
  return {
    Version: 2,
    From: [{ Name: "d", Entity: table, Type: 0 }],
    Where: [
      {
        Condition: {
          In: {
            Expressions: [
              {
                Column: {
                  Expression: { SourceRef: { Source: "d" } },
                  Property: column,
                },
              },
            ],
            Values: [[literal]],
          },
        },
        Annotations: {
          filterExpressionMetadata: {
            expressions: [
              {
                Column: {
                  Expression: { SourceRef: { Entity: table } },
                  Property: column,
                },
              },
            ],
            decomposedIdentities: {
              values: [[{ 0: [literal] }]],
              columns: [
                {
                  value: {
                    Column: {
                      Expression: { SourceRef: { Entity: table } },
                      Property: column,
                    },
                  },
                },
              ],
            },
            valueMap: [{ 0: value }],
          },
        },
      },
    ],
  };
}

export function slicer({
  id,
  rect,
  table,
  column,
  header,
  mode = "Dropdown",
  selection = null,
  alt,
}) {
  const objects = {
    data: [
      {
        properties: { mode: litStr(mode) },
      },
    ],
    header: [
      {
        properties: {
          show: litBool(true),
          text: litStr(header ?? column),
          textSize: litNum(9),
          fontColor: color(MUTED),
        },
      },
    ],
  };
  if (selection) {
    objects.general = [
      {
        properties: {
          orientation: litNum(0),
          filter: { filter: categoricalSelection(table, column, selection) },
        },
      },
    ];
  }
  return visual(id, rect, "slicer", {
    query: queryState({ Values: [col(table, column)] }),
    objects,
    visualContainerObjects: {
      ...container({ alt, padding: 8 }),
      background: [
        {
          properties: {
            show: litBool(true),
            color: color(CARD),
            transparency: litNum(0),
          },
        },
      ],
    },
  });
}

export function button({
  id,
  rect,
  label,
  action,
  target = null,
  icon = null,
  primary = false,
  align = "center",
  alt,
}) {
  const textColor = primary ? "#FFFFFF" : INK;
  const visualLink = {
    show: litBool(true),
    type: litStr(action),
    tooltip: litStr(alt ?? label),
  };
  if (target) visualLink.navigationSection = litStr(target);

  return {
    $schema: VISUAL_SCHEMA,
    name: id,
    position: position(rect),
    visual: {
      visualType: "actionButton",
      objects: {
        text: [
          { properties: { show: litBool(true) } },
          {
            properties: {
              text: litStr(label),
              fontSize: litNum(10),
              fontColor: color(textColor),
              horizontalAlignment: litStr(align),
            },
            selector: { id: "default" },
          },
        ],
        icon: [
          { properties: { show: litBool(Boolean(icon)) } },
          {
            properties: {
              shapeType: litStr(icon ?? "rightArrow"),
              placement: litStr(icon === "leftArrow" ? "left" : "right"),
              lineColor: color(primary ? "#FFFFFF" : "#B45309"),
            },
            selector: { id: "default" },
          },
        ],
        fill: [
          { properties: { show: litBool(primary) } },
          {
            properties: { fillColor: color(primary ? "#B45309" : CARD) },
            selector: { id: "default" },
          },
        ],
        outline: [
          {
            properties: {
              show: litBool(!primary),
              lineColor: color(RULE),
              weight: litNum(1),
            },
          },
        ],
        shape: [
          {
            properties: {
              tileShape: litStr("rectangleRounded"),
              roundEdge: litInt(6),
            },
          },
          {
            properties: { tileShape: litStr("rectangleRounded") },
            selector: { id: "default" },
          },
        ],
      },
      visualContainerObjects: {
        background: [{ properties: { show: litBool(false) } }],
        border: [{ properties: { show: litBool(false) } }],
        visualHeader: [{ properties: { show: litBool(false) } }],
        ...(alt ? { general: [{ properties: { altText: litStr(alt) } }] } : {}),
        visualLink: [{ properties: visualLink }],
      },
      drillFilterOtherVisuals: true,
    },
    howCreated: "InsertVisualButton",
  };
}

function topNFilter({
  id,
  entityTable,
  entityColumn,
  aggregateTable,
  aggregateColumn,
  aggregateFunction = 0,
  n,
}) {
  const selectedColumn = {
    Column: {
      Expression: { SourceRef: { Source: "cat" } },
      Property: entityColumn,
    },
  };
  const aggregate = {
    Aggregation: {
      Expression: {
        Column: {
          Expression: { SourceRef: { Source: "agg" } },
          Property: aggregateColumn,
        },
      },
      Function: aggregateFunction,
    },
  };
  return {
    name: `Filter_${id}`,
    field: columnField(entityTable, entityColumn),
    type: "TopN",
    filter: {
      Version: 2,
      From: [
        {
          Name: "subquery",
          Expression: {
            Subquery: {
              Query: {
                Version: 2,
                From: [
                  { Name: "agg", Entity: aggregateTable, Type: 0 },
                  { Name: "cat", Entity: entityTable, Type: 0 },
                ],
                Select: [{ ...selectedColumn, Name: "field" }],
                OrderBy: [{ Direction: 2, Expression: aggregate }],
                Top: n,
              },
            },
          },
          Type: 2,
        },
        { Name: "p", Entity: entityTable, Type: 0 },
      ],
      Where: [
        {
          Condition: {
            In: {
              Expressions: [
                {
                  Column: {
                    Expression: { SourceRef: { Source: "p" } },
                    Property: entityColumn,
                  },
                },
              ],
              Table: { SourceRef: { Source: "subquery" } },
            },
          },
        },
      ],
    },
    howCreated: "User",
  };
}

function chartBase({
  id,
  rect,
  type,
  roles,
  objects,
  title,
  subtitle,
  alt,
  sort = null,
  topN = null,
  padding = 12,
  activeCategory = true,
}) {
  const visualBody = {
    query: {
      ...queryState(roles, { activeCategory }),
      ...(sort ? { sortDefinition: sort } : {}),
    },
    objects,
    visualContainerObjects: container({ title, subtitle, alt, padding }),
  };
  const out = visual(id, rect, type, visualBody);
  if (topN) {
    out.filterConfig = { filters: [topNFilter({ id, ...topN })] };
  }
  return out;
}

function resolveSort(sort, category, measure, categorySpec = null) {
  if (!sort) return null;
  if (typeof sort === "object") return sort;
  if (sort === "value_desc") return sortDefinition(meas(measure), "Descending");
  if (sort === "value_asc") return sortDefinition(meas(measure), "Ascending");
  if (sort === "category_asc")
    return sortDefinition(categorySpec ?? category, "Ascending");
  if (sort === "category_desc")
    return sortDefinition(categorySpec ?? category, "Descending");
  return null;
}

export function barChart({
  id,
  rect,
  category,
  measure,
  title,
  subtitle,
  color = "#B45309",
  topN = null,
  sort = "value_desc",
  sortField = null,
  labelUnits = null,
  labelPrecision = null,
  alt,
}) {
  const objects = {
    ...categoryAxis({ gridlineShow: litBool(false) }),
    ...hiddenValueAxis(),
    ...dataLabels({
      position: "OutsideEnd",
      units: labelUnits,
      precision: labelPrecision,
    }),
    ...legend(false),
    ...singleColor(color),
  };
  return chartBase({
    id,
    rect,
    type: "barChart",
    roles: { Category: [category], Y: [meas(measure)] },
    objects,
    title,
    subtitle,
    alt,
    sort: resolveSort(sort, category, measure, sortField),
    topN,
  });
}

export function columnChart({
  id,
  rect,
  category,
  measure,
  title,
  subtitle,
  color = "#0E7490",
  sort = "natural",
  sortField = null,
  labelUnits = null,
  labelPrecision = null,
  alt,
}) {
  const objects = {
    ...categoryAxis({ gridlineShow: litBool(false) }),
    ...visibleValueAxis(),
    ...dataLabels({
      position: "OutsideEnd",
      units: labelUnits,
      precision: labelPrecision,
    }),
    ...legend(false),
    ...singleColor(color),
  };
  return chartBase({
    id,
    rect,
    type: "columnChart",
    roles: { Category: [category], Y: [meas(measure)] },
    objects,
    title,
    subtitle,
    alt,
    sort: resolveSort(sort, category, measure, sortField),
  });
}

export function lineChart({
  id,
  rect,
  category,
  measures = [],
  series = null,
  title,
  subtitle,
  seriesColors = [],
  legendOn = measures.length > 1 || Boolean(series),
  sortField = null,
  markers = true,
  categoryWidth = null,
  categoryFontSize = 8,
  alt,
}) {
  const lineStyles = [
    {
      properties: {
        showMarker: litBool(markers),
        markerShape: litStr("circle"),
        markerSize: litNum(4),
        strokeWidth: litNum(2),
      },
    },
    ...seriesColors.map(({ measure, color: hex, dashed = false }) => ({
      properties: {
        strokeColor: color(hex),
        markerColor: color(hex),
        ...(dashed ? { lineStyle: litStr("dashed") } : {}),
      },
      selector: { metadata: `${MEASURES}.${measure}` },
    })),
  ];
  const objects = {
    ...categoryAxis({
      fontSize: litNum(categoryFontSize),
      ...(categoryWidth
        ? { preferredCategoryWidth: litNum(categoryWidth) }
        : {}),
    }),
    ...visibleValueAxis(),
    ...dataLabels({ show: false }),
    ...legend(legendOn, "Bottom"),
    lineStyles,
  };
  const roles = series
    ? { Category: [category], Series: [series], Y: measures.map(meas) }
    : { Category: [category], Y: measures.map(meas) };
  return chartBase({
    id,
    rect,
    type: "lineChart",
    roles,
    objects,
    title,
    subtitle,
    alt,
    sort: sortDefinition(sortField ?? category, "Ascending"),
  });
}

export function comboChart({
  id,
  rect,
  category,
  columns,
  lines,
  title,
  subtitle,
  columnColor = "#B45309",
  lineColor = "#0F766E",
  sortField = null,
  categoryWidth = null,
  categoryFontSize = 8,
  alt,
}) {
  const objects = {
    ...categoryAxis({
      fontSize: litNum(categoryFontSize),
      ...(categoryWidth
        ? { preferredCategoryWidth: litNum(categoryWidth) }
        : {}),
    }),
    ...visibleValueAxis(),
    ...dataLabels({ show: false }),
    ...legend(true, "Bottom"),
    dataPoint: [
      ...columns.map((m) => ({
        properties: { fill: color(columnColor) },
        selector: { metadata: `${MEASURES}.${m}` },
      })),
      ...lines.map((m) => ({
        properties: { fill: color(lineColor) },
        selector: { metadata: `${MEASURES}.${m}` },
      })),
    ],
    lineStyles: [
      {
        properties: {
          showMarker: litBool(true),
          markerShape: litStr("circle"),
          markerSize: litNum(4),
          strokeWidth: litNum(2),
        },
      },
      ...lines.map((m) => ({
        properties: {
          markerColor: color(lineColor),
        },
        selector: { metadata: `${MEASURES}.${m}` },
      })),
    ],
  };
  return chartBase({
    id,
    rect,
    type: "lineClusteredColumnComboChart",
    roles: {
      Category: [category],
      Y: columns.map(meas),
      Y2: lines.map(meas),
    },
    objects,
    title,
    subtitle,
    alt,
    sort: sortDefinition(sortField ?? category, "Ascending"),
  });
}

export function donutChart({
  id,
  rect,
  category,
  measure,
  title,
  subtitle,
  alt,
}) {
  const objects = {
    ...legend(true, "Right"),
    value: [{ properties: { show: litBool(false) } }],
    labels: [
      {
        properties: {
          show: litBool(true),
          fontSize: litNum(9),
          color: color(INK),
          labelStyle: litStr("Percent of total"),
          percentageLabelPrecision: litInt(1),
        },
      },
    ],
  };
  return chartBase({
    id,
    rect,
    type: "donutChart",
    roles: { Category: [category], Y: [meas(measure)] },
    objects,
    title,
    subtitle,
    alt,
    sort: sortDefinition(meas(measure), "Descending"),
    activeCategory: false,
  });
}

export function scatterChart({
  id,
  rect,
  category,
  xMeasure,
  yMeasure,
  sizeMeasure,
  title,
  subtitle,
  pointColor = "#3730A3",
  topN = null,
  alt,
}) {
  const objects = {
    categoryLabels: [
      {
        properties: {
          show: litBool(true),
          fontSize: litNum(8),
          color: color(INK),
        },
      },
    ],
    ...legend(false),
    ...singleColor(pointColor),
  };
  return chartBase({
    id,
    rect,
    type: "scatterChart",
    roles: {
      Category: [category],
      X: [meas(xMeasure)],
      Y: [meas(yMeasure)],
      Size: [meas(sizeMeasure)],
    },
    objects,
    title,
    subtitle,
    alt,
    topN,
  });
}

export function table({
  id,
  rect,
  fields,
  title,
  subtitle,
  sortBy = null,
  sortDirection = "Descending",
  alt,
}) {
  const objects = {
    columnHeaders: [
      {
        properties: {
          columnAdjustment: litStr("growToFit"),
          autoSizeColumnWidth: litBool(true),
          fontColor: color(MUTED),
          fontSize: litNum(9),
          alignment: litStr("Left"),
        },
      },
    ],
    grid: [
      {
        properties: {
          gridVertical: litBool(false),
          gridHorizontal: litBool(true),
          gridHorizontalColor: color(RULE),
          rowPadding: litNum(4),
        },
      },
    ],
    values: [
      {
        properties: {
          fontSize: litNum(9),
          fontColorPrimary: color(INK),
          fontColorSecondary: color(INK),
          backColorPrimary: color(CARD),
          backColorSecondary: color("#FAF7F0"),
        },
      },
    ],
  };
  const out = chartBase({
    id,
    rect,
    type: "tableEx",
    roles: { Values: fields },
    objects,
    title,
    subtitle,
    alt,
    sort: sortBy ? sortDefinition(sortBy, sortDirection) : null,
    padding: 10,
    activeCategory: false,
  });
  out.visual.visualContainerObjects.stylePreset = [
    { properties: { name: litStr("None") } },
  ];
  return out;
}

export function map({
  id,
  rect,
  location,
  sizeMeasure,
  tooltipMeasure,
  title,
  subtitle,
  alt,
}) {
  return chartBase({
    id,
    rect,
    type: "azureMap",
    roles: {
      Category: [location],
      Size: [meas(sizeMeasure)],
      Tooltips: [meas(tooltipMeasure)],
    },
    objects: {
      bubbleLayer: [
        {
          properties: {
            show: litBool(true),
            sizeByValue: litBool(true),
            fillColor: color("#B45309"),
            strokeColor: color("#FFFFFF"),
            borderShow: litBool(true),
            bubbleStrokeWidth: litInt(1),
          },
        },
      ],
    },
    title,
    subtitle,
    alt,
    padding: 0,
    activeCategory: false,
  });
}
