Receive automatic alert events when the scanner crosses a threshold or changes state.

| Event | What It Reports |
|---|---|
| `alerts` | Full alert details "” battery, temperature, power, network, firmware, and antenna conditions |
| `alert_short` | Compact alert summary for lightweight monitoring |

Alerts are push-based. Enable or disable specific alert types via `set_config` â†’ `eventConfiguration`.
