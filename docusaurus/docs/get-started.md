---
id: get-started
title: Get Started
sidebar_label: Get Started
sidebar_position: 1
---

# Get Started

This guide shows you how to connect a Zebra RFD40 or RFD90 handheld RFID reader to an MQTT broker, then send your first command. Follow the steps in order. If your reader is already provisioned, skip to [Topic structure](#topic-structure).

## Before you begin

Make sure you have the following:

- A Zebra **RFD40** or **RFD90** reader with firmware that supports MQTT
- A Windows PC with **123RFID Desktop** installed
- An MQTT broker the reader can reach (for example, AWS IoT Core, HiveMQ, or Mosquitto)
- A Wi-Fi network for the reader, or a USB or Bluetooth connection to your PC
- CA, client, and private key certificates if your broker requires mutual TLS

> 📸 **Screenshot placeholder:** `images/get-started/01-hardware-overview.png`
> *Photo of the RFD40/RFD90 reader. Optional — sets visual context for the page.*

## Connect the reader

Before you configure MQTT, connect the reader to 123RFID Desktop.

1. Open **123RFID Desktop** and go to the **Discovery** screen.
1. Select **Find Reader** to scan the local subnet.
1. In the **Available Readers** list, select **Connect** next to your reader.

> 📸 **Screenshot placeholder:** `images/get-started/02-discovery-screen.png`
> *Discovery screen with the Find Reader button and Available Readers list highlighted.*

If your reader doesn't appear, connect manually:

1. Select your reader type from the dropdown.
1. Enter the reader's IP address, hostname (printed on the reader label), or COM port.
1. Select **Connect**.

> 📸 **Screenshot placeholder:** `images/get-started/03-manual-connect.png`
> *Manual connect dropdown with reader-type selection and address field.*

:::note
You can connect up to 20 readers at a time. FX readers connected directly over USB or Ethernet don't expose serial number or manufacturing date.
:::

## Connect to Wi-Fi

For MQTT to work in production, the reader needs persistent network connectivity. Wi-Fi is the simplest option.

1. Go to the **Wi-Fi Configuration** screen.
1. Select your network. You have three options:
   - **Scan and choose network** — pick an SSID from the discovered list.
   - **Enter SSID** — type a hidden or known SSID.
   - **Choose existing SSID** — select a saved profile.
1. Enter credentials based on your protocol:
   - For **WPA / WPA2 Personal**, enter the passkey.
   - For **WPA / WPA2 Enterprise (EAP)**, enter your identity, password, and any required certificates.
1. Select **Add**, and then select **Connect**.

> 📸 **Screenshot placeholder:** `images/get-started/04-wifi-configuration.png`
> *Wi-Fi Configuration screen with the SSID dropdown, protocol selector, and Add and Connect buttons.*

To confirm the connection, select **Get Details**. The screen shows the SSID, MAC address, IP address, and connection status.

> 📸 **Screenshot placeholder:** `images/get-started/05-wifi-get-details.png`
> *Get Details panel showing the active Wi-Fi connection.*

:::note
You can save up to 10 Wi-Fi profiles. Some channels might be disabled depending on your region.
:::

## Add an MQTT endpoint

You configure the MQTT broker on the **End Point Configuration** screen.

1. Select **New** to start a new endpoint.
1. Enter the connection details. Use the following table for guidance.

| Field | Description |
|---|---|
| **Type** | The endpoint type (for example, MQTT, SOTI, or MDM) |
| **Protocol** | The transport protocol (MQTT or MQTTS) |
| **URL** | The broker URL or hostname |
| **Port** | The broker port. Use `1883` for plain MQTT or `8883` for TLS. |
| **Keep Alive** | The number of seconds to buffer messages if the connection drops |
| **Tenant ID** | The prefix for all topics |
| **Clean Session** | Whether to start a fresh session on each connect |
| **Reconnect Delay** | The minimum and maximum seconds before reconnect attempts |
| **Host Verify** | Whether to validate the broker's TLS hostname |
| **Username** and **Password** | Basic authentication credentials, if your broker requires them |
| **CA Certificate**, **Client Certificate**, and **Private Key** | Files for mutual TLS connections |
| **Command Topic** | The subtopic where the device receives commands |
| **Response Topic** | The subtopic where the device publishes command responses |
| **Event Topic** | The subtopic where the device publishes alerts and tag data |

> 📸 **Screenshot placeholder:** `images/get-started/06-endpoint-form.png`
> *End Point Configuration form populated for an MQTT endpoint.*

3. Select **Save**.
4. Select the **Activate** checkbox next to the endpoint.
5. Under **Endpoint Status**, select **Refresh** to confirm the connection is up.

> 📸 **Screenshot placeholder:** `images/get-started/07-endpoint-activated.png`
> *Endpoint list with the Activate checkbox selected and a healthy status.*

:::note
You can add up to 10 endpoints, each up to 480 bytes. You need administrative credentials to add or change endpoints. To sign in, go to **Configure** > **Login**.
:::

## Topic structure

All MQTT topics on the RFD40 and RFD90 follow this format:

```
<Tenant ID>/<User Configured Topic>/<Device Serial No>
```

> 📸 **Screenshot placeholder:** `images/get-started/08-topic-structure-diagram.png`
> *Diagram showing the three parts of a topic: Tenant ID, user-configured topic, and device serial number.*

### Publish topic

The reader subscribes to **one** publish topic. When your application publishes to this topic, the reader treats the message as a command.

**Example**

```
zebra/CTRL/clients/cmnd/RFD40-212735201D0053
```

### Subscribe topics

The reader publishes to **four** topics. Each topic carries a different class of message.

| Purpose | Example topic |
|---|---|
| Command responses | `zebra/CTRL/clients/resp/RFD40-212735201D0053` |
| Alerts and events | `zebra/CTRL/clients/event/RFD40-212735201D0053` |
| Tag data events | `zebra/DATA/clients/data1event/RFD40-212735201D0053` |
| Last Will and Testament | `zebra/CTRL/clients/rfid/RFD40-212735201D0053` |

> 📸 **Screenshot placeholder:** `images/get-started/09-topic-flow.png`
> *Flow diagram showing how the application and the device exchange messages over the publish and subscribe topics.*

:::tip
To listen to a fleet of readers under the same tenant, replace the device serial number with `+` (the single-level wildcard) on the subscriber side.
:::

## Send your first command

After the endpoint is active, your application can publish a JSON command to the publish topic and listen on the response topic.

```bash
# Subscribe to responses (in one terminal)
mosquitto_sub -h <broker> -p 8883 \
  -t "zebra/CTRL/clients/resp/RFD40-212735201D0053" \
  --cafile ca.pem --cert client.pem --key client.key

# Publish a command (in another terminal)
mosquitto_pub -h <broker> -p 8883 \
  -t "zebra/CTRL/clients/cmnd/RFD40-212735201D0053" \
  -m '{"command":"get_version"}' \
  --cafile ca.pem --cert client.pem --key client.key
```

> 📸 **Screenshot placeholder:** `images/get-started/10-first-command-mqtt-explorer.png`
> *MQTT Explorer showing the get_version command and the device's response payload.*

For the full list of commands, payload schemas, and event formats, see the API reference in the left navigation.

## Troubleshooting

| Problem | Solution |
|---|---|
| Reader isn't discovered | Make sure your PC and the reader are on the same subnet. Select **Retry**, or connect manually by IP address, hostname, or COM port. |
| Endpoint won't activate | You need administrative credentials. Go to **Configure** > **Login** before you edit endpoints. |
| TLS connection fails | Confirm your CA certificate matches the broker. Make sure **Host Verify** is consistent with the certificate's CN or SAN. |
| No tag data on the broker | Start inventory on the reader from the **Read** screen. Confirm the data event topic is configured and active. |
| Password rejected (RFD40 and RFD90 EU) | Use 8 to 31 characters. Include an uppercase letter, a lowercase letter, a special character, and a number. |

> 📸 **Screenshot placeholder:** `images/get-started/11-troubleshooting-example.png`
> *Optional — the "Cannot discover reader" state with the Retry button highlighted.*

## Next steps

- See the **Commands** reference for the full command schema.
- Review the **Events and alerts** reference for asynchronous messages from the reader.
- Read the **Data events** reference for tag read payloads.
- For mutual TLS setup with AWS IoT Core or other brokers, see the [Authentication](./authentication.md) guide.

---

:::info Screenshot folder structure
When you have the actual screenshots, place them in this folder and replace each placeholder with a standard Markdown image:

```
docs/
└── images/
    └── get-started/
        ├── 01-hardware-overview.png
        ├── 02-discovery-screen.png
        ├── 03-manual-connect.png
        ├── 04-wifi-configuration.png
        ├── 05-wifi-get-details.png
        ├── 06-endpoint-form.png
        ├── 07-endpoint-activated.png
        ├── 08-topic-structure-diagram.png
        ├── 09-topic-flow.png
        ├── 10-first-command-mqtt-explorer.png
        └── 11-troubleshooting-example.png
```

Example replacement:

```markdown
![Discovery screen with Find Reader highlighted](images/get-started/02-discovery-screen.png)
```
:::
