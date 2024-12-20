import { Divider, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { Fragment } from "react";
import { ShippingAddress } from "../../app/models/Order";
import Emphasizer from "../../app/util/Emphasizer";

interface Props{
    shippingAddress : ShippingAddress | undefined;
}

export default function ShipTo({shippingAddress} : Props){


    return(
        <Fragment>
        <TableContainer component={Paper} variant={'outlined'}>
                <Table>
                    {shippingAddress && 
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2} variant='head'>Delivery To</TableCell>
                            <TableCell align="right">{Emphasizer(shippingAddress.fullName)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2} variant='head'>Residency (Address Line 1)</TableCell>
                            <TableCell align="right">{Emphasizer(shippingAddress.address1)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2} variant='head'>LandMark Near Address</TableCell>
                            <TableCell align="right">{Emphasizer(shippingAddress.address2)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2} variant='head'>City</TableCell>
                            <TableCell align="right">{Emphasizer(shippingAddress.city)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2} variant='head'>State</TableCell>
                            <TableCell align="right">{Emphasizer(shippingAddress.state)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2} variant='head'>Zip code</TableCell>
                            <TableCell align="right">{shippingAddress.zipCode}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2} variant='head'>Country</TableCell>
                            <TableCell align="right">{Emphasizer(shippingAddress.country)}</TableCell>
                        </TableRow>
                    </TableBody>
                    }
                </Table>
            </TableContainer>
        </Fragment>
    )
}