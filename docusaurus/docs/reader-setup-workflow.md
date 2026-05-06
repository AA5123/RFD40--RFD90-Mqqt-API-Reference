---
id: reader-setup-workflow
title: Reader Setup Workflow
sidebar_label: Reader Setup Workflow
sidebar_position: 2
---

# Reader Setup Workflow

This guide covers the main setup flow in the desktop application, from discovering a reader to configuring connectivity and reader behavior.

## Discovery Screen

The Discovery screen finds and connects supported readers on the network, over USB, over Bluetooth, or through COM ports. Once a reader is connected, you can start reading tags.

### What you can do

1. Step 1: Find Reader. Discover readers on the same subnet as the PC.
2. Step 2: Connect Reader. Connect from the Available Readers list, or connect manually by selecting a reader type and entering the reader IP address, host name, or COM port.
3. Step 3: Read Tags. Start inventory on the connected reader and move to the Read screen.

> Note: Up to 20 readers can be connected at the same time.

### Other actions

- Configure Reader to open the configuration workflow and edit or load reader settings.
- Ping Reader before connecting to confirm that the reader is reachable.
- Set region configuration and communication standards.
- Open the reader console from the IP address entry when the reader is connected over IP.
- Change the connection mode between secured and unsecured connection options from the available readers list.

### Helpful hints

- If reader discovery does not find the device, connect manually with the reader type and IP address, host name, or COM port.
- For fixed readers, you can switch between available connection modes before connecting. If a secured connection is selected, provide the required secured connection details in the connection window.
- Directly connected fixed readers over USB or Ethernet may not expose serial number or manufacturing date. RE40 devices do expose serial number.

## Reader Configuration

The Reader Configuration wizard lets you update reader and antenna settings. Changes are saved immediately, and you can also save settings to a file on the PC or print a report.

### Main tasks

1. Edit a reader's settings and open the configuration wizard.
2. Load a saved configuration file from the PC to another connected reader.
3. Change the password for supported RFD40 and RFD90 EU regions.
4. Log in to the device to access administrative features.
5. Apply a use-case profile to push its RF-related settings to the connected reader.

### What the configuration wizard supports

- Assign names to the reader and connected antennas.
- Set antenna settings or reset them to factory defaults.
- Persist supported antenna-related settings on the reader.
- Change the reader region configuration.
- Create GPIO rules to trigger inventory and output actions.
- Save or print configurations to a file.

> Note: For RFID module RE40, persisting settings on the device is not supported.

### Profile behavior

- The profile marked with an asterisk (`*`) is the active profile on the reader.
- Out of the box, the Current Config profile is active.
- Current Config matches the Default profile until the user changes the out-of-box settings.
- After settings are changed, Current Config becomes the active profile instead of Default.

### Additional notes

1. Use-case profiles are supported only for fixed readers with LLRP connection.
2. If loading a saved configuration file requires device login, only users with administrative privileges can use that feature. This applies to RFD40 and RFD90 readers.
3. RFD40 and RFD90 administrative passwords must be 8 to 31 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.

## Wi-Fi Configuration

Use Wi-Fi Configuration to review the current network connection, create Wi-Fi profiles, and connect the reader to available networks.

### Existing connection

- Get Details to view the connected SSID, MAC address, IP address, and connection status.
- Disconnect to leave the current network.

### Add a Wi-Fi profile and connect

When scanning and choosing a network, you can configure:

- SSID from the scanned network list.
- Protocol, which is suggested automatically when an SSID is selected and can be changed.
- Passkey for WPA or WPA2 networks.
- EAP method.
- CA certificate, client certificate, and private key.
- Identity, anonymous identity, password, and private key password.
- Hidden Profile so the reader can connect even if the network is not visible during scanning.

Available actions:

- Add to create the network profile.
- Connect to join the network.

### Enter SSID manually

If the network is not discovered during scanning, enter the SSID manually and provide the same security and credential fields as required for that network.

### Use an existing SSID profile

- Mark Preferred Wi-Fi to make the selected network the first choice for association.
- Select an existing SSID profile from the list.
- Delete the selected profile.
- Connect using the saved profile.

### DFS channel selection

Dynamic Frequency Selection allows the device to change channels when radar signals are detected. Supported channel groups can include:

- 2.4 GHz WLAN channels
- 5 GHz WLAN channels
- 5 GHz DFS WLAN channels

> Note: Available channels depend on the configured region. A maximum of 10 Wi-Fi configurations can be created.

> Note: If administrative credentials are requested, only users with administrative privileges can access or modify Wi-Fi configuration.

## Endpoint Configuration

Endpoint Configuration lets you add and manage endpoint settings used by the reader.

### Add a new endpoint

Use New or Add to create an endpoint configuration, enter the required values, and save them on the reader.

Supported fields include:

- Type
- Protocol
- URL
- Port
- Keep Alive
- Tenant Id
- Clean Session
- Reconnect Delay
- Host Verify
- Username
- Password
- CA Certificate
- Client Certificate
- Private Key
- Command Topic
- Response Topic
- Event Topic

### Manage existing endpoints

- Save changes to the selected endpoint configuration.
- Cancel the current operation.
- Select an existing endpoint from the list to update it.
- Delete the selected endpoint.
- Delete All existing endpoints.
- Refresh Endpoint Status to review the management endpoint status on the reader.
- Activate or deactivate the selected endpoint.

### Notes

- A maximum of 10 endpoint configurations can be added.
- Each endpoint configuration can be up to 480 bytes.
- If administrative credentials are requested, only users with administrative privileges can access or modify endpoint configuration.