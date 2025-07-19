import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { databaseService } from './database';

interface CSVImportResult {
  success: boolean;
  message: string;
  importedCount?: number;
}

export class CSVImportService {
  
  // Función principal para importar desde CSV
  static async importFromCSV(): Promise<CSVImportResult> {
    try {
      // Seleccionar archivo
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'application/json'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return { success: false, message: 'Importación cancelada' };
      }

      const file = result.assets[0];
      const fileContent = await FileSystem.readAsStringAsync(file.uri);

      if (file.mimeType === 'application/json' || file.name.endsWith('.json')) {
        return await this.importFromJSON(fileContent);
      } else {
        return await this.importFromCSVContent(fileContent, file.name);
      }

    } catch (error) {
      console.error('Error importing from CSV:', error);
      return { success: false, message: `Error al importar archivo: ${error}` };
    }
  }

  // Importar desde contenido JSON
  private static async importFromJSON(jsonContent: string): Promise<CSVImportResult> {
    try {
      const data = JSON.parse(jsonContent);
      const result = await databaseService.importDataFromJSON(data);
      
      return {
        success: result.success,
        message: result.message,
        importedCount: result.success ? 1 : 0
      };

    } catch (error) {
      return { success: false, message: `Error al procesar JSON: ${error}` };
    }
  }

  // Importar desde contenido CSV
  private static async importFromCSVContent(csvContent: string, fileName: string): Promise<CSVImportResult> {
    try {
      const lines = csvContent.trim().split('\n');
      if (lines.length < 2) {
        return { success: false, message: 'El archivo CSV debe tener al menos una fila de datos' };
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const dataRows = lines.slice(1);

      // Determinar tipo de datos basado en el nombre del archivo o headers
      if (fileName.toLowerCase().includes('usuario') || headers.includes('cedula')) {
        return await this.importUsersFromCSV(headers, dataRows);
      } else if (fileName.toLowerCase().includes('propiedad') || headers.includes('propertyNumber')) {
        return await this.importPropertiesFromCSV(headers, dataRows);
      } else if (fileName.toLowerCase().includes('transacci') || headers.includes('referencia')) {
        return await this.importTransactionsFromCSV(headers, dataRows);
      } else if (fileName.toLowerCase().includes('pago') || headers.includes('paymentMethod')) {
        return await this.importPaymentsFromCSV(headers, dataRows);
      } else {
        return { success: false, message: 'No se pudo determinar el tipo de datos del archivo CSV' };
      }

    } catch (error) {
      return { success: false, message: `Error al procesar CSV: ${error}` };
    }
  }

  // Importar usuarios desde CSV
  private static async importUsersFromCSV(headers: string[], dataRows: string[]): Promise<CSVImportResult> {
    const users = dataRows.map(row => {
      const values = row.split(',').map(v => v.trim().replace(/"/g, ''));
      const user: any = {};
      
      headers.forEach((header, index) => {
        user[header] = values[index] || '';
      });

      return {
        cedula: user.cedula || user.id || user.documento,
        password: user.password || user.contraseña || '123456',
        name: user.name || user.nombre || user.nombres?.split(' ')[0],
        fullName: user.fullName || user.nombreCompleto || user.nombres || `${user.nombre} ${user.apellido}`,
        email: user.email || user.correo || null,
        phone: user.phone || user.telefono || user.celular || null,
        isActive: user.isActive !== 'false' && user.activo !== 'false'
      };
    });

    const result = await databaseService.importDataFromJSON({ users });
    return {
      success: result.success,
      message: result.message,
      importedCount: users.length
    };
  }

  // Importar propiedades desde CSV
  private static async importPropertiesFromCSV(headers: string[], dataRows: string[]): Promise<CSVImportResult> {
    const properties = dataRows.map(row => {
      const values = row.split(',').map(v => v.trim().replace(/"/g, ''));
      const property: any = {};
      
      headers.forEach((header, index) => {
        property[header] = values[index] || '';
      });

      return {
        userCedula: property.userCedula || property.cedula || property.propietario,
        propertyNumber: property.propertyNumber || property.numero || property.predio,
        propertyType: property.propertyType || property.tipo || 'RESIDENCIAL',
        address: property.address || property.direccion || property.ubicacion,
        isActive: property.isActive !== 'false' && property.activo !== 'false'
      };
    });

    const result = await databaseService.importDataFromJSON({ properties });
    return {
      success: result.success,
      message: result.message,
      importedCount: properties.length
    };
  }

  // Importar transacciones desde CSV
  private static async importTransactionsFromCSV(headers: string[], dataRows: string[]): Promise<CSVImportResult> {
    const transactions = dataRows.map(row => {
      const values = row.split(',').map(v => v.trim().replace(/"/g, ''));
      const transaction: any = {};
      
      headers.forEach((header, index) => {
        transaction[header] = values[index] || '';
      });

      return {
        userCedula: transaction.userCedula || transaction.cedula || transaction.propietario,
        referencia: transaction.referencia || transaction.reference || transaction.id,
        estado: transaction.estado || transaction.status || 'Pendiente',
        fecha: transaction.fecha || transaction.date || new Date().toISOString(),
        valor: transaction.valor || transaction.amount || transaction.monto || '0',
        concepto: transaction.concepto || transaction.concept || 'Impuesto Predial',
        isApproved: transaction.isApproved === 'true' || transaction.aprobado === 'true' || transaction.estado === 'Aprobada'
      };
    });

    const result = await databaseService.importDataFromJSON({ transactions });
    return {
      success: result.success,
      message: result.message,
      importedCount: transactions.length
    };
  }

  // Importar pagos desde CSV
  private static async importPaymentsFromCSV(headers: string[], dataRows: string[]): Promise<CSVImportResult> {
    const payments = dataRows.map(row => {
      const values = row.split(',').map(v => v.trim().replace(/"/g, ''));
      const payment: any = {};
      
      headers.forEach((header, index) => {
        payment[header] = values[index] || '';
      });

      return {
        userCedula: payment.userCedula || payment.cedula,
        transactionReference: payment.transactionReference || payment.referencia,
        paymentMethod: payment.paymentMethod || payment.metodoPago || 'Efectivo',
        paymentDate: payment.paymentDate || payment.fechaPago || new Date().toISOString(),
        amount: payment.amount || payment.monto || '0',
        status: payment.status || payment.estado || 'completed',
        adminNotes: payment.adminNotes || payment.notas || null
      };
    });

    const result = await databaseService.importDataFromJSON({ payments });
    return {
      success: result.success,
      message: result.message,
      importedCount: payments.length
    };
  }

  // Generar plantillas CSV para descarga
  static generateCSVTemplate(type: 'users' | 'properties' | 'transactions' | 'payments'): string {
    switch (type) {
      case 'users':
        return 'cedula,password,name,fullName,email,phone,isActive\n' +
               '12345678,123456,Juan,Juan Pérez García,juan@email.com,+57 300 123 4567,true\n' +
               '87654321,123456,María,María González López,maria@email.com,+57 300 987 6543,true';

      case 'properties':
        return 'userCedula,propertyNumber,propertyType,address,isActive\n' +
               '12345678,890001,RESIDENCIAL,Calle 1 #2-3,true\n' +
               '87654321,890002,COMERCIAL,Carrera 4 #5-6,true';

      case 'transactions':
        return 'userCedula,referencia,estado,fecha,valor,concepto,isApproved\n' +
               '12345678,REF001,Pendiente,2025-01-15,COP $50000,Impuesto Predial,false\n' +
               '87654321,REF002,Aprobada,2025-01-10,COP $75000,Industria y Comercio,true';

      case 'payments':
        return 'userCedula,transactionReference,paymentMethod,paymentDate,amount,status,adminNotes\n' +
               '12345678,REF001,Efectivo,2025-01-16,50000,completed,Pago en ventanilla\n' +
               '87654321,REF002,Transferencia,2025-01-11,75000,completed,Pago en línea';

      default:
        return '';
    }
  }
}
