// Page sizes at 300 DPI
export const PAGE_SIZES = [
    { id: '4x6', label: '4×6"', desc: 'Most common studio size', widthInch: 4, heightInch: 6, widthPx: 1200, heightPx: 1800, minPhotos: 10 },
    { id: 'a4', label: 'A4', desc: 'Bulk passport sheet', widthInch: 8.27, heightInch: 11.69, widthPx: 2480, heightPx: 3508, minPhotos: 42 },
];

// Helper to load an image from a data URL
const loadImage = (src) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
});

// imageSources can be a single string or an array of strings
export const generatePhotoSheet = async (imageSources, docType, pageSize = PAGE_SIZES[0]) => {
    // Normalize to array
    const sources = Array.isArray(imageSources) ? imageSources : [imageSources];

    // Load all images
    const loadedImages = await Promise.all(sources.map(src => loadImage(src)));

    const canvas = document.createElement('canvas');
    canvas.width = pageSize.widthPx;
    canvas.height = pageSize.heightPx;
    const ctx = canvas.getContext('2d');

    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate photo dimensions in pixels at 300 DPI
    let basePhotoW, basePhotoH;

    if (docType.physicalUnit === 'mm') {
        basePhotoW = Math.round((docType.physicalWidth / 25.4) * 300);
        basePhotoH = Math.round((docType.physicalHeight / 25.4) * 300);
    } else if (docType.physicalUnit === 'in') {
        basePhotoW = Math.round(docType.physicalWidth * 300);
        basePhotoH = Math.round(docType.physicalHeight * 300);
    } else {
        basePhotoW = docType.width;
        basePhotoH = docType.height;
    }

    // Minimum photos target per page size
    const MIN_PHOTOS = pageSize.minPhotos || 10;
    const GAP = 16;
    const BORDER = 3;
    const MARGIN = 12;
    const usableW = pageSize.widthPx - MARGIN * 2;
    const usableH = pageSize.heightPx - MARGIN * 2;

    // Try to fit at least MIN_PHOTOS by scaling down if needed
    let photoWidthPx = basePhotoW;
    let photoHeightPx = basePhotoH;
    let cols, rows;

    // First ensure photo fits on page at all
    if (photoWidthPx > usableW * 0.45) {
        const scale = (usableW * 0.45) / photoWidthPx;
        photoWidthPx = Math.round(photoWidthPx * scale);
        photoHeightPx = Math.round(photoHeightPx * scale);
    }

    // Iteratively scale down until we hit the minimum photo count
    for (let attempt = 0; attempt < 20; attempt++) {
        cols = Math.floor((usableW + GAP) / (photoWidthPx + GAP));
        rows = Math.floor((usableH + GAP) / (photoHeightPx + GAP));
        if (cols * rows >= MIN_PHOTOS) break;
        photoWidthPx = Math.round(photoWidthPx * 0.95);
        photoHeightPx = Math.round(photoHeightPx * 0.95);
    }

    // Center the grid on the page
    const totalGridWidth = cols * photoWidthPx + (cols - 1) * GAP;
    const totalGridHeight = rows * photoHeightPx + (rows - 1) * GAP;
    const offsetX = Math.floor((pageSize.widthPx - totalGridWidth) / 2);
    const offsetY = Math.floor((pageSize.heightPx - totalGridHeight) / 2);

    // Draw photos — cycle through loaded images
    let photoIdx = 0;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = offsetX + col * (photoWidthPx + GAP);
            const y = offsetY + row * (photoHeightPx + GAP);

            const img = loadedImages[photoIdx % loadedImages.length];
            ctx.drawImage(img, x, y, photoWidthPx, photoHeightPx);

            // Add black border around each photo
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = BORDER;
            ctx.strokeRect(x, y, photoWidthPx, photoHeightPx);

            photoIdx++;
        }
    }

    return canvas.toDataURL('image/jpeg', 0.92);
};
