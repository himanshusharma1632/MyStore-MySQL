import { Edit, Delete } from '@mui/icons-material';
import { Box, Typography, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch } from '../../app/REDUX/configureStore';
import CurrencyConvert from '../../app/util/CurrencyConverter';
import PaginationPage from '../../app/components/PaginationPage';
import { setProductParams } from '../catalog/catalogSlice';
import useProducts from '../../app/hooks/useProducts';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Product } from '../../app/models/product';
import ProductForm from './ProductForm';

export default function Inventory() {
const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
const [editMode, setEditMode] = useState<boolean>(false);
const { products, metaData } = useProducts();
const dispatch = useAppDispatch();   

// function 1
function handleSelectProduct (product : Product) {
 setSelectedProduct(product);
 setEditMode(true);
};

// function 2
function cancelEdit () {
 if (selectedProduct) setSelectedProduct(undefined);
 setEditMode(false);
}

//condition
if (editMode) return <ProductForm product = {selectedProduct} cancelEdit = {cancelEdit} />

    return (
        <>
            <Box display='flex' justifyContent='space-between' sx = {{mt : 10}}>
                <Typography sx={{ p: 2 }} variant='h4'>Inventory</Typography>
                <Button
                    sx={{ m: 2 }}
                    size='large' variant='contained'
                    onClick={() => setEditMode(true)}
                >
                    Create
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell align="left">Product</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="center">Type</TableCell>
                            <TableCell align="center">Brand</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow
                                key={product.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {product.id}
                                </TableCell>
                                <TableCell align="left">
                                    <Box display='flex' alignItems='center'>
                                        <img src={product.pictureUrl} alt={product.name} style={{ height: 50, marginRight: 20 }} />
                                        <Link to = {`/catalog/${product.id}`} 
                                         style = {{textDecoration : 'none'}}>
                                            <span>{product.name}</span>
                                        </Link>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">{CurrencyConvert(product.price)}</TableCell>
                                <TableCell align="center">{product.typeofProduct}</TableCell>
                                <TableCell align="center">{product.brand}</TableCell>
                                <TableCell align="center">{product.quantityInStock}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        startIcon={<Edit />}
                                        onClick={() => handleSelectProduct(product)}
                                    />
                                    <LoadingButton
                                        loading={false}
                                        startIcon={<Delete />} color='error'
                                        onClick={undefined}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {metaData &&
                <Box sx={{ pt: 2 }}>
                    <PaginationPage
                        metaData={metaData}
                        onPageChange={(page: number) => dispatch(setProductParams({ pageNumber: page }))}
                    />
                </Box>
            }
        </>
    )
}