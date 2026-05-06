Receive periodic heartbeat events from the scanner to confirm it is alive and connected.

| Event | What It Reports |
|---|---|
| `heartBeatEVT` | Periodic health pulse "” battery status, inventory state, and connectivity confirmation |

Configure the heartbeat interval via `set_config` â†’ `eventConfiguration` â†’ `heartbeatConfiguration`. If heartbeats stop arriving, the scanner may be offline.
