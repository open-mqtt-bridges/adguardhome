import { cleanEnv, str, num, bool } from 'envalid';
import dotenv from 'dotenv';
import * as path from 'node:path';
import { logger } from './logger';

const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

export const ENV = cleanEnv(process.env, {
	// MQTT
	MQTT_PROTOCOL: str({
		default: 'mqtt',
		desc: 'Protocol for MQTT connection',
	}),
	MQTT_HOST: str({ desc: 'MQTT broker hostname or IP' }),
	MQTT_PORT: num({ default: 1883, desc: 'MQTT broker port' }),
	MQTT_USERNAME: str({ desc: 'MQTT username' }),
	MQTT_PASSWORD: str({ desc: 'MQTT password' }),
	MQTT_CLIENTID: str({
		default: crypto.randomUUID(),
		devDefault: crypto.randomUUID(),
		desc: 'MQTT client ID',
	}),
	// Adguard
	ADGUARD_HOST: str({ desc: 'Adguard Home hostname or IP (e.g., `http://192.168.1.50`)' }),
	ADGUARD_USERNAME: str({ desc: 'Adguard Home username' }),
	ADGUARD_PASSWORD: str({ desc: 'Adguard Home password' }),
	// config
	ADGUARD_TOPIC: str({ default: 'adguard', desc: 'Base MQTT topic for Adguard Home' }),
	ADGUARD_POLL_INTERVAL: num({
		default: 1000,
		desc: 'Polling interval in ms for Adguard Home. Set to 0 to disable polling.',
	}),
	ADGUARD_TIMEOUT: num({
		default: 30000,
		desc: 'Time (ms) of consecutive failures before increasing poll interval',
	}),
	ADGUARD_TIMEOUT_DURATION: num({
		default: 30000,
		desc: 'Poll interval in ms after timeout',
	}),
	PUSH_JSON_OBJECT: bool({
		default: true,
		desc: 'If `true`, publish Adguard info/heatpump/stats as full JSON objects',
	}),
	PUSH_JSON_KEYS: bool({
		default: true,
		desc: 'If `true`, also publish individual JSON keys as MQTT topics',
	}),
});

// log environment variables to console
if (ENV.isDev) {
	for (const key of Object.keys(ENV)) {
		logger.scope('ENV').debug(`${key} = ${String((ENV as any)[key])}`);
	}
}
