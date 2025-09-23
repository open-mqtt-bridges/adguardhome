# Adguard-MQTT Bridge

![Docker Build](https://github.com/tobiaswaelde/adguard-mqtt-bridge/actions/workflows/test-build.yml/badge.svg)
![Docker Deploy](https://github.com/tobiaswaelde/adguard-mqtt-bridge/actions/workflows/deploy.yml/badge.svg)
![Version](https://img.shields.io/github/v/tag/tobiaswaelde/adguard-mqtt-bridge?label=version)

A lightweight Node.js service that connects your [Adguard Home](https://adguard.com/en/adguard-home/overview.html) with MQTT.

It polls Adguard for **status** and **stats**, publishes updates to MQTT, and lets you send commands via MQTT to control your Adguard Home (e.g., enable/disable protection).

## Table Of Contents <!-- omit in toc -->
- [✨ Features](#-features)
- [⚙️ Configuration](#️-configuration)
  - [🌍 Environment Variables](#-environment-variables)
- [🚀 Deployment](#-deployment)
  - [🐋 Docker](#-docker)
- [📡 API](#-api)
  - [Commands](#commands)
- [📦 Changelog](#-changelog)


## ✨ Features
- 🔌 Simple bridge between **Adguard Home** and **MQTT**
- 📡 Publishes:
  - Status → `${TOPIC}/status`
  - Stats → `${TOPIC}/stats`
- 🕒 Adaptive polling:
  - Polls at `ADGUARD_POLL_INTERVAL` while healthy
  - Falls back to `ADGUARD_TIMEOUT_DURATION` polling if Adguard Home is unreachable for `ADGUARD_TIMEOUT`
- 🎛️ Supports MQTT commands:
  - `push_status`, `push_stats`, `set_protection`
- 🐳 Ready-to-use **Docker image**


## ⚙️ Configuration

### 🌍 Environment Variables
| Variable                 | Type   | Required | Default Value | Description                                                          |
| ------------------------ | ------ | -------- | ------------- | -------------------------------------------------------------------- |
| MQTT_PROTOCOL            | string | no       | `'mqtt'`      | Protocol for MQTT connection                                         |
| MQTT_HOST                | string | yes      |               | MQTT broker hostname or IP                                           |
| MQTT_PORT                | number | no       | `1883`        | MQTT broker port                                                     |
| MQTT_USERNAME            | string | yes      |               | MQTT username                                                        |
| MQTT_PASSWORD            | string | yes      |               | MQTT password                                                        |
| MQTT_CLIENTID            | string | no       | *random UUID* | MQTT client ID                                                       |
| ADGUARD_HOST             | string | yes      |               | Adguard Home hostname or IP (e.g., `http://192.168.1.50`)            |
| ADGUARD_USERNAME         | string | yes      |               | Adguard Home username                                                |
| ADGUARD_PASSWORD         | string | yes      |               | Adguard Home password                                                |
| ADGUARD_TOPIC            | string | yes      |               | MQTT topic prefix for Adguard Home messages                          |
| ADGUARD_POLL_INTERVAL    | number | no       | `1000`        | Poll interval in ms for Adguard Home. Set to `0` to disable polling. |
| ADGUARD_TIMEOUT          | number | no       | `30000`       | Time (ms) of consecutive failures before increasing poll interval    |
| ADGUARD_TIMEOUT_DURATION | number | no       | `30000`       | Poll interval in ms after timeout                                    |
| PUSH_JSON_OBJECT         | bool   | no       | `true`        | If `true`, publish Adguard Home status/stats as full JSON objects    |
| PUSH_JSON_KEYS           | bool   | no       | `true`        | If `true`, also publish individual JSON keys as MQTT topics          |


## 🚀 Deployment

### 🐋 Docker
```yaml
# compose.yaml

services:
  adguard-mqtt-bridge:
    container_name: adguard-mqtt-bridge
    image: ghcr.io/tobiaswaelde/adguard-mqtt-bridge
    restart: always
    environment:
      MQTT_HOST: 192.168.1.10
      MQTT_PORT: 1883
      MQTT_USERNAME: username
      MQTT_PASSWORD: password
      ADGUARD_HOST: 192.168.178.11
      ADGUARD_USERNAME: admin
      ADGUARD_PASSWORD: secret
      TOPIC: adguard
```


## 📡 API

### Commands

Commands are sent via the MQTT topic:

```bash
${TOPIC}/cmd
```

After a command is executed, the value is reset to `null`.

Available commands:
- []

#### Push Status
Fetch status information and publish to `${TOPIC}/status`.

##### Command
```jsonc
// ${TOPIC}/cmd
{ "cmd": "push-status" }
```

##### Response
```jsonc
// ${TOPIC}/status
{
  "version": "v0.107.44",
  "language": "en",
  "dns_addresses": ["10.8.12.61"],
  "dns_port": 53,
  "http_port": 80,
  "protection_disabled_duration": 0,
  "protection_enabled": true,
  "dhcp_available": true,
  "running": true
}
```

#### Push Stats
Fetch stats and publish to `${TOPIC}/stats`.

##### Command
```jsonc
// ${TOPIC}/cmd
{ "cmd": "push-stats" }
```

##### Response
```jsonc
// ${TOPIC}/stats
{
	"time_units": "days",
	"top_queried_domains": [
		{ "sync-v2.brave.com": 428658 }
		// ...
	],
	"top_clients": [
		{ "10.8.30.1": 3204062 }
		// ...
	],
	"top_blocked_domains": [
		{ "mobile.events.data.microsoft.com": 258262 }
		// ...
	],
	"top_upstreams_responses": [
		{ "1.0.0.1:53": 1885549 }
		// ...
	],
	"top_upstreams_avg_time": [
		{ "[2a0f:fc81::]:53": 1.7113734150943394 }
		// ...
	],
	"dns_queries": [ 80787, 81381, 88380, /* ... */ ],
	"blocked_filtering": [0, 2,	0, /* ... */ ],
	"replaced_safebrowsing": [0, 0, 0,	/* ... */	],
	"replaced_parental": [ 0, 0, 0, /* ... */	],
	"num_dns_queries": 7801700,
	"num_blocked_filtering": 1926932,
	"num_replaced_safebrowsing": 1832,
	"num_replaced_safesearch": 0,
	"num_replaced_parental": 0,
	"avg_processing_time": 0.025186
}
```

#### Set Protection
Enable or disable protection, then fetch status & publish to `${TOPIC}/status`.

##### Command
###### Enable
```jsonc
// ${TOPIC}/cmd
{
  "cmd": "set-protection",
  "value":{
    "enabled": true
  }
}
```

###### Disable
```jsonc
// ${TOPIC}/cmd
{
  "cmd": "set-protection",
  "value":{
    "enabled": false,
    "duration": 10000, // optionally provide duration in ms, after that time has passed protection will be automatically enabled again
  }
}
```


## 📦 Changelog

See the [CHANGELOG.md](./CHANGELOG.md) for details on what’s new in recent versions.