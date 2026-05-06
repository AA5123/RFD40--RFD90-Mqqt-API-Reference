---
id: message-format
title: Message Format
sidebar_label: Message Format
sidebar_position: 4
---

# Message Format

All commands and responses are JSON objects. Every message follows a common envelope that identifies the command and wraps the payload.

## Command envelope

```json
{
  "command": "<command-name>",
  "data": { }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `command` | string | Yes | The command name (e.g. `get_status`, `control_operation`) |
| `data` | object | Varies | Command-specific payload — see each command's schema |

## Response envelope

```json
{
  "command": "<command-name>",
  "status": 0,
  "data": { }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `command` | string | Echoes the command name from the request |
| `status` | integer | `0` = success; non-zero = error code (see [Error Codes](#error-codes)) |
| `data` | object | Command-specific response payload |

## Event envelope

```json
{
  "event": "<event-name>",
  "data": { }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `event` | string | The event type (e.g. `heartBeatEVT`, `dataEVT`) |
| `data` | object | Event-specific payload |

## Error codes

When a command fails, the `status` field contains a non-zero integer code. Each command's API reference page lists the error codes it can return, along with the IoT status constant, cause, and recommended action.

Common codes:

| Code | Meaning |
|------|---------|
| `0` | Success |
| `2` | Invalid payload |
| `3` | Information not available |
| `5` | Command not supported |
| `9` | Not allowed — inventory is running |

## Null vs omitted fields

- Fields set to `null` in a `set_*` command are **ignored** (they do not clear the existing value).
- To clear a field, send an empty string `""` or `0` depending on the field type — refer to the schema.

## See also

- [MQTT Topics](./topics.md)
- [API Reference](./api/gen-2-x-api-reference.info.mdx)
