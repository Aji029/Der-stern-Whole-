import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { formatDateForDisplay } from '../../../../utils/dateFormatting';
import type { GroupedOrders } from '../../hooks/useTodaysPick';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  supplierSection: {
    marginBottom: 20,
  },
  supplierName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    backgroundColor: '#f3f4f6',
    padding: 8,
  },
  item: {
    marginBottom: 8,
    paddingLeft: 10,
  },
  itemName: {
    fontSize: 12,
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 10,
    color: '#666',
  },
});

interface TodaysPickPDFProps {
  groupedOrders: GroupedOrders[];
  selectedDate: string;
}

export function TodaysPickPDF({ groupedOrders, selectedDate }: TodaysPickPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Picking List</Text>
        <Text style={styles.date}>
          Date: {formatDateForDisplay(selectedDate)}
        </Text>

        {groupedOrders.map((group) => (
          <View key={group.supplierId} style={styles.supplierSection}>
            <Text style={styles.supplierName}>
              {group.supplierName} ({group.items.length} items)
            </Text>

            {group.items.map((item, index) => (
              <View key={`${item.product.artikelNr}-${index}`} style={styles.item}>
                <Text style={styles.itemName}>
                  {item.product.name}
                </Text>
                <Text style={styles.itemDetails}>
                  Art. Nr: {item.product.artikelNr} - Quantity: {item.quantity}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
}