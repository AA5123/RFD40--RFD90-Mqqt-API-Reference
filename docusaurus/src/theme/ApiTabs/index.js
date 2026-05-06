import React, { cloneElement, useEffect, useRef, useState } from "react";
import {
  sanitizeTabsChildren,
  useScrollPositionBlocker,
} from "@docusaurus/theme-common/internal";
import useIsBrowser from "@docusaurus/useIsBrowser";
import Heading from "@theme/Heading";
import clsx from "clsx";

function TabList({
  className,
  block,
  selectedValue,
  selectValue,
  tabValues,
  label = "Responses",
  id = "responses",
}) {
  const tabRefs = [];
  const { blockElementScrollPositionUntilNextRender } =
    useScrollPositionBlocker();

  const handleTabChange = (event) => {
    const newTab = event.currentTarget;
    const newTabIndex = tabRefs.indexOf(newTab);
    const newTabValue = tabValues[newTabIndex].value;

    if (newTabValue !== selectedValue) {
      blockElementScrollPositionUntilNextRender(newTab);
      selectValue(newTabValue);
    }
  };

  const handleKeydown = (event) => {
    let focusElement = null;

    switch (event.key) {
      case "Enter": {
        handleTabChange(event);
        break;
      }
      case "ArrowRight": {
        const nextTab = tabRefs.indexOf(event.currentTarget) + 1;
        focusElement = tabRefs[nextTab] ?? tabRefs[0];
        break;
      }
      case "ArrowLeft": {
        const prevTab = tabRefs.indexOf(event.currentTarget) - 1;
        focusElement = tabRefs[prevTab] ?? tabRefs[tabRefs.length - 1];
        break;
      }
      default:
        break;
    }

    focusElement?.focus();
  };

  const tabItemListContainerRef = useRef(null);
  const [showTabArrows, setShowTabArrows] = useState(false);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        requestAnimationFrame(() => {
          if (entry.target.clientWidth < entry.target.scrollWidth) {
            setShowTabArrows(true);
          } else {
            setShowTabArrows(false);
          }
        });
      }
    });

    if (tabItemListContainerRef.current) {
      resizeObserver.observe(tabItemListContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleRightClick = () => {
    if (tabItemListContainerRef.current) {
      tabItemListContainerRef.current.scrollLeft += 90;
    }
  };

  const handleLeftClick = () => {
    if (tabItemListContainerRef.current) {
      tabItemListContainerRef.current.scrollLeft -= 90;
    }
  };

  return (
    <div className="openapi-tabs__response-header-section">
      <Heading
        as="h2"
        id={id}
        className="openapi-tabs__heading openapi-tabs__response-header"
      >
        {label}
      </Heading>
      <div className="openapi-tabs__response-container">
        {showTabArrows && (
          <button className="openapi-tabs__arrow left" onClick={handleLeftClick} />
        )}

        <ul
          ref={tabItemListContainerRef}
          role="tablist"
          aria-orientation="horizontal"
          className={clsx("openapi-tabs__response-list-container", "tabs", {
            "tabs--block": block,
          }, className)}
        >
          {tabValues.map(({ value, label: itemLabel, attributes }) => (
            <li
              role="tab"
              tabIndex={selectedValue === value ? 0 : -1}
              aria-selected={selectedValue === value}
              key={value}
              ref={(tabControl) => {
                tabRefs.push(tabControl);
              }}
              onKeyDown={handleKeydown}
              onClick={handleTabChange}
              {...attributes}
              className={clsx(
                "tabs__item",
                "openapi-tabs__response-code-item",
                attributes?.className,
                parseInt(value, 10) >= 400
                  ? "danger"
                  : parseInt(value, 10) >= 200 && parseInt(value, 10) < 300
                    ? "success"
                    : "info",
                {
                  active: selectedValue === value,
                }
              )}
            >
              {itemLabel ?? value}
            </li>
          ))}
        </ul>

        {showTabArrows && (
          <button className="openapi-tabs__arrow right" onClick={handleRightClick} />
        )}
      </div>
    </div>
  );
}

function TabContent({ lazy, children, selectedValue }) {
  const childTabs = (Array.isArray(children) ? children : [children]).filter(Boolean);

  // Docusaurus TabItem now expects TabsContext from <Tabs>. ApiTabs is custom,
  // so render TabItem children directly instead of mounting TabItem itself.
  if (lazy) {
    const selectedTabItem = childTabs.find(
      (tabItem) => tabItem?.props?.value === selectedValue
    );

    if (!selectedTabItem) {
      return null;
    }

    return <div className="margin-top--md">{selectedTabItem.props?.children}</div>;
  }

  return (
    <div className="margin-top--md">
      {childTabs.map((tabItem, index) => (
        <div key={index} hidden={tabItem?.props?.value !== selectedValue}>
          {tabItem?.props?.children}
        </div>
      ))}
    </div>
  );
}

function TabsComponent(props) {
  const childTabs = (Array.isArray(props.children) ? props.children : [props.children])
    .filter(Boolean);

  const tabValues = childTabs.map((tabItem) => ({
    value: tabItem?.props?.value,
    label: tabItem?.props?.label,
    attributes: tabItem?.props?.attributes,
  })).filter((tab) => tab.value !== undefined);

  const initialValue =
    props.defaultValue ??
    tabValues[0]?.value;

  const [selectedValue, setSelectedValue] = useState(initialValue);

  const tabs = {
    selectedValue,
    selectValue: setSelectedValue,
    tabValues,
  };

  return (
    <div className="openapi-tabs__container">
      <TabList {...props} {...tabs} />
      <TabContent {...props} {...tabs} />
    </div>
  );
}

export default function ApiTabs(props) {
  const isBrowser = useIsBrowser();

  return (
    <TabsComponent key={String(isBrowser)} {...props}>
      {sanitizeTabsChildren(props.children)}
    </TabsComponent>
  );
}
