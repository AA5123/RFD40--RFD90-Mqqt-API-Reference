---
id: authentication
title: Authentication
sidebar_label: Authentication
sidebar_position: 5
---

# Authentication

The Gen2X reader supports multiple authentication mechanisms for the MQTT broker connection and for Wi-Fi Enterprise networks.

## MQTT broker authentication

### Username and password

Set credentials when configuring the endpoint:

```json
{
  "command": "config_endpoint",
  "data": {
    "url": "mqtt://broker.example.com",
    "port": 1883,
    "username": "reader-user",
    "password": "s3cr3t"
  }
}
```

Credentials are stored on the reader and used on every reconnect.

### TLS / mutual TLS (mTLS)

For encrypted connections and certificate-based authentication:

1. Install a CA certificate so the reader can verify the broker's server certificate.
2. Optionally install a client certificate and private key for mTLS.
3. Set the broker URL scheme to `mqtts://` and port to `8883`.

```json
{
  "command": "config_endpoint",
  "data": {
    "url": "mqtts://broker.example.com",
    "port": 8883,
    "tlsEnabled": true,
    "caCertName": "broker-ca.pem",
    "clientCertName": "reader-client.crt",
    "clientKeyName": "reader-client.key"
  }
}
```

## Certificate management

Use the Certificate Management API to install certificates before referencing them in `config_endpoint` or Wi-Fi settings.

| Command | Purpose |
|---------|---------|
| `install_certificate` | Upload a PEM-encoded certificate or private key to the reader |
| `delete_certificate` | Remove an installed certificate by name |
| `get_installed_certificate` | List certificates currently stored on the reader |

See the [Certificate Management API reference](./api/certificate-management.tag.mdx) for full schema details.

## Wi-Fi Enterprise (802.1X)

For WPA2/WPA3 Enterprise networks, install the required certificates and reference them in `set_wifi`:

```json
{
  "command": "set_wifi",
  "data": {
    "ssid": "CorpNet",
    "security": "WPA2-Enterprise",
    "eapMethod": "TLS",
    "caCertName": "corp-ca.pem",
    "clientCertName": "reader.crt",
    "clientKeyName": "reader.key"
  }
}
```

## Security recommendations

- Use `mqtts://` (TLS) in production — never send credentials over plain `mqtt://`.
- Rotate certificates before their expiry date; use `get_installed_certificate` to check expiry.
- Use per-device client certificates (mTLS) so individual readers can be revoked without affecting the fleet.
- Store private keys only on the reader — never in application code.

## See also

- [Connection](./connection.md)
- [Certificate Management API](./api/certificate-management.tag.mdx)
- [Network Configuration API](./api/network-configuration.tag.mdx)
