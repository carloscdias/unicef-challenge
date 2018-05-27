# UNICEF Innovation Challenge

This repository contains an algorithm to calculate the price of an item for a given location based on demand, distance and other factors.
Besides that, this prototype also describes one of the possibles architectures capable of abstracting items (trade goods in general) from its location and owner that could be used as the core concept for the idea, the model layer.

## Dynamic Pricing Algorithm

The pricing of an item can be calculated using the DynamicPricing class of this repository.
This class receives a **map** which is a graph containing all nodes and its connections, you can find an example of a map inside `test/data/map.json`.

**calculate** is the main method of this class. This method is responsible for calculating the price of a given item in a specific location based on its base price, distance between store location and buyers location, desarability of the item in the final location, among others factors.

The algorithm behavior is described below:

1. Given an item and its base location, visit each location considering the shortest path between the base location and the current location
2. For each store location, sum each factor along all the path needed to be traveled in the shortest path from base to destination
3. With the sum of all factors, calculate the price for each location using the expression: `Price(L1, L2) = basePrice + shortestPathDistance(L1, L2)*distanceModifier + demand(L2)*demandModifier + risk(L1, L2)*riskModifier + factor_n(L1, L2)*factor_n_modifier ...`

If the factors are values between 0 and 1, the modifiers can be thought as the maximum value that should be added to the price of the product based in its corresponding factor.


## Model UML

The image below describes one possible (simplified) implementation of the system.

![UML](https://github.com/carloscdias/unicef-challenge/raw/master/docs/unicef-challenge-uml.png "UML")

## How to use this repository

This repository is an [npm module](https://www.npmjs.com/) (not published).

You can run the tests using the command

```
npm test
``` 


