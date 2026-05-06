---
id: intro
title: Overview
sidebar_label: Overview
sidebar_position: 1
slug: /
---

# Gen2X API Reference

The Gen2X API provides MQTT-based command and control for **Zebra RFD40** and **RFD90** RFID handheld readers running the IoT Connector (IoTC) firmware.

## What you can do

- **Device Status** — Query battery level, temperature, firmware versions, and regulatory settings.
- **Device Configuration** — Read and write the full device configuration in a single command.
- **Network Configuration** — Manage Wi-Fi profiles and monitor Ethernet state.
- **MQTT Endpoint Configuration** — Configure the broker URL, topics, QoS, and TLS settings.
- **Certificate Management** — Install and remove TLS/SSL certificates for broker and Wi-Fi Enterprise auth.
- **System Operations** — Reboot the device or trigger a firmware update.
- **Inventory Control** — Start and stop RFID tag scanning operations.
- **Operating Mode** — Configure RF parameters — transmit power, session, and tag population settings.
- **Tag Filtering** — Define post-read filters to include or exclude specific tags by EPC pattern.
- **Events** — Receive heartbeats, alerts, exceptions, MQTT connectivity events, and tag data streams.

## Message model

All commands follow a request/response pattern over MQTT:

| Direction | Topic | Content |
|-----------|-------|---------|
| Command (publish) | `<prefix>/cmd/<device-id>` | JSON command payload |
| Response (subscribe) | `<prefix>/rsp/<device-id>` | JSON response payload |
| Events (subscribe) | `<prefix>/evt/<device-id>` | JSON event payload |

## Next steps

1. [Connect to the reader](./connection.md) — establish the MQTT broker link.
2. [Understand MQTT topics](./topics.md) — learn the topic hierarchy.
3. [Message format](./message-format.md) — understand the command envelope.
4. [Authentication](./authentication.md) — configure credentials and certificates.
