import React, { useState } from "react";
import { sanitizeTabsChildren } from "@docusaurus/theme-common/internal";
import useIsBrowser from "@docusaurus/useIsBrowser";
import clsx from "clsx";

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
  const childTabs = sanitizeTabsChildren(props.children).filter(Boolean);
  const tabValues = getTabValues(childTabs);
  const defaultTab = tabValues.find((tab) => tab.isDefault) ?? tabValues[0];
  const initialValue = props.defaultValue ?? defaultTab?.value;
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const selected = childTabs.find((tab) => tab?.props?.value === selectedValue);

  return (
    <div className={clsx("tabs-container openapi-tabs__code-container", props.className)}>
      <ul
        role="tablist"
        aria-orientation="horizontal"
        className={clsx("tabs", "openapi-tabs__code-list-container", {
          "tabs--block": props.block,
        })}
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
              "openapi-tabs__code-item",
              attributes?.className,
              { active: selectedValue === value }
            )}
          >
            <span>{label ?? value}</span>
          </li>
        ))}
      </ul>
      <div className="margin-top--md openapi-tabs__code-content">
        {selected?.props?.children ?? null}
      </div>
    </div>
  );
}

export default function CodeTabs(props) {
  const isBrowser = useIsBrowser();
  return <TabsComponent key={String(isBrowser)} {...props} />;
}
