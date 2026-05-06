import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "category",
      label: "Management",
      collapsible: true,
      collapsed: true,
      items: [
        {
          type: "doc",
          id: "api/gen-2-x-api-reference",
        },
        {
          type: "category",
          label: "Device Status",
          link: {
            type: "doc",
            id: "api/tag-device-status",
          },
          items: [
            {
              type: "doc",
              id: "api/get-status",
              label: "Get Status",
              className: "api-method post",
            },
            {
              type: "doc",
              id: "api/get-version",
              label: "Get Version",
              className: "api-method post",
            },
            {
              type: "doc",
              id: "api/get-current-region",
              label: "Get Current Region",
              className: "api-method post",
            },
          ],
        },
        {
          type: "category",
          label: "Device Configuration",
          link: {
            type: "doc",
            id: "api/tag-device-configuration",
          },
          items: [
            {
              type: "doc",
              id: "api/get-config",
              label: "Get Config",
              className: "api-method post",
            },
            {
              type: "doc",
              id: "api/set-config",
              label: "Set Config",
              className: "api-method post",
            },
          ],
        },
        {
          type: "category",
          label: "Network Configuration",
          link: {
            type: "doc",
            id: "api/tag-network-configuration",
          },
          items: [
            {
              type: "doc",
              id: "api/delete-wifi-profile",
              label: "Delete Wifi Profile",
              className: "api-method post",
            },
            {
              type: "doc",
              id: "api/get-eth",
              label: "Get Eth",
              className: "api-method post",
            },
            {
              type: "doc",
              id: "api/get-wifi",
              label: "Get Wifi",
              className: "api-method post",
            },
            {
              type: "doc",
              id: "api/set-wifi",
              label: "Set Wifi",
              className: "api-method post",
            },
          ],
        },
        {
          type: "category",
          label: "MQTT Endpoint Configuration",
          link: {
            type: "doc",
            id: "api/tag-mqtt-endpoint-configuration",
          },
          items: [
            {
              type: "doc",
              id: "api/config-endpoint",
              label: "Config Endpoint",
              className: "api-method post",
            },
            {
              type: "doc",
              id: "api/get-endpoint-config",
              label: "Get Endpoint Config",
              className: "api-method post",
            },
          ],
        },
        {
          type: "category",
          label: "Certificate Management",
          link: {
            type: "doc",
            id: "api/tag-certificate-management",
          },
          items: [
            {
              type: "doc",
              id: "api/delete-certificate",
              label: "Delete Certificate",
              className: "api-method post",
            },
            {
              type: "doc",
              id: "api/get-installed-certificate",
              label: "Get Installed Certificate",
              className: "api-method post",
            },
            {
              type: "doc",
              id: "api/install-certificate",
              label: "Install Certificate",
              className: "api-method post",
            },
          ],
        },
        {
          type: "category",
          label: "System Operations",
          link: {
            type: "doc",
            id: "api/tag-system-operations",
          },
          items: [
            {
              type: "doc",
              id: "api/reboot",
              label: "Reboot",
              className: "api-method post",
            },
            {
              type: "doc",
              id: "api/set-os",
              label: "Set Os",
              className: "api-method post",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Control",
      collapsible: true,
      collapsed: true,
      items: [
        {
          type: "doc",
          id: "api/gen-2-x-api-reference",
        },
        {
          type: "category",
          label: "Inventory Control",
          link: {
            type: "doc",
            id: "api/tag-inventory-control",
          },
          items: [
            {
              type: "doc",
              id: "api/control-operation",
              label: "Control Operation",
              className: "api-method post",
            },
          ],
        },
        {
          type: "category",
          label: "Operating Mode",
          link: {
            type: "doc",
            id: "api/tag-operating-mode",
          },
          items: [
            {
              type: "doc",
              id: "api/get-operating-mode",
              label: "Get Operating Mode",
              className: "api-method post",
            },
            {
              type: "doc",
              id: "api/set-operating-mode",
              label: "Set Operating Mode",
              className: "api-method post",
            },
          ],
        },
        {
          type: "category",
          label: "Tag Filtering",
          link: {
            type: "doc",
            id: "api/tag-tag-filtering",
          },
          items: [
            {
              type: "doc",
              id: "api/get-post-filter",
              label: "Get Post Filter",
              className: "api-method post",
            },
            {
              type: "doc",
              id: "api/set-post-filter",
              label: "Set Post Filter",
              className: "api-method post",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Events",
      collapsible: true,
      collapsed: true,
      items: [
        {
          type: "doc",
          id: "api/gen-2-x-api-reference",
        },
        {
          type: "category",
          label: "Device Health",
          link: {
            type: "doc",
            id: "api/tag-device-health",
          },
          items: [
            {
              type: "doc",
              id: "api/heartbeatevt",
              label: "Heartbeatevt",
              className: "api-method post",
            },
          ],
        },
        {
          type: "category",
          label: "Alerts",
          link: {
            type: "doc",
            id: "api/tag-alerts",
          },
          items: [
            {
              type: "doc",
              id: "api/alert-short",
              label: "Alert Short",
              className: "api-method post",
            },
            {
              type: "doc",
              id: "api/alerts",
              label: "Alerts",
              className: "api-method post",
            },
          ],
        },
        {
          type: "category",
          label: "Exceptions",
          link: {
            type: "doc",
            id: "api/tag-exceptions",
          },
          items: [
            {
              type: "doc",
              id: "api/exceptionevt",
              label: "Exceptionevt",
              className: "api-method post",
            },
          ],
        },
        {
          type: "category",
          label: "MQTT Connectivity",
          link: {
            type: "doc",
            id: "api/tag-mqtt-connectivity",
          },
          items: [
            {
              type: "doc",
              id: "api/mqttconnevt",
              label: "Mqttconnevt",
              className: "api-method post",
            },
          ],
        },
        {
          type: "category",
          label: "Event Configuration",
          link: {
            type: "doc",
            id: "api/tag-event-configuration",
          },
          items: [
            {
              type: "doc",
              id: "api/config-events",
              label: "Config Events",
              className: "api-method post",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Data",
      collapsible: true,
      collapsed: true,
      items: [
        {
          type: "doc",
          id: "api/gen-2-x-api-reference",
        },
        {
          type: "category",
          label: "Tag Data Event",
          link: {
            type: "doc",
            id: "api/tag-tag-data-event",
          },
          items: [
            {
              type: "doc",
              id: "api/dataevt",
              label: "Dataevt",
              className: "api-method post",
            },
          ],
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
