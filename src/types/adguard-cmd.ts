export enum Command {
	PushStatus = 'push-status',
	PushStats = 'push-stats',
	SetProtection = 'set-protection',
}

export type AdguardCommand =
	| { cmd: Command.PushStatus }
	| { cmd: Command.PushStats }
	| { cmd: Command.SetProtection; value: { enabled: boolean; duration?: number } };
