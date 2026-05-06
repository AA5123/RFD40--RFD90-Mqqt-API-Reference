import React, { useState } from "react";
import { sanitizeTabsChildren } from "@docusaurus/theme-common/internal";
import useIsBrowser from "@docusaurus/useIsBrowser";
import clsx from "clsx";

function flattenTabs(items) {
  const out = [];
  for (const item of items) {
    if (Array.isArray(item)) {
      out.push(...flattenTabs(item));
    } else if (item) {
      out.push(item);
    }
  }
  return out;
}

function getTabValues(children) {
  return children
    .map((child) => ({
      value: child?.props?.value,
      label: child?.props?.label,
      attributes: child?.props?.attributes,
      isDefault: child?.props?.default,
    }))
    .filter((tab) => tab.value !== undefined);
}

function TabsComponent(props) {
  const rawChildren = sanitizeTabsChildren(props.children);
  const childTabs = flattenTabs(Array.isArray(rawChildren) ? rawChildren : [rawChildren]);
  const tabValues = getTabValues(childTabs);
  const defaultTab = tabValues.find((tab) => tab.isDefault) ?? tabValues[0];
  const initialValue = props.defaultValue ?? defaultTab?.value;
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const selected = childTabs.find((tab) => tab?.props?.value === selectedValue);

  return (
    <div className="openapi-tabs__schema-container">
      <div className="openapi-tabs__schema-tabs-container">
        <ul
          role="tablist"
          aria-orientation="horizontal"
          className={clsx(
            "openapi-tabs__schema-list-container",
            "tabs",
            { "tabs--block": props.block },
            props.className
          )}
        >
          {tabValues.map(({ value, label, attributes }) => (
            <li
              key={value}
              role="tab"
              tabIndex={selectedValue === value ? 0 : -1}
              aria-selected={selectedValue === value}
              onClick={() => setSelectedValue(value)}
              {...attributes}
              className={clsx(
                "tabs__item",
                "openapi-tabs__schema-item",
                attributes?.className,
                { active: selectedValue === value }
              )}
            >
              <span className="openapi-tabs__schema-label">{label ?? value}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="margin-top--md">{selected?.props?.children ?? null}</div>
    </div>
  );
}

export default function SchemaTabs(props) {
  const isBrowser = useIsBrowser();
  return <TabsComponent key={String(isBrowser)} {...props} />;
}
