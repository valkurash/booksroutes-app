import { findResultsState } from 'react-instantsearch-dom/server'
import algoliasearch from 'algoliasearch/lite'

const indexName = 'booksroutes'

const searchClient = algoliasearch(
  'HXS621I9TQ',
  '9c357884c8d5be0691ca27c01c7fdbe1'
)

export { findResultsState, indexName, searchClient }
