Query the scanner's current state without changing any settings. These three read-only commands cover health monitoring, device identification, and regulatory configuration.

| Command | What It Returns |
|---|---|
| `get_status` | Real-time health — battery level, temperature, radio activity, power source, NTP clock sync, and terminal connection |
| `get_version` | Device identity — model, serial number, SKU, and all firmware versions (main, scanner, radio, IoTC) |
| `get_current_region` | Radio regulation — country code, frequency channels, power limits, frequency hopping, and LBT settings |
Use these commands for monitoring dashboards, firmware audits, and compliance checks.