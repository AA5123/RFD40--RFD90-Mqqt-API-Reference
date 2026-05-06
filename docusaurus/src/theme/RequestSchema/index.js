import React, { useMemo, useState } from "react";
import CodeBlock from "@theme/CodeBlock";

function toPrettyJson(value) {
  if (value === undefined || value === null) {
    return "{}";
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch (_e) {
    return "{}";
  }
}

function extractExamples(contentItem) {
  const examples = [];
  if (!contentItem) {
    return examples;
  }

  if (contentItem.examples) {
    Object.keys(contentItem.examples).forEach((name) => {
      const entry = contentItem.examples[name];
      if (entry && entry.value !== undefined) {
        examples.push({
          name,
          value: entry.value,
        });
      }
    });
  }

  if (examples.length === 0 && contentItem.example !== undefined) {
    examples.push({
      name: "example",
      value: contentItem.example,
    });
  }

  if (examples.length === 0 && contentItem.schema) {
    const built = buildExampleFromSchema(contentItem.schema);
    if (built !== undefined) {
      examples.push({
        name: "example",
        value: built,
      });
    }
  }

  return examples;
}

function buildExampleFromSchema(schema) {
  if (!schema) return undefined;
  if (schema.example !== undefined) return schema.example;
  if (schema.default !== undefined) return schema.default;
  if (Array.isArray(schema.enum) && schema.enum.length > 0) return schema.enum[0];

  if (schema.type === "object" || schema.properties) {
    const result = {};
    const props = schema.properties || {};
    Object.keys(props).forEach((key) => {
      const child = buildExampleFromSchema(props[key]);
      if (child !== undefined) result[key] = child;
    });
    return Object.keys(result).length > 0 ? result : undefined;
  }

  if (schema.type === "array" || schema.items) {
    const item = buildExampleFromSchema(schema.items || {});
    return item === undefined ? [] : [item];
  }

  switch (schema.type) {
    case "string":
      return "string";
    case "integer":
    case "number":
      return 0;
    case "boolean":
      return false;
    default:
      return undefined;
  }
}

function getSchemaType(schema) {
  if (!schema) return "object";
  if (Array.isArray(schema.enum)) return "enum (" + schema.enum.map(String).join(" | ") + ")";
  if (schema.type) return schema.type;
  if (schema.properties) return "object";
  if (schema.items) return "array";
  if (schema.oneOf) return "oneOf";
  if (schema.anyOf) return "anyOf";
  if (schema.allOf) return "allOf";
  return "object";
}

function getSchemaDescription(schema) {
  if (!schema) return "";
  const parts = [];
  if (schema.description) parts.push(schema.description);
  if (schema.format) parts.push("Format: " + String(schema.format));
  if (schema.default !== undefined) parts.push("Default: " + JSON.stringify(schema.default));
  if (schema.minimum !== undefined) parts.push("Min: " + schema.minimum);
  if (schema.maximum !== undefined) parts.push("Max: " + schema.maximum);
  if (schema.pattern) parts.push("Pattern: " + schema.pattern);
  return parts.join(" | ");
}

function createSchemaRows(rootSchema) {
  const rows = [];
  let rowCounter = 0;

  function walk(name, schema, depth, parentId, required) {
    if (!schema) return;
    const rowId = "schema-row-" + rowCounter;
    rowCounter += 1;

    const children = [];
    if (schema.properties && typeof schema.properties === "object") {
      const requiredFields = new Set(schema.required || []);
      Object.keys(schema.properties).forEach((key) => {
        children.push({
          name: key,
          schema: schema.properties[key],
          required: requiredFields.has(key),
        });
      });
    }
    if (schema.items) {
      children.push({ name: "items[]", schema: schema.items, required: false });
    }
    ["allOf", "anyOf", "oneOf"].forEach((keyword) => {
      if (Array.isArray(schema[keyword])) {
        schema[keyword].forEach((entry, index) => {
          children.push({
            name: keyword + " " + (index + 1),
            schema: entry,
            required: false,
          });
        });
      }
    });

    rows.push({
      id: rowId,
      parentId,
      name,
      type: getSchemaType(schema),
      description: getSchemaDescription(schema),
      depth,
      required,
      hasChildren: children.length > 0,
    });

    children.forEach((child) => {
      walk(child.name, child.schema, depth + 1, rowId, child.required);
    });
  }

  if (rootSchema && rootSchema.properties && Object.keys(rootSchema.properties).length > 0) {
    const requiredFields = new Set(rootSchema.required || []);
    Object.keys(rootSchema.properties).forEach((key) => {
      walk(key, rootSchema.properties[key], 0, null, requiredFields.has(key));
    });
  } else {
    walk("payload", rootSchema, 0, null, false);
  }

  return rows;
}

function SchemaTable({ schema }) {
  const rows = useMemo(() => createSchemaRows(schema), [schema]);
  const [collapsed, setCollapsed] = useState({});

  const rowMap = useMemo(() => {
    const map = {};
    rows.forEach((row) => {
      map[row.id] = row;
    });
    return map;
  }, [rows]);

  const visibleRows = useMemo(() => {
    return rows.filter((row) => {
      let parentId = row.parentId;
      while (parentId) {
        if (collapsed[parentId]) return false;
        parentId = rowMap[parentId]?.parentId;
      }
      return true;
    });
  }, [rows, collapsed, rowMap]);

  const collapseAll = () => {
    const nextState = {};
    rows.forEach((row) => {
      if (row.hasChildren) nextState[row.id] = true;
    });
    setCollapsed(nextState);
  };

  const expandAll = () => {
    setCollapsed({});
  };

  return (
    <div className="payload-schema-wrap">
      <div className="payload-schema-toolbar">
        <button type="button" className="payload-schema-btn" onClick={expandAll}>
          Expand all
        </button>
        <button type="button" className="payload-schema-btn" onClick={collapseAll}>
          Collapse all
        </button>
      </div>
      <table className="payload-schema-table">
        <thead>
          <tr>
            <th>Field</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row) => (
            <tr key={row.id}>
              <td style={{ paddingLeft: 12 + row.depth * 20 }}>
                {row.hasChildren ? (
                  <button
                    type="button"
                    className="payload-schema-toggle"
                    onClick={() => {
                      setCollapsed((prev) => ({ ...prev, [row.id]: !prev[row.id] }));
                    }}
                  >
                    {collapsed[row.id] ? "+" : "-"}
                  </button>
                ) : (
                  <span className="payload-schema-toggle-spacer" />
                )}
                <span className="payload-schema-field">{row.name}</span>
                {row.required ? <span className="payload-schema-required">*</span> : null}
              </td>
              <td>{row.type}</td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function RequestSchema({ body }) {
  if (!body || !body.content || Object.keys(body.content).length === 0) {
    return null;
  }

  const mimeType = Object.keys(body.content)[0];
  const contentItem = body.content[mimeType] || {};
  const schema = contentItem.schema || contentItem;
  const examples = extractExamples(contentItem);

  const [activeTab, setActiveTab] = useState(examples.length ? "example" : "schema");
  const [activeExample, setActiveExample] = useState(examples[0]?.name || "");
  const [exampleExpanded, setExampleExpanded] = useState(true);

  const currentExampleValue = useMemo(() => {
    if (!examples.length) {
      return null;
    }
    const matched = examples.find((item) => item.name === activeExample);
    return matched ? matched.value : examples[0].value;
  }, [examples, activeExample]);

  const exampleJson = toPrettyJson(currentExampleValue);

  return (
    <section className="payload-card payload-card--request">
      <h3 className="payload-card__title">MQTT COMMAND PAYLOAD</h3>
      <div className="payload-card__tabs" role="tablist" aria-label="Request payload tabs">
        {examples.length > 0 && (
          <button
            type="button"
            className={"payload-card__tab" + (activeTab === "example" ? " is-active" : "")}
            onClick={() => setActiveTab("example")}
          >
            Example
          </button>
        )}
        <button
          type="button"
          className={"payload-card__tab" + (activeTab === "schema" ? " is-active" : "")}
          onClick={() => setActiveTab("schema")}
        >
          Schema
        </button>
      </div>

      {activeTab === "example" && examples.length > 0 && (
        <div className="payload-card__panel">
          <div className="payload-card__toolbar">
            <button type="button" className="payload-card__tool-btn" onClick={() => setExampleExpanded(true)}>
              Expand
            </button>
            <button type="button" className="payload-card__tool-btn" onClick={() => setExampleExpanded(false)}>
              Collapse
            </button>
          </div>
          {examples.length > 1 && (
            <select
              className="payload-card__select"
              value={activeExample}
              onChange={(event) => setActiveExample(event.target.value)}
            >
              {examples.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          )}
          {exampleExpanded ? (
            <div className="payload-card__code">
              <CodeBlock language="json">{exampleJson}</CodeBlock>
            </div>
          ) : null}
        </div>
      )}

      {activeTab === "schema" && (
        <div className="payload-card__panel">
          <SchemaTable schema={schema} />
        </div>
      )}
    </section>
  );
}
