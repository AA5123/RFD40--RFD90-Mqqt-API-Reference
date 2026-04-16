## Overview

The `get_status` command retrieves the current status of a Zebra handheld RFID reader. The response includes power source information, radio activity and connection state, device temperature, system time, Network Time Protocol (NTP) synchronization details, terminal connection status, and battery health metrics.

Use this command to monitor device health, verify connectivity before starting operations, and collect telemetry data for fleet management dashboards. The command requires no configuration parameters beyond the standard envelope fields.

> **Note:** The `deviceStatus` object in the response is optional. When the device cannot retrieve status information (response code `3`), the response omits this object.

### Command Details

| Property | Value |
|---|---|
| Pattern Name | Device Status Retrieval |
| Communication Type | Bidirectional (Cloud to Device, Device to Cloud) |
| Applies To | RFD40 Series, RFD90 Series |

### Response Fields

| Field | What it tells you |
|---|---|
| `powerSource` | How the scanner is powered — DC, Wall Charger, USB, or Cradle |
| `radioActivity` | Whether the RFID radio is currently active or idle |
| `radioConnection` | Whether the radio module is connected or disconnected |
| `hostname` | The scanner's network hostname |
| `systemTime` | Current device clock in ISO 8601 format |
| `temperature` | Internal temperature in °C — monitor for overheating |
| `ntp` | Clock sync status — offset (ms drift) and reach (sync success history) |
| `terminalConnection` | Paired phone/tablet — connection status and type (Bluetooth, USB, CIO) |
| `batteryStatus` | Battery capacity (mAh), charge %, health (Good/Average/Poor), charge state |

### Related Commands

| Command | Relationship |
|---|---|
| `get_version` | Retrieve device identity — model, serial number, SKU, firmware versions |
| `get_current_region` | Inspect regulatory radio configuration — region, channels, power limits |
| `get_config` | Retrieve the full device configuration including status, version, and region in one call |

