import { https } from "./configService"

export const reportService = async (fromDate: string, toDate: string) => {
    try {
        // Gọi API sinh PDF
        const response = await https.get(`/api/report/reportPdf`, {
            params: { fromDate, toDate },
            responseType: "blob", // 🔥 bắt buộc để nhận file PDF
        });
        // Tạo blob để tải về
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", `BaoCaoDoanhThu_${fromDate}_${toDate}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Lỗi tải PDF:", error);
    }
}