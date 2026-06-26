import { describe, it, expect } from 'vitest'
import { recipes } from './recipes.js'

describe('recipes', () => {
  it('keeps layer totals at 100 percent', () => {
    for (const [recipeId, recipe] of Object.entries(recipes)) {
      for (const [type, spec] of Object.entries(recipe.specs)) {
        const totalHeight = spec.layers.reduce((sum, layer) => sum + layer.height, 0)
        expect(totalHeight, `${recipeId}:${type} should sum to 100`).toBe(100)
      }
    }
  })

  it('defines a main step for each rendered layer', () => {
    for (const [recipeId, recipe] of Object.entries(recipes)) {
      for (const [type, spec] of Object.entries(recipe.specs)) {
        const mainLayerIndexes = new Set(
          spec.steps
            .filter((step) => step.target === 'main' && Number.isInteger(step.layerIndex))
            .map((step) => step.layerIndex)
        )

        spec.layers.forEach((_, index) => {
          expect(mainLayerIndexes.has(index), `${recipeId}:${type} missing main step for layer ${index}`).toBe(true)
        })
      }
    }
  })
})
