import { Product } from "../../app/models/product";
import { Grid } from "@mui/material";
import ProductCard from "./ProductCard";
import { useAppSelector } from "../../app/REDUX/configureStore";
import SkeletonProductCard from "../../app/components/SkeletonProductCard";

interface Props {
    products: Product[];
}

export default function ProductList({ products }: Props) {
    const { loadedProducts } = useAppSelector(state => state.catalog);
    
    return (
        <>
                <Grid container spacing={4}>
                    {products.map(product => (
                        <Grid item xs={4} key={product.id}>
                            {!loadedProducts ? (
                                <SkeletonProductCard />
                            ) :
                                (
                                    <ProductCard product={product} />
                                )
                            }
                        </Grid>
                    ))}
                </Grid>
        </>
    )
}