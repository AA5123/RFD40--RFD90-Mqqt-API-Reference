---
id: connection
title: Connecting to the Reader
sidebar_label: Connection
sidebar_position: 2
---

# Connecting to the Reader

The RFD40/RFD90 reader acts as an **MQTT client**. It connects to your MQTT broker using credentials and endpoint settings you push via the `config_endpoint` command.

## Prerequisites

| Requirement | Detail |
|-------------|--------|
| MQTT broker | MQTT v3.1.1 or v5.0 — Mosquitto, HiveMQ, AWS IoT Core, Azure IoT Hub, etc. |
| Network | Reader and broker must share IP connectivity (Wi-Fi or Ethernet). |
| Firmware | IoTC firmware must be installed on the reader. |

## Connection sequence

```
1. Reader boots → loads stored endpoint config
2. Reader opens TCP/TLS connection to broker
3. Reader sends MQTT CONNECT (clientId = device serial number)
4. Broker ACKs → reader subscribes to command topic
5. Reader publishes mqttConnEVT (connected)
```

## Configuring the endpoint

Send a `config_endpoint` command to set or update the broker connection:

```json
{
  "command": "config_endpoint",
  "data": {
    "url": "mqtts://broker.example.com",
    "port": 8883,
    "clientId": "<device-serial>",
    "username": "reader-user",
    "password": "s3cr3t",
    "keepAlive": 60
  }
}
```

After the command is accepted, the reader reconnects using the new settings. Monitor the connection state via [`mqttConnEVT`](./api/mqtt-connectivity.tag.mdx).

## Verifying connectivity

1. Subscribe to `<prefix>/evt/<device-id>`.
2. Send a `get_status` command.
3. A valid response on `<prefix>/rsp/<device-id>` confirms the connection is live.

## Reconnection behaviour

- The reader automatically reconnects with exponential back-off if the broker connection drops.
- A `mqttConnEVT` is published on both connect and disconnect.

## See also

- [MQTT Topics](./topics.md)
- [Authentication](./authentication.md)
- [`config_endpoint` API reference](./api/mqtt-endpoint-configuration.tag.mdx)
