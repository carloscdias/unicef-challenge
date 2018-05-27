const chai   = require('chai')
const expect = chai.expect
const { DynamicPricing } = require('../index.js')

// Tests for the dynamic pricing module
describe('DynamicPricing', () => {
  // map is a graph of connected nodes
  // where each node contains a store with all its data
  const map = require('./data/map.json')

  // example item to be priced across all stocks
  const item = {
    unitPrice: 1.50,
    name: 'Someone\'s rice',
    type: 'rice',
    unit: 'kg'
  }

  // instance with map
  let dynamicPricing = new DynamicPricing(map)

  // class instantiation
  it('should instantiate a DynamicPricing object based on a map', () => {
    expect(dynamicPricing).to.be.an.instanceof(DynamicPricing)
  })

  // Describe allShortestPaths method
  describe('#allShortestPaths', () => {
    it('should return min distance 0 for A -> A', () => {
      let result         = dynamicPricing.allShortestPaths('A')
      expect(result['A'].value).to.equal(0)
    })

    it('should return an object with shortest paths to every node given a start node', () => {
      let result         = dynamicPricing.allShortestPaths('A')
      expect(result).to.have.all.keys(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
    })

    it('should return min distance 11 for A -> F', () => {
      let result         = dynamicPricing.allShortestPaths('A')
      expect(result['F'].value).to.equal(11)
    })
  })

})
