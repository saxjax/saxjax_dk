import { Point } from "../../app/model/point"

export const convexHull = (points:Point[]):Point[] => {
  console.log("convexHull not implemented")
  let xsortedPoints = [...points]
  let ysortedPoints = [...points]

  const compareXFn = (a:Point,b:Point)=>{
    if(a.x>b.x){
      return -1
    }
    if(a.x<b.x){
      return 1
    }
    return 0
  }

  const compareYFn = (a:Point,b:Point)=>{
    if(a.y>b.y){
      return -1
    }
    if(a.y<b.y){
      return 1
    }
    return 0
  }

  xsortedPoints.sort(compareXFn)
  const xMax = xsortedPoints[xsortedPoints.length - 1]
  const xMin = xsortedPoints[0]
  ysortedPoints.sort(compareYFn)
  const yMax = ysortedPoints[ysortedPoints.length - 1]
  const yMin = ysortedPoints[0]

  return points
}
