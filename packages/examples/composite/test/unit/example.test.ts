import { AdapterError, AdapterRequest, Requester } from '@chainlink/ea-bootstrap'
import { assertError } from '@chainlink/ea-test-helpers'
import { makeExecute } from '../../src/adapter'
import { makeConfig } from '../../src/config'
import { TInputParameters } from '../../src/endpoint'

describe('execute', () => {
  const jobID = '1'
  process.env.ADAPTER_URL = 'coingecko'
  const execute = makeExecute(makeConfig())

  describe('validation error', () => {
    const requests = [
      { name: 'empty body', testData: {} },
      { name: 'empty data', testData: { data: {} } },
    ]

    requests.forEach((req) => {
      it(`${req.name}`, async () => {
        try {
          await execute(req.testData as AdapterRequest<TInputParameters>, {})
        } catch (error) {
          const errorResp = Requester.errored(jobID, error as AdapterError)
          assertError({ expected: 400, actual: errorResp.statusCode }, errorResp, jobID)
        }
      })
    })
  })
})
