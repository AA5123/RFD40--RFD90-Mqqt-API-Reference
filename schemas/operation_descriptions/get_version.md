Retrieves the **scanner's identity card** — model, serial number, SKU, and all firmware versions.

**Command details:**

| Property | Value |
|---|---|
| Pattern Name | Reader Identity and Firmware Retrieval |
| Communication Type | Bidirectional (Cloud to Device, Device to Cloud) |
| Applies To | RFD40 Series, RFD90 Series |

**Response fields:**

| Field | What it tells you |
|---|---|
| `firmwareVersion` | Main device firmware version |
| `model` | Scanner model — RFD40 or RFD90 |
| `serialNumber` | Unique device serial number |
| `sku` | Stock Keeping Unit — encodes model, features, and region (e.g. `RFD4031-G10B700-US`) |
| `detailedVersions.scannerFirmware` | Barcode scanner module firmware |
| `detailedVersions.radioFirmware` | RFID radio module firmware |
| `detailedVersions.iotcVersion` | IoT Connector software version |

