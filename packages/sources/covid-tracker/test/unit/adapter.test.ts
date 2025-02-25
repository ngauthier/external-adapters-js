import { AdapterError, Requester } from '@chainlink/ea-bootstrap'
import { assertError } from '@chainlink/ea-test-helpers'
import { AdapterRequest } from '@chainlink/ea-bootstrap'
import { makeExecute } from '../../src/adapter'
import { TInputParameters } from '../../src/endpoint'

describe('execute', () => {
  const jobID = '1'
  const execute = makeExecute()

  describe('validation error', () => {
    const requests = [
      { name: 'empty data', testData: { data: {} } },
      {
        name: 'unknown date format',
        testData: { id: jobID, data: { resultPath: 'deaths', date: 'not_real' } },
      },
      {
        name: 'unknown date format 2',
        testData: { id: jobID, data: { resultPath: 'deaths', date: '2020111' } },
      },
      {
        name: 'date not found',
        testData: { id: jobID, data: { resultPath: 'deaths', date: '17601010' } },
      },
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
