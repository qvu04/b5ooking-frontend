/**
 * Chuẩn hóa Unicode địa chỉ
 */
function normalizeAddress(address: string): string {
    return address.normalize('NFC').trim();
}

/**
 * Tạo các biến thể địa chỉ để tăng cơ hội geocode thành công
 */
function generateAddressVariants(original: string): string[] {
    const base = normalizeAddress(original);
    return [
        base,
        base.replace(/\/\d+/, ''), // bỏ phần hẻm như 5/3 → 5
        base.replace(/Phường\s*\d+,?/gi, ''), // bỏ "Phường 3"
        base.replace(/^\d+\s*/, ''), // bỏ số nhà ở đầu
        base.replace(/Phường\s*\d+,?/gi, '').replace(/^\d+\s*/, ''), // kết hợp bỏ số nhà và phường
    ];
}

/**
 * Lấy toạ độ từ địa chỉ bằng Nominatim
 */
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
    const variants = generateAddressVariants(address);

    for (const variant of variants) {
        try {
            console.log('🔍 Thử geocode địa chỉ:', variant);

            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(variant)}`,
                {
                    headers: {
                        'Accept-Language': 'vi',
                        'User-Agent': 'hotel-booking-client',
                    },
                }
            );

            const data = await res.json();

            if (Array.isArray(data) && data.length > 0) {
                const result = {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon),
                };
                console.log('✅ Geocode thành công:', result);
                return result;
            }
        } catch (error) {
            console.error('❌ Lỗi khi gọi geocode API với:', variant, error);
        }
    }

    // 👉 Fallback: toạ độ trung tâm TP.HCM
    const fallback = {
        lat: 10.7769,
        lng: 106.7009,
    };
    console.warn('⚠️ Không tìm được kết quả geocode nào. Dùng fallback:', fallback);
    return fallback;
}
