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

      let neighboors = this.map[currentNode]
      neighboors.forEach((element) => {
        if (!visitedNodes.has(element.node)) {
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

  //
  calculate(item, baseLocation) {
    
  }
}

// export class
module.exports = {
  DynamicPricing
}
