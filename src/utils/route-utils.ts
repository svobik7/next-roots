/**
 * Checks if given route segment is static
 * @param {string} segment - The route segment
 * @returns {boolean} - Whether the segment is static
 */

import type { Route, RouterSchema, RoutesPrioritiesMap } from '~/types'

export function isStaticRouteSegment(segment: string): boolean {
  return !segment.includes('[')
}

/**
 * Checks if given route segment is catch-all
 * @param {string} segment - The route segment
 * @returns {boolean} - Whether the segment is catch-all
 */

export function isCatchAllRouteSegment(segment: string): boolean {
  return segment.includes('...')
}

/**
 * Checks if given route segment is dynamic
 * @param {string} segment - The route segment
 * @returns {boolean} - Whether the segment is dynamic
 */

export function isDynamicRouteSegment(segment: string): boolean {
  return segment.includes('[') && !isCatchAllRouteSegment(segment)
}

/**
 * Gets priority of a route segment based on its nature
 * @param {string} segment - The route segment
 * @returns {number} - The priority of the segment
 */

export function getRouteSegmentPriority(segment: string): number {
  if (isStaticRouteSegment(segment)) {
    return 1
  } else if (isDynamicRouteSegment(segment)) {
    return 2
  } else if (isCatchAllRouteSegment(segment)) {
    return 3
  }
  return 0
}

/**
 * Computes priority of a route based on its segments nature
 * @param {Route} route - The route to compute priority for
 * @returns {number} - The priority of the route
 */

export function computeRoutePriority(route: Route): number {
  const segments = route.name.split('/').filter((segment) => segment.length > 0) // filter out empty segments
  let priority = '0.'
  for (const segment of segments) {
    const segmentPriority = getRouteSegmentPriority(segment)
    priority += segmentPriority
  }
  return parseFloat(priority)
}

/**
 * Creates a map of route priorities based on the routing schema
 * @param {RouterSchema} schema - The routing schema
 * @returns {RoutesPrioritiesMap} - The map of route priorities
 */

export function createRoutesPrioritiesMap(
  schema: RouterSchema
): RoutesPrioritiesMap {
  const routesPrioritiesMap: RoutesPrioritiesMap = {}
  const routes = schema.routes[schema.defaultLocale] || [] // No need to create a map for each locale as the names are the same

  for (const route of routes) {
    routesPrioritiesMap[route.name] = computeRoutePriority(route)
  }

  return routesPrioritiesMap
}
