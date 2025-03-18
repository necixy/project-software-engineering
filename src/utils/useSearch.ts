// utils/useSearch.ts
import { useState, useEffect, useCallback } from 'react';
import { algoliasearch } from 'algoliasearch';
import { useAppSelector } from 'src/redux/reducer/reducer';


const useSearch = () => {
    const serverType = useAppSelector(state => state?.serverReducer?.baseUrl?.serverType)
    const appID = `283W8ZE4TM`;
    const apiKey = '731eb16d98dcf3a4dc6b520c85cda7fd';
    const indexName = `Vita${serverType}`;

    const index = algoliasearch(appID, apiKey);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [randomSearch, setRandomSearch] = useState([]); // For initial display or no-query results

    const search = useCallback(async () => {
        if (!searchQuery) return;

        setIsLoading(true);
        try {
            const { hits } = await index.searchSingleIndex({
                indexName, searchParams: { query: searchQuery },
            });
            console.log(hits, "hits")
            setSearchResult(hits);
            setHasSearched(true);
        } catch (error) {
            console.error("Error fetching search results from Algolia:", error);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        if (searchQuery.length === 0) {
            setSearchResult([]);
            setHasSearched(false);
        }
    }, [searchQuery]);

    return {
        searchResult,
        search,
        searchQuery,
        setSearchQuery,
        randomSearch, // To be set with any default or popular data if needed
        hasSearched,
        isLoading,
    };
};

export default useSearch;
