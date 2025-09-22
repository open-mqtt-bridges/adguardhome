import { ENV } from './env';

export const TOPICS = {
	ADGUARD: {
		ONLINE: `${ENV.ADGUARD_TOPIC}/online` as const,
		STATUS: `${ENV.ADGUARD_TOPIC}/status` as const,
		STATS: `${ENV.ADGUARD_TOPIC}/stats` as const,
	},
	MQTT: {
		CMD: `${ENV.ADGUARD_TOPIC}/cmd` as const,
	},
};
