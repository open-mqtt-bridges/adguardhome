export type AdguardStats = {
	avg_processing_time: number;
	blocked_filtering: number[];
	dns_queries: number[];
	num_blocked_filtering: number;
	num_dns_queries: number;
	num_replaced_parental: number;
	num_replaced_safebrowsing: number;
	num_replaced_safesearch: number;
	replaced_parental: number[];
	replaced_safebrowsing: number[];
	time_units: 'days';
	top_blocked_domains: { [domain: string]: number }[];
	top_clients: { [client: string]: number }[];
	top_queried_domains: { [domain: string]: number }[];
	top_upstreams_avg_time: { [upstream: string]: number }[];
	top_upstreams_responses: { [upstream: string]: number }[];
};
