import { AdguardStats } from './adguard-stats';
import { AdguardStatus } from './adguard-status';

export type AdguardEvent = {
	connected: void;
	disconnected: void;
	status: AdguardStatus;
	stats: AdguardStats;
};
