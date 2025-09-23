import axios, { AxiosInstance } from 'axios';
import { TypedEmitter } from '../util/typed-emitter';
import { ENV } from '../config/env';
import { logger } from '../config/logger';
import { AdguardStatus } from '../types/adguard-status';
import { AdguardStats } from '../types/adguard-stats';
import { AdguardEvent } from '../types/adguard-event';
import { AdguardCommand, Command } from '../types/adguard-cmd';

export class Adguard extends TypedEmitter<AdguardEvent> {
	private api: AxiosInstance;

	private pollTimer: NodeJS.Timeout | null = null;
	private pollDelay: number = ENV.ADGUARD_POLL_INTERVAL;
	private firstFailAt: number | null = null; // timestamp of first failure

	private isProcessing: boolean = false;

	constructor(host: string, username: string, password: string) {
		super();

		this.api = axios.create({
			baseURL: `${host}/control`,
			auth: {
				username,
				password,
			},
		});

		// start polling
		if (ENV.ADGUARD_POLL_INTERVAL > 0) {
			this.startPolling();
		}
	}

	//#region polling
	private startPolling() {
		if (this.pollTimer) clearTimeout(this.pollTimer);

		let delay = this.pollDelay;

		// if we've been failing for longer than the timeout, slow down
		if (this.firstFailAt && Date.now() - this.firstFailAt >= ENV.ADGUARD_TIMEOUT) {
			delay = ENV.ADGUARD_TIMEOUT_DURATION;
		}

		this.pollTimer = setTimeout(async () => {
			try {
				await this.getStatus();
				await this.getStats();

				// successful → reset attempts + restore normal delay
				if (this.firstFailAt) {
					logger.scope('Adguard').info('Connection restored, resetting delay');
				}
				this.firstFailAt = null;
				this.pollDelay = ENV.ADGUARD_POLL_INTERVAL;

				this.emit('connected', undefined);
			} catch (err) {
				if (!this.firstFailAt) {
					this.firstFailAt = Date.now();
				}
				this.emit('disconnected', undefined);
				logger
					.scope('Adguard')
					.warn(`Polling failed, first fail at ${new Date(this.firstFailAt).toISOString()}`);
			}

			// schedule next poll
			this.startPolling();
		}, delay);
	}
	//#endregion
	//#region command
	public async handleCommand(command: AdguardCommand) {
		if (this.isProcessing) {
			logger.scope('Adguard').warn('Already processing a command, ignoring new command.');
			return;
		}

		logger.scope('Adguard').start(`Handling command "${command.cmd}"...`);
		this.isProcessing = true;
		try {
			switch (command.cmd) {
				case Command.PushStatus:
					await this.getStatus();
					break;
				case Command.PushStats:
					await this.getStats();
					break;
				case Command.SetProtection:
					await this.setProtection(command.value.enabled, command.value.duration);
					break;
			}
		} catch (err) {
			this.emit('disconnected', undefined);
		} finally {
			this.isProcessing = false;
		}

		logger.scope('Adguard').success(`Command "${command.cmd}" executed.`);
	}
	//#endregion

	//#region getters
	private async getStatus() {
		const res = await this.api.get<AdguardStatus>('/status');
		// return res.data;
		this.emit('status', res.data);
	}

	private async getStats() {
		const res = await this.api.get<AdguardStats>('/stats');
		// return res.data;
		this.emit('stats', res.data);
	}
	//#endregion
	//#region setters
	private async setProtection(enabled: boolean, duration: number = 0) {
		const res = await this.api.post('/protection', {
			enabled,
			duration,
		});
		await this.getStatus();
	}
	//#endregion
}
