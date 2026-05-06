Receive RFID tag reads published by the scanner during an active inventory scan.

| Event | What It Reports |
|---|---|
| `dataEVT` | Tag data "” EPC, RSSI, antenna, timestamp, and optional memory bank data for each tag read |

Tag data events stream continuously while inventory is running. Each event contains one or more tag reads with EPC, signal strength, and read metadata.
