MQTT-based API for managing and controlling Zebra RFD40 and RFD90 RFID readers. Send JSON command payloads to the MQTT command topic and receive responses on the response topic.

## Get started

Use this sequence when working with the API reference and validating commands against the current project artifacts.

## Message model

Commands are sent as JSON payloads to the configured MQTT command topic. Responses and events are received on the corresponding MQTT response and event topics.

Each command follows the reader command envelope defined by its schema. Request and response examples in this reference are generated directly from the current schema files in this project.

