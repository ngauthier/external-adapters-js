import { AdapterConfigError, Requester, util } from '@chainlink/ea-bootstrap'
import { AdapterContext, Config } from '@chainlink/ea-bootstrap'
import { envDefaultOverrides } from './envDefaultOverrides'

export const NAME = 'L2_SEQUENCER_HEALTH'

export const adapterContext: AdapterContext = { name: NAME, envDefaultOverrides }

export const DEFAULT_ENDPOINT = 'health'

// 2 minutes
export const DEFAULT_DELTA_TIME = 2 * 60 * 1000
// Blocks that replica nodes can fall behind
export const DEFAULT_DELTA_BLOCKS = 6
// milliseconds to consider a timeout transaction (10 secs)
export const DEFAULT_TIMEOUT_LIMIT = 5 * 1000

export enum Networks {
  Arbitrum = 'arbitrum',
  Optimism = 'optimism',
  Metis = 'metis',
  Starkware = 'starkware',
}

export type EVMNetworks = Exclude<Networks, Networks.Starkware>

const DEFAULT_ARBITRUM_RPC_ENDPOINT = 'https://arb1.arbitrum.io/rpc'
const DEFAULT_OPTIMISM_RPC_ENDPOINT = 'https://mainnet.optimism.io'
const DEFAULT_METIS_RPC_ENDPOINT = 'https://andromeda.metis.io/?owner=1088'

export const RPC_ENDPOINTS: Record<EVMNetworks, string | undefined> = {
  [Networks.Arbitrum]: util.getEnv('ARBITRUM_RPC_ENDPOINT') || DEFAULT_ARBITRUM_RPC_ENDPOINT,
  [Networks.Optimism]: util.getEnv('OPTIMISM_RPC_ENDPOINT') || DEFAULT_OPTIMISM_RPC_ENDPOINT,
  [Networks.Metis]: util.getEnv('METIS_RPC_ENDPOINT') || DEFAULT_METIS_RPC_ENDPOINT,
}

const DEFAULT_STARKWARE_SEQUENCER_ENDPOINT = 'https://alpha-mainnet.starknet.io'

export const SEQUENCER_ENDPOINTS: Record<Networks, string | undefined> = {
  [Networks.Arbitrum]: undefined,
  [Networks.Optimism]: undefined,
  [Networks.Metis]: undefined,
  [Networks.Starkware]:
    util.getEnv('STARKWARE_SEQUENCER_ENDPOINT') || DEFAULT_STARKWARE_SEQUENCER_ENDPOINT,
}

const DEFAULT_OPTIMISM_HEALTH_ENDPOINT = 'https://mainnet-sequencer.optimism.io/health'
const DEFAULT_METIS_HEALTH_ENDPOINT = 'https://tokenapi.metis.io/andromeda/health'
export const HEALTH_ENDPOINTS = {
  [Networks.Arbitrum]: {
    endpoint: util.getEnv('ARBITRUM_HEALTH_ENDPOINT'),
    responsePath: [],
  },
  [Networks.Optimism]: {
    endpoint: util.getEnv('OPTIMISM_HEALTH_ENDPOINT') || DEFAULT_OPTIMISM_HEALTH_ENDPOINT,
    responsePath: ['healthy'],
  },
  [Networks.Metis]: {
    endpoint: util.getEnv('METIS_HEALTH_ENDPOINT') || DEFAULT_METIS_HEALTH_ENDPOINT,
    responsePath: ['healthy'],
  },
  [Networks.Starkware]: {
    endpoint: util.getEnv('STARKWARE_HEALTH_ENDPOINT'),
    responsePath: [],
  },
}

export interface ExtendedConfig extends Config {
  delta: number
  deltaBlocks: number
  timeoutLimit: number
}

export const makeConfig = (prefix?: string): ExtendedConfig => {
  const isCacheEnabled = util.parseBool(util.getEnv('CACHE_ENABLED', undefined, adapterContext))
  if (isCacheEnabled) {
    throw new AdapterConfigError({ message: 'Cache cannot be enabled on this adapter' })
  }
  const config = Requester.getDefaultConfig(prefix)
  const delta = Number(util.getEnv('DELTA', prefix)) || DEFAULT_DELTA_TIME
  const deltaBlocks = Number(util.getEnv('DELTA_BLOCKS', prefix)) || DEFAULT_DELTA_BLOCKS
  const timeoutLimit = Number(util.getEnv('NETWORK_TIMEOUT_LIMIT', prefix)) || DEFAULT_TIMEOUT_LIMIT
  config.defaultEndpoint = DEFAULT_ENDPOINT
  return { ...config, delta, deltaBlocks, timeoutLimit }
}
