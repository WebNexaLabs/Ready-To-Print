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
    const LAYOUT_GAP = 16;   // Used for layout calculation only (keeps photo size & count unchanged)
    const BORDER = 1;
    const LAYOUT_MARGIN = 12; // Used for layout calculation only
    const usableW = pageSize.widthPx - LAYOUT_MARGIN * 2;
    const usableH = pageSize.heightPx - LAYOUT_MARGIN * 2;

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
        cols = Math.floor((usableW + LAYOUT_GAP) / (photoWidthPx + LAYOUT_GAP));
        rows = Math.floor((usableH + LAYOUT_GAP) / (photoHeightPx + LAYOUT_GAP));
        if (cols * rows >= MIN_PHOTOS) break;
        photoWidthPx = Math.round(photoWidthPx * 0.95);
        photoHeightPx = Math.round(photoHeightPx * 0.95);
    }

    // Distribute spacing: gap = 2 * margin (the user's V / 2V rule)
    // Total horizontal space: marginX + cols*photoW + (cols-1)*gapX + marginX = pageWidth
    // With gapX = 2*marginX:  marginX*(2 + 2*(cols-1)) + cols*photoW = pageWidth
    //                          marginX*(2*cols) + cols*photoW = pageWidth
    const marginX = cols > 0 ? Math.floor((pageSize.widthPx - cols * photoWidthPx) / (2 * cols)) : 0;
    const drawGapX = marginX * 2;

    // Same rule vertically
    const marginY = rows > 0 ? Math.floor((pageSize.heightPx - rows * photoHeightPx) / (2 * rows)) : 0;
    const drawGapY = marginY * 2;

    // Center the grid on the page
    const totalGridWidth = cols * photoWidthPx + (cols - 1) * drawGapX;
    const totalGridHeight = rows * photoHeightPx + (rows - 1) * drawGapY;
    const offsetX = Math.floor((pageSize.widthPx - totalGridWidth) / 2);
    const offsetY = Math.floor((pageSize.heightPx - totalGridHeight) / 2);

    // Draw photos — cycle through loaded images
    let photoIdx = 0;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (photoIdx >= loadedImages.length) break;

            const x = offsetX + col * (photoWidthPx + drawGapX);
            const y = offsetY + row * (photoHeightPx + drawGapY);

            const img = loadedImages[photoIdx];
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

export const getMaxPhotosPerPage = (docType, pageSize) => {
    // Reuse logic to calculate max capacity
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

    const GAP = 16;
    const MARGIN = 12;
    const usableW = pageSize.widthPx - MARGIN * 2;
    const usableH = pageSize.heightPx - MARGIN * 2;

    let photoWidthPx = basePhotoW;
    let photoHeightPx = basePhotoH;
    let cols, rows;

    if (photoWidthPx > usableW * 0.45) {
        const scale = (usableW * 0.45) / photoWidthPx;
        photoWidthPx = Math.round(photoWidthPx * scale);
        photoHeightPx = Math.round(photoHeightPx * scale);
    }

    // Default min just to calculate max capacity (we want packing efficiency)
    // We use the same loop as generation to match exactly
    const MIN_PHOTOS = pageSize.minPhotos || 10;

    for (let attempt = 0; attempt < 20; attempt++) {
        cols = Math.floor((usableW + GAP) / (photoWidthPx + GAP));
        rows = Math.floor((usableH + GAP) / (photoHeightPx + GAP));
        if (cols * rows >= MIN_PHOTOS) break;
        photoWidthPx = Math.round(photoWidthPx * 0.95);
        photoHeightPx = Math.round(photoHeightPx * 0.95);
    }

    return { max: cols * rows, cols, rows, photoWidthPx, photoHeightPx };
};
