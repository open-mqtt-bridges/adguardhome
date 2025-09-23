import { ENV } from './config/env';
import { logger } from './config/logger';
import { TOPICS } from './config/topics';
import { Adguard } from './services/adguard';
import { mqttClient } from './services/mqtt';
import { AdguardCommand } from './types/adguard-cmd';
import { getJsonPaths } from './util/json';

function publish(topic: string, data: any) {
	if (ENV.PUSH_JSON_OBJECT) {
		mqttClient.publish(topic, JSON.stringify(data));
	}

	if (ENV.PUSH_JSON_KEYS) {
		const paths = getJsonPaths(data, '/');
		for (const [path, value] of paths) {
			mqttClient.publish(`${topic}/${path}`, value);
		}
	}
}

const adguard = new Adguard(ENV.ADGUARD_HOST, ENV.ADGUARD_USERNAME, ENV.ADGUARD_PASSWORD);

//#region Adguard to MQTT
adguard.on('connected', () => {
	mqttClient.publish(TOPICS.ADGUARD.ONLINE, 'true');
});
adguard.on('disconnected', () => {
	mqttClient.publish(TOPICS.ADGUARD.ONLINE, 'false');
});
adguard.on('status', (data) => {
	publish(TOPICS.ADGUARD.STATUS, data);
});
adguard.on('stats', (data) => {
	publish(TOPICS.ADGUARD.STATS, data);
});
//#endregion

//#region MQTT to Adguard
mqttClient.on('message', async (topic, payload) => {
	const msg = payload.toString();
	if (!msg || msg === '') return;
	if (topic !== TOPICS.MQTT.CMD) return;

	logger.scope('MQTT').log(`[RX] ${JSON.stringify(JSON.parse(msg))}`);

	const cmd: AdguardCommand = JSON.parse(msg) satisfies AdguardCommand;
	await adguard.handleCommand(cmd);

	logger.scope('MQTT').info('Reset command');
	mqttClient.publish(TOPICS.MQTT.CMD, '');
});

mqttClient.subscribe(TOPICS.MQTT.CMD);
//#endregion
