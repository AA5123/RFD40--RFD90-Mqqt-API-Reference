Read or write the scanner's entire configuration in a single command "” no need to call individual endpoints separately.

| Command | What It Does |
|---|---|
| `get_config` | Retrieve the full configuration "” equivalent to calling get_version, get_status, get_current_region, get_wifi, get_eth, get_endpoint_config, and get_installed_certificate at once |
| `set_config` | Apply configuration changes "” Wi-Fi, MQTT endpoint, events, and more in one payload |

Use `get_config` for bulk reads and `set_config` to push settings to one or many scanners.
