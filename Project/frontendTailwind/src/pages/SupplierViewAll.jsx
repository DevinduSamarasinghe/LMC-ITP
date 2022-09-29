import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Header } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import TableData from '../components/Table/TableData';
import TableHeader from '../components/Table/TableHeader';

const SupplierViewAll = () => {
		const { currentColor } = useStateContext();

		const[supplier, setSupplier] = useState([]);

		const getSupplier = async () => {
				axios.get("http://localhost:8070/supplier/")
				.then((res) => { 
						setSupplier(res.data); 
				})
				.catch((err) => {
						alert(err.message);
				})
		}

		useEffect(() => { 
				getSupplier();
		}, [])

		const deleteSupplier = async (id) => {
				await axios.delete(`http://localhost:8070/supplier/delete/${id}`)
				.then((res) => {
						alert("Data deleted successfully");
						getSupplier();
				})
				.catch((err) => {
						alert(err.message);
				})
		}

		return (
				<div>
					<div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl dark:bg-secondary-dark-bg dark:text-white">
						<Header category="Table" title="Supplier Details" />
						<div className="block w-full overflow-x-auto rounded-lg">
							<table className="w-full rounded-lg">
								<thead>
									<tr className="bg-slate-200 text-md h-12 dark:bg-slate-800">
										<TableHeader value="Company Name" />
										<TableHeader value="Contact Person" />
										<TableHeader value="Email" />
										<TableHeader value="Phone" />
										<TableHeader value="Address" />
										<TableHeader value="Product Details" />
										<TableHeader value="Lead Time" />
										<TableHeader value="Order Capacity" />
										<TableHeader value="Manage" />
									</tr>
								</thead>
								<tbody>
									{supplier.map((data) => (
										<tr className="text-sm h-10 border dark:border-slate-600">
											<TableData value={data.companyname} />
											<TableData value={data.contactPerson} />
											<TableData value={data.email} />
											<TableData value={data.phone} />
											<TableData value={data.address} />
											<TableData value={data.productDetails} />
											<TableData value={data.leadTime} />
											<TableData value={data.orderCapacity} />
		
											<td className="text-center px-3 align-middle border-l-0 border-r-0 text-m whitespace-nowrap p-3">
												{/*<Link to={`/supplier/supplierUpdate/${data._id}`}> */}
												<Link to={`/SupplierUpdate/${data._id}`}> 
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
														deleteSupplier(data._id);
													}}
												>
													<i className="fas fa-trash" />
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			);

}

export default SupplierViewAll;     


