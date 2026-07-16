import Fuse from 'fuse.js'
import portfolioData from '../data/portfolio.json'

type PortfolioEntry = {
  id: string
  category: string
  keywords: string[]
  question: string
  answer: string
}

const fuse = new Fuse(portfolioData as PortfolioEntry[], {
  keys: [
    { name: 'keywords', weight: 2 },
    { name: 'question', weight: 1.5 },
    { name: 'category', weight: 1 },
    { name: 'answer', weight: 0.5 },
  ],
  threshold: 0.4,
  includeScore: true,
  minMatchCharLength: 2,
})

export function searchPortfolio(query: string): string | null {
  const results = fuse.search(query)
  if (results.length === 0) return null

  const best = results[0]
  if (best.score && best.score > 0.6) return null

  return best.item.answer
}

export function getPortfolioContext(): string {
  return (portfolioData as PortfolioEntry[])
    .map((entry) => `${entry.category.toUpperCase()}: ${entry.answer}`)
    .join('\n\n')
}
