---
id: topics
title: MQTT Topics
sidebar_label: MQTT Topics
sidebar_position: 3
---

# MQTT Topics

The Gen2X API uses a structured MQTT topic hierarchy. All topics share a configurable prefix and include the device serial number so a single broker can serve a fleet of readers.

## Topic structure

```
<prefix>/<type>/<device-id>
```

| Segment | Description |
|---------|-------------|
| `<prefix>` | Configured per-device via `config_endpoint` → `topicPrefix`. Default: `zebra/rfid` |
| `<type>` | `cmd` (commands), `rsp` (responses), `evt` (events) |
| `<device-id>` | Device serial number — unique per reader |

## Topic table

| Topic | Direction | Description |
|-------|-----------|-------------|
| `<prefix>/cmd/<device-id>` | Publish (↑) | Send a command to the reader |
| `<prefix>/rsp/<device-id>` | Subscribe (↓) | Receive command responses |
| `<prefix>/evt/<device-id>` | Subscribe (↓) | Receive asynchronous event notifications |

## Wildcards for fleet management

Use MQTT wildcards when managing multiple readers from one subscriber:

| Pattern | Matches |
|---------|---------|
| `zebra/rfid/rsp/+` | Responses from all readers one level deep |
| `zebra/rfid/evt/#` | All events from all readers at any depth |

> **Note:** Never use wildcards on the command topic — commands must target a specific device.

## QoS recommendations

| Topic | Recommended QoS | Reason |
|-------|-----------------|--------|
| Commands | QoS 1 | At-least-once delivery ensures the reader receives the command |
| Responses | QoS 1 | Ensures the application receives the acknowledgment |
| Events | QoS 0 or 1 | High-frequency tag data events can use QoS 0; health events should use QoS 1 |

## See also

- [Message Format](./message-format.md)
- [`config_endpoint` API reference](./api/mqtt-endpoint-configuration.tag.mdx)
