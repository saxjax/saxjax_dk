import { Point } from '../../app/model/point'

// Helper function to calculate the cross product of three points (O, A, B)
const crossProduct = (O: Point, A: Point, B: Point): number => {
  return (A.x - O.x) * (B.y - O.y) - (A.y - O.y) * (B.x - O.x)
}

// Convex Hull function using Graham's scan
export const convexHull = (points: Point[]): Point[] => {
  if (points.length < 3) {
    console.log('Convex hull not applicable: fewer than 3 points')
    return points
  }

  // Sort points by x-coordinate, then by y-coordinate
  const sortedPoints = [...points].sort((a, b) => {
    if (a.x !== b.x) return a.x - b.x
    return a.y - b.y
  })

  // Build the lower hull
  const lowerHull: Point[] = []
  for (const point of sortedPoints) {
    while (
      lowerHull.length >= 2 &&
      crossProduct(lowerHull[lowerHull.length - 2], lowerHull[lowerHull.length - 1], point) <= 0
    ) {
      lowerHull.pop()
    }
    lowerHull.push(point)
  }

  // Build the upper hull
  const upperHull: Point[] = []
  for (let i = sortedPoints.length - 1; i >= 0; i--) {
    const point = sortedPoints[i]
    while (
      upperHull.length >= 2 &&
      crossProduct(upperHull[upperHull.length - 2], upperHull[upperHull.length - 1], point) <= 0
    ) {
      upperHull.pop()
    }
    upperHull.push(point)
  }

  // Remove the last point of each half because it's repeated at the start of the other half
  upperHull.pop()
  lowerHull.pop()

  // Concatenate lower and upper hull to get the full convex hull
  return lowerHull.concat(upperHull)
}
