import { JSONSchema4 } from 'json-schema'
import winston from 'winston'
import { MAX_CONCURRENT_RESPONSE_TIME_CHECKS } from '../services/networking/NetworkingService'

export const bytesizeUnits = ['B', 'K', 'M', 'G', 'T']
export const bytesizeRegex = new RegExp(`^[0-9]+(${bytesizeUnits.join('|')})$`)

export const configSchema: JSONSchema4 = {
  title: 'Distributor node configuration',
  description: 'Configuration schema for distirubtor CLI and node',
  type: 'object',
  required: ['id', 'endpoints', 'directories', 'buckets', 'keys', 'port', 'workerId', 'limits', 'intervals'],
  additionalProperties: false,
  properties: {
    id: {
      type: 'string',
      description: 'Node identifier used when sending elasticsearch logs and exposed on /status endpoint',
      minLength: 1,
    },
    endpoints: {
      type: 'object',
      description: 'Specifies external endpoints that the distributor node will connect to',
      additionalProperties: false,
      required: ['queryNode', 'joystreamNodeWs'],
      properties: {
        queryNode: {
          description: 'Query node graphql server uri (for example: http://localhost:8081/graphql)',
          type: 'string',
        },
        joystreamNodeWs: {
          description: 'Joystream node websocket api uri (for example: ws://localhost:9944)',
          type: 'string',
        },
      },
    },
    directories: {
      type: 'object',
      required: ['assets', 'cacheState'],
      additionalProperties: false,
      description: "Specifies paths where node's data will be stored",
      properties: {
        assets: {
          description: 'Path to a directory where all the cached assets will be stored',
          type: 'string',
        },
        cacheState: {
          description:
            'Path to a directory where information about the current cache state will be stored (LRU-SP cache data, stored assets mime types etc.)',
          type: 'string',
        },
      },
    },
    logs: {
      type: 'object',
      additionalProperties: false,
      description: 'Specifies the logging configuration',
      properties: {
        file: {
          oneOf: [
            {
              type: 'object',
              additionalProperties: false,
              required: ['level', 'path'],
              description: 'File logging options',
              properties: {
                level: { $ref: '#/definitions/logLevel' },
                path: {
                  description: 'Path where the logs will be stored (absolute or relative to config file)',
                  type: 'string',
                },
                maxFiles: {
                  description: 'Maximum number of log files to store',
                  type: 'integer',
                  minimum: 1,
                },
                maxSize: {
                  description: 'Maximum size of a single log file in bytes',
                  type: 'integer',
                  minimum: 1024,
                },
                frequency: {
                  description: 'The frequency of creating new log files (regardless of maxSize)',
                  default: 'daily',
                  type: 'string',
                  enum: ['yearly', 'monthly', 'daily', 'hourly'],
                },
                archive: {
                  description: 'Whether to archive old logs',
                  default: false,
                  type: 'boolean',
                },
              },
            },
            {
              type: 'string',
              enum: ['off'],
            },
          ],
        },
        console: {
          oneOf: [
            {
              type: 'object',
              additionalProperties: false,
              required: ['level'],
              description: 'Console logging options',
              properties: {
                level: { $ref: '#/definitions/logLevel' },
              },
            },
            {
              type: 'string',
              enum: ['off'],
            },
          ],
        },
        elastic: {
          oneOf: [
            {
              type: 'object',
              additionalProperties: false,
              required: ['level', 'endpoint'],
              description: 'Elasticsearch logging options',
              properties: {
                level: { $ref: '#/definitions/logLevel' },
                endpoint: {
                  description: 'Elastichsearch endpoint to push the logs to (for example: http://localhost:9200)',
                  type: 'string',
                },
              },
            },
            {
              type: 'string',
              enum: ['off'],
            },
          ],
        },
      },
    },
    limits: {
      type: 'object',
      required: [
        'storage',
        'maxConcurrentStorageNodeDownloads',
        'maxConcurrentOutboundConnections',
        'outboundRequestsTimeoutMs',
        'pendingDownloadTimeoutSec',
      ],
      description: 'Specifies node limits w.r.t. storage, outbound connections etc.',
      additionalProperties: false,
      properties: {
        storage: {
          description: 'Maximum total size of all (cached) assets stored in `directories.assets`',
          type: 'string',
          pattern: bytesizeRegex.source,
        },
        maxConcurrentStorageNodeDownloads: {
          description: 'Maximum number of concurrent downloads from the storage node(s)',
          type: 'integer',
          minimum: 1,
        },
        maxConcurrentOutboundConnections: {
          description:
            'Maximum number of total simultaneous outbound connections to storage node(s) (excluding proxy connections)',
          type: 'integer',
          minimum: 1,
        },
        outboundRequestsTimeoutMs: {
          description: 'Timeout for all outbound storage node http requests in miliseconds',
          type: 'integer',
          minimum: 1000,
        },
        pendingDownloadTimeoutSec: {
          description: 'Timeout for pending storage node downloads in seconds',
          type: 'integer',
          minimum: 60,
        },
        maxCachedItemSize: {
          description: 'Maximum size of a data object allowed to be cached by the node',
          type: 'string',
          pattern: bytesizeRegex.source,
        },
        dataObjectSourceByObjectIdTTL: {
          description:
            'TTL (in seconds) for dataObjectSourceByObjectId cache used when proxying objects of size greater than maxCachedItemSize to the right storage node. Defaults to `60` if not specified.',
          type: 'integer',
          minimum: 1,
        },
      },
    },
    intervals: {
      type: 'object',
      required: ['saveCacheState', 'checkStorageNodeResponseTimes', 'cacheCleanup'],
      additionalProperties: false,
      description: 'Specifies how often periodic tasks (for example cache cleanup) are executed by the node.',
      properties: {
        saveCacheState: {
          description:
            'How often, in seconds, will the cache state be saved in `directories.state`. ' +
            'Independently of the specified interval, the node will always try to save cache state before exiting.',
          type: 'integer',
          minimum: 1,
        },
        checkStorageNodeResponseTimes: {
          description:
            'How often, in seconds, will the distributor node attempt to send requests to all current storage node endpoints ' +
            'in order to check how quickly they respond. ' +
            `The node will never make more than ${MAX_CONCURRENT_RESPONSE_TIME_CHECKS} such requests concurrently.`,
          type: 'integer',
          minimum: 1,
        },
        cacheCleanup: {
          description:
            'How often, in seconds, will the distributor node fetch data about all its distribution obligations from the query node ' +
            'and remove all the no-longer assigned data objects from local storage and cache state',
          type: 'integer',
          minimum: 1,
        },
      },
    },
    port: { description: 'Distributor node http api port', type: 'integer', minimum: 0 },
    keys: {
      description: 'Specifies the keys available within distributor node CLI.',
      type: 'array',
      items: {
        oneOf: [
          {
            type: 'object',
            title: 'Substrate uri',
            description: "Keypair's substrate uri (for example: //Alice)",
            required: ['suri'],
            additionalProperties: false,
            properties: {
              type: { type: 'string', enum: ['ed25519', 'sr25519', 'ecdsa'], default: 'sr25519' },
              suri: { type: 'string' },
            },
          },
          {
            type: 'object',
            title: 'Mnemonic phrase',
            description: 'Menomonic phrase',
            required: ['mnemonic'],
            additionalProperties: false,
            properties: {
              type: { type: 'string', enum: ['ed25519', 'sr25519', 'ecdsa'], default: 'sr25519' },
              mnemonic: { type: 'string' },
            },
          },
          {
            type: 'object',
            title: 'JSON backup file',
            description: 'Path to JSON backup file from polkadot signer / polakdot/apps (relative to config file path)',
            required: ['keyfile'],
            additionalProperties: false,
            properties: {
              keyfile: { type: 'string' },
            },
          },
        ],
      },
      minItems: 1,
    },
    buckets: {
      description: 'Specifies the buckets distributed by the node',
      oneOf: [
        {
          title: 'Bucket ids',
          description: 'List of distribution bucket ids',
          type: 'array',
          items: { type: 'integer', minimum: 0 },
          minItems: 1,
        },
        {
          title: 'All buckets',
          description: 'Distribute all buckets assigned to worker specified in `workerId`',
          type: 'string',
          enum: ['all'],
        },
      ],
    },
    workerId: {
      description: 'ID of the node operator (distribution working group worker)',
      type: 'integer',
      minimum: 0,
    },
  },
  definitions: {
    logLevel: {
      description: 'Minimum level of logs sent to this output',
      type: 'string',
      enum: [...Object.keys(winston.config.npm.levels)],
    },
  },
}

export default configSchema
