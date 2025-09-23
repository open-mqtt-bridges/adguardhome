export type AdguardStatus = {
	dhcp_available: boolean;
	dns_addresses: string[];
	dns_port: number;
	http_port: number;
	language: string;
	protection_disabled_duration: number;
	protection_enabled: boolean;
	running: true;
	version: string;
};
