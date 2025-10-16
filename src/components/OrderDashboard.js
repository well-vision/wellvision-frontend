import React, { useState, useMemo, useEffect, useCallback } from 'react';
import SidebarMenu from './SidebarMenu';
import './DashboardLayout.css'; // Adjust path if needed
import { Grid, Box, Typography, TextField, Paper, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from '@mui/x-data-grid';


const OrderLayout = ({ children, activePage, onNavigate }) => {
	
// Sample columns and initial rows for orders table
// helper: return badge styles for status
const getStatusBadge = (status) => {
	switch ((status || '').toLowerCase()) {
		case 'order received':
			return { bg: '#DBEAFE', color: '#1E3A8A' }; // blue
		case 'order place in lab':
			return { bg: '#FEF3C7', color: '#92400E' }; // amber
		case 'in lab proccessing':
			return { bg: '#FFF7ED', color: '#92400E' }; // light orange
		case 'transit to shop':
			return { bg: '#F3E8FF', color: '#6D28D9' }; // purple
		case 'ready for customer':
			return { bg: '#DCFCE7', color: '#166534' }; // green
		default:
			return { bg: '#F1F5F9', color: '#0F172A' }; // neutral
	}
};

const columns = [
	{ field: 'id', headerName: 'ID', width: 90 },
	{ field: 'orderNumber', headerName: 'Order #', width: 140 },
	{ field: 'customer', headerName: 'Customer', width: 200 },
	{ field: 'date', headerName: 'Date', width: 140 },
	{
		field: 'status',
		headerName: 'Status',
		width: 200,
		editable: true,
		type: 'singleSelect',
		// align with backend enum values
		valueOptions: ['Order Received', 'Order place in Lab', 'In lab proccessing', 'Transit to shop','Ready for customer'],
		renderCell: (params) => {
			const val = params.value || '';
			const { bg, color } = getStatusBadge(val);
			return (
				<Box sx={{
					backgroundColor: bg,
					color,
					px: 1.5,
					py: 0.5,
					borderRadius: '999px',
					fontSize: '0.85rem',
					fontWeight: 600,
					textTransform: 'none',
					display: 'inline-block',
				}}>{val}</Box>
			);
		}
	},
	{ field: 'total', headerName: 'Total', width: 120, type: 'number' },
];

// start with empty rows; we'll fetch from API
const initialRows = [];

		// local state for filter and rows (make rows editable)
		const [filter, setFilter] = useState('');
		const [rowsData, setRowsData] = useState(initialRows);
		const [loading, setLoading] = useState(false);

	// API base (use REACT_APP_API_URL if set, otherwise default to localhost:4000)
	const API_BASE = (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.replace(/\/$/, '')) || 'http://localhost:4000';

	// fetch orders from backend and map to grid rows
	const fetchOrders = useCallback(async () => {
			setLoading(true);
			try {
		const res = await fetch(`http://localhost:4000/api/orders`);
				if (!res.ok) throw new Error('Failed to fetch orders');
				const body = await res.json();
				if (!body.success) throw new Error(body.message || 'Failed to fetch');
				const mapped = (body.data || []).map(o => ({
					id: o._id,
					orderNumber: o.orderNumber,
					customer: o.customerName || o.customer || '',
					date: o.placedAt ? new Date(o.placedAt).toISOString().split('T')[0] : (o.date ? new Date(o.date).toISOString().split('T')[0] : ''),
					status: o.status || 'Order Received',
					total: typeof o.total === 'number' ? o.total : Number(o.total) || 0,
				}));
				setRowsData(mapped);
			} catch (err) {
				console.error('fetchOrders error', err);
				alert('Could not load orders');
			} finally {
				setLoading(false);
			}
		}, []);

		useEffect(() => {
			fetchOrders();
		}, [fetchOrders]);

		const rows = useMemo(() => {
			if (!filter) return rowsData;
			const q = filter.toLowerCase();
			return rowsData.filter(r =>
				String(r.orderNumber).toLowerCase().includes(q) ||
				String(r.customer).toLowerCase().includes(q) ||
				String(r.status).toLowerCase().includes(q)
			);
		}, [filter, rowsData]);

		// commit cell edit (update rowsData) with optimistic update and persist
		const handleCellEditCommit = async (params) => {
			const { id, field, value } = params;
			// optimistic update
			const prev = rowsData;
			setRowsData(prevRows => prevRows.map(r => (r.id === id ? { ...r, [field]: value } : r)));

			// persist status change to backend (only handle status field)
			if (field === 'status') {
				try {
					const res = await fetch(`${API_BASE}/api/orders/${id}/status`, {
						method: 'PATCH',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ status: value }),
					});
					const body = await res.json();
					if (!res.ok || !body.success) {
						throw new Error(body.message || 'Failed to update status');
					}
					// success: optionally update local row with returned value
					setRowsData(prevRows => prevRows.map(r => (r.id === id ? { ...r, status: body.data.status } : r)));
				} catch (err) {
					console.error('status update failed', err);
					alert('Failed to update status on server. Reverting.');
					// rollback
					setRowsData(prev);
				}
			}
		};

	return (
		<div className="dashboard-layout">
			<aside className="sidebar">
				<SidebarMenu active={activePage} onNavigate={onNavigate} />
			</aside>
			<main className="main-content">
				<Box sx={{ p: 2 }}>
					<Grid container spacing={2}>
							<Grid item xs={12}>
								<Paper className="sales-section" sx={{ p: 0 }}>
									<div className="sales-header" style={{ padding: 16 }}>
										<div className="sales-title">
											<Typography variant="h6" className="sales-title">Orders</Typography>
											<Typography variant="body2" color="text.secondary">View and manage orders.</Typography>
										</div>

										<div className="header-actions">
											<div className="search-container" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
												
												<Button
													className="header-btn"
													startIcon={<SearchIcon />}
													onClick={() => fetchOrders()}
												>
													Search
												</Button>
											</div>
											
										</div>
									</div>

												<Box sx={{ height: 420, width: '100%', mt: 2 }}>
													<DataGrid
														rows={rows}
														columns={columns}
														pageSizeOptions={[5, 10, 25]}
														initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
														disableRowSelectionOnClick
														getRowId={(row) => row.id}
														onCellEditCommit={handleCellEditCommit}
													/>
												</Box>
							</Paper>
						</Grid>
					</Grid>
				</Box>
			</main>
		</div>
	);
};

export default OrderLayout;
