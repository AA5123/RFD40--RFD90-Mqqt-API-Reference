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

function TabContent({ children, selectedValue }) {
  const selected = children.find((tab) => tab?.props?.value === selectedValue);
  return <div className="margin-top--md">{selected?.props?.children ?? null}</div>;
}

function TabsComponent(props) {
  const childTabs = sanitizeTabsChildren(props.children).filter(Boolean);
  const tabValues = getTabValues(childTabs);
  const defaultTab = tabValues.find((tab) => tab.isDefault) ?? tabValues[0];
  const initialValue = props.defaultValue ?? defaultTab?.value;
  const [selectedValue, setSelectedValue] = useState(initialValue);

  return (
    <div className="tabs-container">
      <div className="openapi-tabs__mime-container">
        <ul
          role="tablist"
          aria-orientation="horizontal"
          className={clsx("openapi-tabs__mime-list-container", "tabs", {
            "tabs--block": props.block,
          }, props.className)}
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
                "openapi-tabs__mime-item",
                attributes?.className,
                { active: selectedValue === value }
              )}
            >
              {label ?? value}
            </li>
          ))}
        </ul>
      </div>
      <TabContent children={childTabs} selectedValue={selectedValue} />
    </div>
  );
}

export default function MimeTabs(props) {
  const isBrowser = useIsBrowser();
  return <TabsComponent key={String(isBrowser)} {...props} />;
}
