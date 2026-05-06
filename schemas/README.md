<h1 align="center">Zebra IoT Connector API Documentation</h1>

<p align="center">
  <strong>API Reference for Zebra Handheld RFID Readers (RFD40/RFD90)</strong>
</p>

<p align="center">
  <a href="https://friendly-adventure-3jvjew4.pages.github.io/">
    <img src="https://img.shields.io/badge/📖_API_Documentation-View_Online-blue?style=for-the-badge" alt="Documentation"/>
  </a>
</p>

---

## Overview

The **Zebra IoT Connector (IOTC)** provides a standardized interface for managing and controlling Zebra Handheld RFID Readers via Wi-Fi and Ethernet connections. Built on the MQTT protocol with JSON-formatted data structures, this API enables seamless integration with cloud and on-premise applications.

### Supported Devices

| Device | Connection Types |
|--------|------------------|
| RFD40  | Wi-Fi, Ethernet  |
| RFD90  | Wi-Fi, Ethernet  |

---

## Documentation

### 📖 [View API Documentation](https://friendly-adventure-3jvjew4.pages.github.io/)

The interactive API documentation provides detailed information about:

- **Control Commands** - Start/stop inventory scans, manage operating modes, configure post-filters
- **Device Management** - Configure endpoints, manage certificates, set Wi-Fi/Ethernet settings, reboot devices
- **Events** - Handle alerts, heartbeats, data events, and exception notifications

---

## API Categories

### Control Commands
Manage RFID device operations including:
- `get_operating_mode` - Retrieve current operating mode
- `set_operating_mode` - Configure operating mode
- `control_operation` - Start/stop inventory and scan operations
- `get_post_filter` / `set_post_filter` - Manage tag filtering

### Device Management Commands
Administer and configure devices:
- `get_config` / `set_config` - Device configuration
- `get_version` - Firmware version information
- `config_endpoint` - Endpoint configuration
- `set_wifi` / `get_wifi` - Wi-Fi profile management
- `get_eth` - Ethernet configuration
- `install_certificate` / `delete_certificate` - Certificate management
- `reboot` - Device restart

### Events
Real-time device notifications:
- **Alerts** - Battery, temperature, power, error notifications
- **Data Events** - Tag read data, barcode data
- **Heartbeat Events** - Connection status monitoring
- **Exception Events** - Error handling and logging

---

## Protocol & Communication

| Property | Value |
|----------|-------|
| Protocol | MQTT |
| Data Format | JSON |

---

## Related Resources

- [Zebra Technologies](https://www.zebra.com/)
- [Zebra Developer Portal](https://developer.zebra.com/)
- [RFD40 Product Page](https://www.zebra.com/us/en/products/rfid/rfid-handhelds/rfd40.html)
- [RFD90 Product Page](https://www.zebra.com/us/en/products/rfid/rfid-handhelds/rfd90.html)

---

## Support

For technical support and inquiries, please visit the [Zebra Support Portal](https://www.zebra.com/us/en/support-downloads.html).

---

<p align="center">
  <sub>© 2024-2026 Zebra Technologies Corporation. All rights reserved.</sub>
</p>
