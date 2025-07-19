import * as XLSX from 'xlsx';

// Deklarasi modul untuk membantu TypeScript mengenali autoTable
declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
    }
}

function convertDataToFlatArray(data: any[], keys: string[]): any[][] {
    const flatData: any[][] = [];

    data.forEach(row => {
        const rowData: any[] = [];
        keys.forEach(key => {
            let value;
            // Tangani properti bersarang (misalnya, "patient.name")
            if (key.includes('.')) {
                const parts = key.split('.');
                let current = row;
                for (const part of parts) {
                    if (current && typeof current === 'object' && part in current) {
                        current = current[part];
                    } else {
                        current = undefined; // Jika ada bagian path yang hilang, nilai menjadi undefined
                        break;
                    }
                }
                value = current;
            } else {
                value = row[key];
            }

            // Format bidang tertentu (tanggal, placeholder tanda tangan)
            if (['consentDate', 'birthDate', 'date'].includes(key) && value) {
                try {
                    // Pastikan value adalah tanggal yang valid sebelum memformat
                    const dateObj = new Date(value);
                    value = isNaN(dateObj.getTime()) ? String(value) : dateObj.toLocaleDateString("id-ID");
                } catch (e) {
                    value = String(value); // Fallback ke string jika parsing tanggal gagal
                }
            } else if (key === 'signatureData') {
                value = value ? 'Tanda Tangan Tersedia' : 'Tidak Ada Tanda Tangan';
            }
            rowData.push(value !== undefined && value !== null ? String(value) : ''); // Pastikan nilai adalah string
        });
        flatData.push(rowData);
    });
    return flatData;
}

export const exportToCsv = (data: any[], filename: string, headers: string[], keys: string[]) => {
    const bodyData = convertDataToFlatArray(data, keys);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...bodyData]); // Tambahkan header secara eksplisit untuk CSV
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${filename}.csv`);
};

export const exportToExcel = (data: any[], filename: string, headers: string[], keys: string[]) => {
    const bodyData = convertDataToFlatArray(data, keys);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...bodyData]); // Tambahkan header secara eksplisit untuk Excel
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${filename}.xlsx`);
};
