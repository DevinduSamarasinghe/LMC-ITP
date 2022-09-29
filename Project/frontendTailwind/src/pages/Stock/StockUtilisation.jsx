import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Header } from '../../components';
import { useStateContext } from '../../contexts/ContextProvider';
import TableData from '../../components/Table/TableData';
import TableHeader from '../../components/Table/TableHeader';

function StockUtilisation() {
    const { currentColor } = useStateContext();

    const [stock, setStock] = useState([]); //stock is the state variable and setStock is the function to update the state variable
    const [searchTerm, setSearchTerm] = useState("");

    const getStock = async () => {  //getStock is the function to get the data from the backend
        axios.get("http://localhost:8070/stock")
            .then((res) => {
                setStock(res.data); //setStock is used to update the state variable
                console.log(res.data);
            })
            .catch((err) => {
                alert(err.message);
            })
    }

    const id = useParams();

    const deleteStock = async (id) => {
        await axios.delete('http://localhost:8070/stock/delete/' + id)
            .then(() => {
                alert("Data deleted successfully");
                getStock();
            })
            .catch((err) => {
                alert(err.message);
            })
    }

    useEffect(() => { //useEffect is used to call the function getStock
        getStock();
    }, [])



    return (

        <div>
            {/* <Link to={'/generatePDF'}>
                <button type="button" class="btn btn-primary" style={{ marginLeft: "89%" }}>Generate PDF</button>
            </Link> */}
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl dark:bg-secondary-dark-bg dark:text-white">
                <Header category="Table" title="Stocks Utilisation" />
                <div className="block w-full overflow-x-auto rounded-lg">
                    <table className="w-full rounded-lg">
                        <thead>
                            <tr className="bg-slate-200 text-md h-12 dark:bg-slate-800">
                                <TableHeader value="Code" />
                                <TableHeader value="Name" />
                                <TableHeader value="Category" />
                                <TableHeader value="Last updated" />
                                <TableHeader value="Quantity" />
                                <TableHeader value="Reorder level" />
                                <TableHeader value="Availability" />
                                <TableHeader value="Manage" />
                            </tr>
                        </thead>
                        <tbody>
                            {stock.filter((data) => {
                                if (searchTerm == "") {
                                    return data;
                                } else if (data.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                                    return data;
                                }
                            }).map((data, key) => {//map is used to iterate the array
                                const date = new Date(data.lastUpdated).toISOString().split('T')[0];

                                return (
                                    <tr className="text-sm h-10 border dark:border-slate-600">
                                        <TableData value={data.stockCode} />
                                        <TableData value={data.stockName} />
                                        <TableData value={data.stockCategory} />
                                        <TableData value={date} />
                                        <TableData value={data.quantity} />
                                        <TableData value={data.reorderLevel} />
                                        <TableData value={data.sufficientStock} />

                                        <td className="text-center px-3 align-middle border-l-0 border-r-0 text-m whitespace-nowrap p-3">
                                            <Link to={`/StockUpdate/${data._id}`}>
                                                <button
                                                    type="button"
                                                    className="font-bold py-1 px-4 rounded-full mx-3 text-white"
                                                    style={{ background: currentColor }}
                                                >
                                                    <i className="fas fa-edit" />
                                                </button>
                                            </Link>
                                            <button
                                                type="button"
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 ml-2 rounded-full"
                                                onClick={() => {
                                                    deleteStock(data._id);
                                                }}
                                            >
                                                <i className="fas fa-trash" />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    )
}

export default StockUtilisation