/**
 * This class is responsible for calculating the price of a given
 * item across all other stocks accordingly with the given parameters
 */
class DynamicPricing {
  // store the map (graph)
  constructor(map) {
    this.map = map
  }

  // modified version of Dijkstra's algorithm
  // to calculate shortest distances between all nodes
  allShortestPaths(initialNode) {
    let visitedNodes   = new Set()
    let unvisitedNodes = new Set([initialNode])
    let nodesDistance  = Object.keys(this.map).reduce((acc, element) => {
      acc[element] = {
        value: Infinity,
        path: []
      }

      return acc
    }, {})

    // distance to initial node is zero
    nodesDistance[initialNode] = {
      value: 0,
      path: [initialNode]
    }

    // get next node
    const nextUnvisitedWithLowestDistance = () => {
      let next = Array.from(unvisitedNodes.entries()).map((el) => {
        return {
          node: el[0],
          distance: nodesDistance[el[0]]
        }
      }).reduce((last, current) => {
        return (last.distance.value < current.distance.value) ? last : current
      }, {distance: {value: Infinity}})


      return next.node
    }

    // while exists nodes to visit
    while (unvisitedNodes.size > 0) {
      let currentNode = nextUnvisitedWithLowestDistance()
      unvisitedNodes.delete(currentNode)
      visitedNodes.add(currentNode)

      // for each neighboor
      this.map[currentNode].neighboors.forEach((element) => {
        if (!visitedNodes.has(element.node)) {
          // for a big map it is possibly an overkill to calculate paths for all locations
          // we could add a limitation here to handle this situation if necessary, for example
          // limiting the distance in a given radius
          unvisitedNodes.add(element.node)
          if ((nodesDistance[currentNode].value + element.distance) < nodesDistance[element.node].value) {
            nodesDistance[element.node] = {
              value: nodesDistance[currentNode].value + element.distance,
              path: nodesDistance[currentNode].path.concat([element.node])
            }
          }
        }
      })

    }

    return nodesDistance
  }

  // get totals along the path
  calculateTotalsInPath(paths, item) {
    let totals = Object.keys(paths).reduce((acc, node) => {
      // default totals are distance and demand
      acc[node] = {
        distance: paths[node].value,
        demand: this.map[node].demands[item.type] || 0
      }

      // others factors have to be added up walking the path
      let previousNode = paths[node].path[0]
      let otherFactors = {}
      for (let i = 1; i < paths[node].path.length; i++) {
        let nextNode = paths[node].path[i]

        // get factors 
        let factors = this.map[previousNode].neighboors.filter((el) => el.node === nextNode)[0]

        // ignore distance and node from factors object
        Object.keys(factors).filter((el) => !['node', 'distance'].includes(el)).forEach((factor) => {
          // sum the other factors
          otherFactors[factor] = (otherFactors[factor] || 0) + factors[factor]
        })

        previousNode = nextNode
      }

      // assign all factors
      Object.assign(acc[node], otherFactors)

      return acc
    }, {})

    return totals
  }

  // calculate the price of the given item to every other store location
  // based on factors across the path
  calculate(item, baseLocation, modifiers = {}) {
    // make sure that distance and demand modifiers exists
    modifiers = Object.assign({distance: 0.1, demand: 0.1}, modifiers)

    // get shortest paths for all store locations
    let paths = this.allShortestPaths(baseLocation)

    // sum factors 
    let factors = this.calculateTotalsInPath(paths, item)

    // get all prices
    let prices = Object.keys(paths).reduce((acc, node) => {
      // Price(baseLocation, node) = basePrice + shortestPathDistance(baseLocation, node)*distanceModifier
      // + demand(node)*demandModifier + risk(baseLocation, node)*riskModifier + factor_n(baseLocation, node)*factor_n_modifier ...
      acc[node] = Object.keys(modifiers).reduce((sum, modifier) => {
        return (sum + (modifiers[modifier] * (factors[node][modifier] || 0)))
      }, item.price)

      return acc
    }, {})

    return prices
  }
}

// export class
module.exports = {
  DynamicPricing
}
