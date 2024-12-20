import { useEffect } from "react";
import { productSelector, productsFetchAsync, fetchFilters } from "../../features/catalog/catalogSlice";
import { useAppSelector, useAppDispatch } from "../REDUX/configureStore";

export default function useProducts () {
    const products = useAppSelector(productSelector.selectAll);
    const { loadedProducts, filtersLoaded, brandList, typeList, metaData } = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();


    useEffect(() => {
        if (!loadedProducts) dispatch(productsFetchAsync());
    }, [loadedProducts, dispatch]);

    useEffect(() => {
        if (!filtersLoaded) dispatch(fetchFilters());
    }, [filtersLoaded, dispatch]);

return { products,
         brandList,
         typeList,
         metaData,
         loadedProducts,
         filtersLoaded
}}