// tests/utils/sorts.test.js
import { mapOrder } from '../../src/utils/sorts'

describe('mapOrder', () => {
  it('sắp xếp mảng theo đúng thứ tự columnOrderIds', () => {
    const columns = [{ _id: 'c2' }, { _id: 'c1' }, { _id: 'c3' }]
    const order = ['c1', 'c2', 'c3']
    const result = mapOrder(columns, order, '_id')
    expect(result.map(c => c._id)).toEqual(['c1', 'c2', 'c3'])
  })

  it('trả về mảng rỗng nếu thiếu tham số', () => {
    expect(mapOrder(null, ['c1'], '_id')).toEqual([])
  })
})