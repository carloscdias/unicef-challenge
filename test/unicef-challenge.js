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
    price: 1.50,
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
      let result = dynamicPricing.allShortestPaths('A')
      expect(result['A'].value).to.equal(0)
    })

    it('should return an object with shortest paths to every node given a start node', () => {
      let result = dynamicPricing.allShortestPaths('A')
      expect(result).to.have.all.keys(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
    })

    it('should return min distance 11 for A -> F', () => {
      let result = dynamicPricing.allShortestPaths('A')
      expect(result['F'].value).to.equal(11)
    })
  })

  // Describe calculateTotalsInPath
  describe('#calculateTotalsInPath', () => {
    it('should have only keys "distance" and "demand" for origin', () => {
      let paths  = dynamicPricing.allShortestPaths('A')
      let result = dynamicPricing.calculateTotalsInPath(paths, item)
      expect(result['A']).to.have.keys(['distance', 'demand'])
    })

    it('should include key "test" for node "E" starting from "A"', () => {
      let paths  = dynamicPricing.allShortestPaths('A')
      let result = dynamicPricing.calculateTotalsInPath(paths, item)
      expect(result['E']).to.include.key('test')
    })
  })

  // Describe the calculate function
  describe('#calculate', () => {
    it('should calculate prices for every locations based on "item" present at node "A"', () => {
      let result = dynamicPricing.calculate(item, 'A')
      expect(result).to.have.all.keys(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
    })

    it('should add the distance value to the base price', () => {
      let result = dynamicPricing.calculate(item, 'A', {distance: 1, demand: 0})
      expect(result['F']).to.equal(item.price + 11)
    })

    it('should add the risk factor into account', () => {
      let result = dynamicPricing.calculate(item, 'A', {distance: 0, demand: 0, risk: 1})
      // shortest path from A to F is A -> B -> D -> F, total risk: 0.8
      expect(result['F']).to.equal(item.price + 0.8)
    })

    it('should add the demand for rice on node "B"', () => {
      let result = dynamicPricing.calculate(item, 'A', {distance: 0, demand: 1, risk: 0})
      expect(result['B']).to.equal(item.price + 0.7)
    })
  })

})
