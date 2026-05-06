---
id: troubleshooting
title: Troubleshooting
sidebar_label: Troubleshooting
sidebar_position: 6
---

# Troubleshooting

## Reader not connecting to the broker

| Symptom | Likely cause | Resolution |
|---------|-------------|------------|
| No `mqttConnEVT` after reboot | Wrong broker URL or port | Verify `config_endpoint` URL and port; check network reachability |
| TLS handshake failure | Missing or expired CA certificate | Re-install the CA cert via `install_certificate` |
| Authentication error | Wrong username / password | Re-send `config_endpoint` with correct credentials |
| Connects then immediately disconnects | Duplicate `clientId` on broker | Ensure each reader uses its unique serial number as `clientId` |

## Commands not acknowledged

| Symptom | Likely cause | Resolution |
|---------|-------------|------------|
| No response on `rsp` topic | Subscribed to wrong topic | Confirm subscription uses the exact device serial number |
| `status: 9` in response | Inventory is running | Stop inventory with `control_operation` before sending configuration commands |
| `status: 2` in response | Invalid payload | Validate your JSON against the command schema; check required fields |
| Response arrives but `status` is non-zero | Command-specific error | Look up the status code in the command's Error Codes table |

## No tag data events

| Symptom | Likely cause | Resolution |
|---------|-------------|------------|
| `control_operation` succeeds but no `dataEVT` | No tags in antenna field | Bring a tag within read range and retry |
| Sporadic reads | RF interference or low transmit power | Increase transmit power via `set_operating_mode` |
| High duplicate rate | Session parameter too low | Adjust session and tag population in `set_operating_mode` |

## Heartbeats stop arriving

Heartbeats are sent by the reader on a configured interval. If they stop:

1. Check network connectivity between broker and reader.
2. Verify the heartbeat interval: `get_config` → `eventConfiguration.heartbeatConfiguration.interval`.
3. Send `get_status` — if it responds, the reader is alive but heartbeat events may be disabled.
4. Enable heartbeats: `config_events` → set `heartbeat.enabled = true`.

## Firmware update failures

| `set_os` status code | Resolution |
|----------------------|------------|
| Battery too low | Charge the reader; battery must be above the minimum threshold |
| Invalid URL | Check the firmware image URL is reachable from the reader's network |
| Certificate error | Install the CA certificate for the firmware download server |

## Collecting diagnostic information

Use these commands to gather information for Zebra support:

```
get_status    → battery, temperature, radio state
get_version   → firmware versions and serial number
get_config    → full configuration snapshot
```

## See also

- [Message Format — Error Codes](./message-format.md#error-codes)
- [API Reference](./api/gen-2-x-api-reference.info.mdx)
