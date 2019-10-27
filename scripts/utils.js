const rectIntersect = (
    minAx, maxAx, minAy, maxAy,
    minBx, maxBx, minBy, maxBy
) => maxAx >= minBx && minAx <= maxBx && minAy <= maxBy && maxAy >= minBy;