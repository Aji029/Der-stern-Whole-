import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Edit, Trash2, FileText } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { EditablePrice } from '../../../../components/ui/EditablePrice';
import { ProfitMarginDisplay } from '../../../../components/ProfitMarginDisplay';
import { useOrders } from '../context/OrdersContext';
import { useSuppliers } from '../../../../context/SupplierContext';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { OrderPDF } from '../../../../components/OrderPDF';
import { validatePrices } from '../../../../utils/priceCalculations';
import { useNavigate } from 'react-router-dom';

const columnHelper = createColumnHelper<any>();

export function OrdersTable() {
  const navigate = useNavigate();
  const { orders, updateOrder, deleteOrder, selectedOrders, toggleOrderSelection } = useOrders();
  const { suppliers } = useSuppliers();

  const columns = React.useMemo(() => [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
        />
      ),
    }),
    columnHelper.accessor('customer.companyName', {
      header: 'Customer',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('orderDate', {
      header: 'Date',
      cell: info => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor('items', {
      header: 'Products',
      cell: info => (
        <div className="space-y-2">
          {info.getValue().map((item: any, index: number) => (
            <div key={index} className="flex flex-col space-y-2 py-2 border-b last:border-b-0">
              <div className="flex justify-between items-center">
                <span className="font-medium">{item.product.name}</span>
                <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="text-gray-500 mr-2">EK:</span>
                    <EditablePrice
                      value={item.ekPrice}
                      onChange={(value) => {
                        const updatedItems = [...info.row.original.items];
                        updatedItems[index] = {
                          ...item,
                          ekPrice: value,
                        };
                        updateOrder(info.row.original.id, {
                          ...info.row.original,
                          items: updatedItems,
                        });
                      }}
                    />
                  </div>
                  <div>
                    <span className="text-gray-500 mr-2">VK:</span>
                    <EditablePrice
                      value={item.vkPrice}
                      onChange={(value) => {
                        const updatedItems = [...info.row.original.items];
                        updatedItems[index] = {
                          ...item,
                          vkPrice: value,
                        };
                        updateOrder(info.row.original.id, {
                          ...info.row.original,
                          items: updatedItems,
                        });
                      }}
                    />
                  </div>
                  <ProfitMarginDisplay
                    ekPrice={item.ekPrice}
                    vkPrice={item.vkPrice}
                    mwst={item.product.mwst}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ),
    }),
    columnHelper.accessor('totalAmount', {
      header: 'Total',
      cell: info => `€${info.getValue().toFixed(2)}`,
    }),
    columnHelper.display({
      id: 'actions',
      cell: info => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/dashboard/orders/${info.row.original.id}/edit`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this order?')) {
                deleteOrder(info.row.original.id);
              }
            }}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
          <PDFDownloadLink
            document={<OrderPDF order={info.row.original} />}
            fileName={`order-${info.row.original.id}.pdf`}
          >
            {({ loading }) => (
              <Button
                variant="outline"
                size="sm"
                disabled={loading}
              >
                <FileText className="h-4 w-4 text-blue-500" />
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      ),
    }),
  ], [navigate, updateOrder, deleteOrder]);

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection: selectedOrders.reduce((acc, id) => ({ ...acc, [id]: true }), {}),
    },
    onRowSelectionChange: (updater) => {
      const newSelection = typeof updater === 'function' 
        ? updater(selectedOrders.reduce((acc, id) => ({ ...acc, [id]: true }), {}))
        : updater;
      toggleOrderSelection(Object.keys(newSelection).filter(id => newSelection[id]));
    },
  });

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}