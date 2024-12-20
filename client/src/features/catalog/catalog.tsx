import { Grid, Paper } from "@mui/material";
import CheckboxButtons from "../../app/components/CheckboxButtons";
import PaginationPage from "../../app/components/PaginationPage";
import SortPage from "../../app/components/SortPage";
import Loading from "../../app/layout/Loading";
import { useAppDispatch, useAppSelector } from "../../app/REDUX/configureStore";
import { setProductParams } from "./catalogSlice";
import ProductList from "./ProductList";
import SearchPage from "./SearchPage";
import useProducts from "../../app/hooks/useProducts";

const sortList = [
    { value: 'name', label: 'Alphabatical' },
    { value: 'priceDesc', label: 'High To Low' },
    { value: 'price', label: 'Low To High' }
]

export default function Catalog() {

    const { products, brandList, typeList, filtersLoaded, metaData } = useProducts(); // custom reusable hook (products)
    const { productParams } = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();

    if (!filtersLoaded) return <Loading />;

    return (
        <>
            <Grid container columnSpacing={3} rowSpacing={1} sx={{ mt: 8 }}>
                <Grid item xs={3}>
                    <Paper sx={{ mt: 0, p: 2 }}>
                      <SearchPage />
                    </Paper>

                    <Paper sx={{ mt: 2, p: 2 }}>
                       <SortPage 
                        selectedValue={productParams.orderBy}
                        options={sortList}
                        onChange={(event) => dispatch(setProductParams({orderBy : event?.target.value}))}  />
                    </Paper>

                    <Paper sx={{ mt: 2, p: 2 }}>
                     <CheckboxButtons items={brandList} 
                     checked={productParams.brandList}
                     onChange={(items : string[]) => dispatch(setProductParams({brandList: items}))} />
                    </Paper>

                    <Paper sx={{ mt: 2, p: 2 }}>
                    <CheckboxButtons items={typeList} 
                     checked={productParams.typeList}
                     onChange={(items : string[]) => dispatch(setProductParams({typeList: items}))} />
                    </Paper>
                </Grid>

                <Grid item xs={9}>
                    <ProductList products={products} />
                </Grid>

                <Grid item xs={3} sx={{mb: 2}} />
              <Grid item xs ={9} sx={{mb: 2}} >
                  {metaData &&
              <PaginationPage
               onPageChange ={(page : number) => dispatch(setProductParams({pageNumber : page}))}
               metaData = {metaData}
              />
                  }
         </Grid>
      </Grid>
        </>
    )
}