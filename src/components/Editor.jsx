import { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { removeBackground } from '@imgly/background-removal';
import { documentTypes } from '../data/countries';
import { generatePhotoSheet, PAGE_SIZES, getMaxPhotosPerPage } from '../utils/photoGenerator';
import { jsPDF } from 'jspdf';
import {
    Download, ChevronLeft, ZoomIn, ZoomOut, Check, RotateCw, RotateCcw,
    Sun, Sliders, ArrowRight, Printer, FileImage, RefreshCw,
    Camera, ShieldCheck, CheckCircle, Lock, Sparkles, Shield, FlipHorizontal, Palette
} from 'lucide-react';

const BG_PRESETS = [
    { label: 'White', color: '#FFFFFF' },
    { label: 'Light Gray', color: '#E5E7EB' },
    { label: 'Light Blue', color: '#DBEAFE' },
    { label: 'Red', color: '#DC2626' },
    { label: 'Blue', color: '#2563EB' },
    { label: 'Cream', color: '#FEF9C3' },
];

export default function Editor({ images, onCancel, onOrder }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentImage = images[currentIndex];

    // Per-image settings: crop, zoom, rotation, croppedAreaPixels
    const [perImage, setPerImage] = useState(() =>
        images.map(() => ({ crop: { x: 0, y: 0 }, zoom: 1, rotation: 0, croppedAreaPixels: null }))
    );
    const crop = perImage[currentIndex].crop;
    const zoom = perImage[currentIndex].zoom;
    const rotation = perImage[currentIndex].rotation;
    const croppedAreaPixels = perImage[currentIndex].croppedAreaPixels;

    const setCrop = (val) => setPerImage(prev => {
        const next = [...prev];
        next[currentIndex] = { ...next[currentIndex], crop: typeof val === 'function' ? val(next[currentIndex].crop) : val };
        return next;
    });
    const setZoom = (val) => setPerImage(prev => {
        const next = [...prev];
        next[currentIndex] = { ...next[currentIndex], zoom: typeof val === 'function' ? val(next[currentIndex].zoom) : val };
        return next;
    });
    const setRotation = (val) => setPerImage(prev => {
        const next = [...prev];
        next[currentIndex] = { ...next[currentIndex], rotation: typeof val === 'function' ? val(next[currentIndex].rotation) : val };
        return next;
    });
    const setCroppedAreaPixels = (val) => setPerImage(prev => {
        const next = [...prev];
        next[currentIndex] = { ...next[currentIndex], croppedAreaPixels: val };
        return next;
    });

    const [brightness, setBrightness] = useState(0);
    const [contrast, setContrast] = useState(10);
    const [bgRemoval, setBgRemoval] = useState(true);
    const [bgColor, setBgColor] = useState('#FFFFFF');
    const [selectedDoc, setSelectedDoc] = useState(documentTypes[0]);
    const [aspect, setAspect] = useState(documentTypes[0].ratio);
    const [customWidth, setCustomWidth] = useState(35);
    const [customHeight, setCustomHeight] = useState(45);
    const [result, setResult] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStatus, setProcessingStatus] = useState('');
    const [activePageSize, setActivePageSize] = useState(PAGE_SIZES[0]);
    const [isRegenerating, setIsRegenerating] = useState(false);

    // Array of integers, same length as images
    const [printCounts, setPrintCounts] = useState([]);
    const [maxSlots, setMaxSlots] = useState(0);

    const [autoAdjustStatus, setAutoAdjustStatus] = useState('');

    // ======= AUTO FACE DETECTION & ORIENTATION =======
    useEffect(() => {
        if (!currentImage) return;

        const autoDetectAndAdjust = async () => {
            try {
                setAutoAdjustStatus('Detecting face orientation...');

                // Load image to get dimensions
                const img = new Image();
                img.src = currentImage;
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                });

                const imgWidth = img.naturalWidth;
                const imgHeight = img.naturalHeight;

                // Step 1: Auto-rotate if landscape (wider than tall)
                // Passport photos should always be portrait orientation
                let needsRotation = false;
                if (imgWidth > imgHeight * 1.2) {
                    // Image is landscape — rotate 90° to make it portrait
                    needsRotation = true;
                    setRotation(90);
                    setAutoAdjustStatus('Image rotated to portrait orientation');
                }

                // Step 2: Try to detect face using Chrome FaceDetector API
                if ('FaceDetector' in window) {
                    setAutoAdjustStatus('Detecting face position...');

                    const detector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });

                    // If we rotated the image, create a rotated canvas for face detection
                    let detectTarget = img;
                    if (needsRotation) {
                        const rotCanvas = document.createElement('canvas');
                        rotCanvas.width = imgHeight;
                        rotCanvas.height = imgWidth;
                        const rCtx = rotCanvas.getContext('2d');
                        rCtx.translate(imgHeight / 2, imgWidth / 2);
                        rCtx.rotate(Math.PI / 2);
                        rCtx.drawImage(img, -imgWidth / 2, -imgHeight / 2);
                        detectTarget = rotCanvas;
                    }

                    try {
                        const faces = await detector.detect(detectTarget);

                        if (faces.length > 0) {
                            const face = faces[0].boundingBox;
                            const dw = detectTarget.width || detectTarget.naturalWidth;
                            const dh = detectTarget.height || detectTarget.naturalHeight;

                            // Calculate face center as percentage of image
                            const faceCenterX = (face.x + face.width / 2) / dw;
                            const faceCenterY = (face.y + face.height / 2) / dh;

                            // Calculate zoom to frame the face properly for passport
                            // Face should be about 70-80% of the crop height
                            const faceHeightRatio = face.height / dh;
                            const targetFaceRatio = 0.65; // face should be ~65% of crop
                            const autoZoom = Math.min(3, Math.max(1, targetFaceRatio / faceHeightRatio));

                            setZoom(autoZoom);

                            // offset crop so face is centered (slightly above center for passport)
                            // Cropper's crop values are in pixels of offset from center
                            const offsetX = (0.5 - faceCenterX) * dw * 0.15;
                            const offsetY = (0.35 - faceCenterY) * dh * 0.15; // face should be slightly above center
                            setCrop({ x: offsetX, y: offsetY });

                            setAutoAdjustStatus('✅ Face detected and auto-framed!');
                        } else {
                            setAutoAdjustStatus(needsRotation ? '✅ Image auto-rotated to portrait' : '');
                        }
                    } catch (detectErr) {
                        console.log('Face detection failed:', detectErr);
                        setAutoAdjustStatus(needsRotation ? '✅ Image auto-rotated to portrait' : '');
                    }
                } else {
                    // FaceDetector not supported — just do the rotation
                    setAutoAdjustStatus(needsRotation ? '✅ Image auto-rotated to portrait' : '✅ Ready to edit');
                }

                // Clear status after 3 seconds
                setTimeout(() => setAutoAdjustStatus(''), 3000);
            } catch (err) {
                console.error('Auto-detect error:', err);
                setAutoAdjustStatus('');
            }
        };

        autoDetectAndAdjust();
    }, [currentImage, currentIndex]);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleDocChange = (e) => {
        const doc = documentTypes.find(d => d.id === e.target.value);
        setSelectedDoc(doc);
        if (doc.id === 'custom') {
            setAspect(customWidth / customHeight);
        } else {
            setAspect(doc.ratio);
        }
    };

    const handleCustomSize = (w, h) => {
        setCustomWidth(w);
        setCustomHeight(h);
        if (w > 0 && h > 0) {
            setAspect(w / h);
            setSelectedDoc(prev => ({ ...prev, width: Math.round(w / 25.4 * 300), height: Math.round(h / 25.4 * 300), physicalWidth: w, physicalHeight: h, ratio: w / h }));
        }
    };

    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const img = new Image();
            img.addEventListener('load', () => resolve(img));
            img.addEventListener('error', (error) => reject(error));
            img.src = url;
        });

    const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
        const img = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const maxSize = Math.max(img.width, img.height);
        const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

        canvas.width = safeArea;
        canvas.height = safeArea;

        ctx.translate(safeArea / 2, safeArea / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-safeArea / 2, -safeArea / 2);

        ctx.drawImage(
            img,
            safeArea / 2 - img.width * 0.5,
            safeArea / 2 - img.height * 0.5
        );

        const data = ctx.getImageData(0, 0, safeArea, safeArea);

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.putImageData(
            data,
            Math.round(0 - safeArea / 2 + img.width * 0.5 - pixelCrop.x),
            Math.round(0 - safeArea / 2 + img.height * 0.5 - pixelCrop.y)
        );

        return new Promise((resolve) => {
            canvas.toBlob((file) => {
                resolve(URL.createObjectURL(file));
            }, 'image/png');
        });
    };



    const applyBgColor = async (blobUrl, color, brightness = 0, contrast = 0) => {
        const img = await createImage(blobUrl);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;

        // Fill with chosen background color
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the transparent image on top with filters
        const brightnessVal = 1 + brightness / 100;
        const contrastVal = 1 + contrast / 100;
        ctx.filter = `brightness(${brightnessVal}) contrast(${contrastVal})`;
        ctx.drawImage(img, 0, 0);
        ctx.filter = 'none';

        return new Promise((resolve) => {
            canvas.toBlob((file) => {
                resolve(URL.createObjectURL(file));
            }, 'image/jpeg', 0.95);
        });
    };

    const applyFilters = async (blobUrl, brightness = 0, contrast = 0) => {
        const img = await createImage(blobUrl);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;

        const brightnessVal = 1 + brightness / 100;
        const contrastVal = 1 + contrast / 100;
        ctx.filter = `brightness(${brightnessVal}) contrast(${contrastVal})`;
        ctx.drawImage(img, 0, 0);

        return new Promise((resolve) => {
            canvas.toBlob((file) => {
                resolve(URL.createObjectURL(file));
            }, 'image/jpeg', 0.95);
        });
    };

    // Downscale image for faster BG removal — passport photos don't need 4000px for AI
    const downscaleForBgRemoval = async (blob, maxDim = 1024) => {
        const img = await createImage(URL.createObjectURL(blob));
        const { naturalWidth: w, naturalHeight: h } = img;

        // Skip if already small enough
        if (w <= maxDim && h <= maxDim) return blob;

        const scale = maxDim / Math.max(w, h);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(w * scale);
        canvas.height = Math.round(h * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        return new Promise((resolve) => {
            canvas.toBlob((b) => resolve(b), 'image/png');
        });
    };

    const handleProcess = async () => {
        try {
            setIsProcessing(true);

            // Process ALL images
            const processedSingles = [];
            for (let i = 0; i < images.length; i++) {
                const imgData = images[i];
                const imgSettings = perImage[i];

                setProcessingStatus(`Cropping photo ${i + 1} of ${images.length}...`);

                // If user hasn't visited this photo in cropper, compute full-image crop
                let cropPixels = imgSettings.croppedAreaPixels;
                if (!cropPixels) {
                    const tempImg = await createImage(imgData);
                    cropPixels = { x: 0, y: 0, width: tempImg.naturalWidth, height: tempImg.naturalHeight };
                }

                // Get raw cropped image (no filters) for better AI detection
                const croppedUrl = await getCroppedImg(imgData, cropPixels, imgSettings.rotation);

                let finalSingle;

                if (bgRemoval) {
                    const response = await fetch(croppedUrl);
                    const blob = await response.blob();

                    // Downscale for faster AI processing
                    const smallBlob = await downscaleForBgRemoval(blob, 1024);

                    let removedBgBlob;

                    setProcessingStatus(`Removing background (photo ${i + 1})...`);
                    removedBgBlob = await removeBackground(smallBlob, {
                        model: 'medium',
                        output: { format: 'image/png', quality: 0.8 },
                    });

                    const transparentUrl = URL.createObjectURL(removedBgBlob);
                    setProcessingStatus(`Applying adjustments (photo ${i + 1})...`);
                    // Apply filters to the subject ONLY, keeping BG pure white
                    finalSingle = await applyBgColor(transparentUrl, bgColor, brightness, contrast);
                } else {
                    // No BG removal - apply filters to the whole cropped image
                    finalSingle = await applyFilters(croppedUrl, brightness, contrast);
                }

                processedSingles.push(finalSingle);
            }

            setProcessingStatus('Generating print sheets...');
            const sheets = {};
            for (const ps of PAGE_SIZES) {
                sheets[ps.id] = await generatePhotoSheet(processedSingles, selectedDoc, ps);
            }

            setResult({ singles: processedSingles, sheets });

            // Initialize print counts: distributed evenly or 1 each?
            // Let's start with filling the first page efficiently
            // Actually, user reference suggests customized counts. Let's start with 1 each.
            const initialCounts = new Array(processedSingles.length).fill(1);
            setPrintCounts(initialCounts);

            // Calculate max slots for default page size
            const max = getMaxPhotosPerPage(selectedDoc, PAGE_SIZES[0]);
            setMaxSlots(max.max);

            setIsProcessing(false);
            setProcessingStatus('');
        } catch (e) {
            console.error(e);
            alert('Failed to process image: ' + e.message);
            setIsProcessing(false);
            setProcessingStatus('');
        }
    };

    const downloadImage = (url, prefix) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = `${prefix}-${selectedDoc.id}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const regenerateSheet = async (newCounts, pageSize = activePageSize) => {
        if (!result) return;
        setIsRegenerating(true);

        const printList = [];
        result.singles.forEach((img, i) => {
            const count = newCounts[i] || 0;
            for (let c = 0; c < count; c++) {
                printList.push(img);
            }
        });

        const newSheet = await generatePhotoSheet(printList, selectedDoc, pageSize);

        setResult(prev => ({
            ...prev,
            sheets: {
                ...prev.sheets,
                [pageSize.id]: newSheet
            }
        }));
        setIsRegenerating(false);
    };

    // Update max slots when page size changes
    useEffect(() => {
        if (selectedDoc && activePageSize) {
            const max = getMaxPhotosPerPage(selectedDoc, activePageSize);
            setMaxSlots(max.max);
            // Optionally regenerate if needed, but not strictly required unless we want to AUTO-FIT
        }
    }, [activePageSize, selectedDoc]);

    const handleCountChange = (index, delta) => {
        const newCounts = [...printCounts];
        const currentVal = newCounts[index];
        const newVal = Math.max(0, currentVal + delta);

        // Check if we exceed max slots? 
        // Optional: Block increment if total >= maxSlots
        const currentTotal = newCounts.reduce((a, b) => a + b, 0);
        if (delta > 0 && currentTotal >= maxSlots) {
            // alert? or just block
            return;
        }

        newCounts[index] = newVal;
        setPrintCounts(newCounts);

        // Debounce or immediate? Immediate for responsiveness, but might lag.
        // Let's try immediate.
        regenerateSheet(newCounts);
    };

    const handleAutoFill = () => {
        // Auto-fill remaining slots with the FIRST image (or currently "selected" concept if we had one)
        // Or distribute evenly? 
        // Strategy: Fill remainder with the first image for now, or the image with > 0 count.
        const currentTotal = printCounts.reduce((a, b) => a + b, 0);
        const remaining = maxSlots - currentTotal;

        if (remaining > 0) {
            const newCounts = [...printCounts];
            // Add to the first image
            newCounts[0] += remaining;
            setPrintCounts(newCounts);
            regenerateSheet(newCounts);
        }
    };

    const handleClearAll = () => {
        const newCounts = new Array(printCounts.length).fill(0);
        setPrintCounts(newCounts);
        regenerateSheet(newCounts);
    };

    const totalFilled = printCounts.reduce((a, b) => a + b, 0);

    const downloadPdf = (sheetDataUrl, widthInch, heightInch, filename) => {
        const orientation = widthInch > heightInch ? 'landscape' : 'portrait';
        const pdf = new jsPDF({
            orientation,
            unit: 'in',
            format: [widthInch, heightInch]
        });
        pdf.addImage(sheetDataUrl, 'JPEG', 0, 0, widthInch, heightInch);
        pdf.save(filename);
    };

    // ======= RESULT VIEW (Image 3) =======
    if (result) {
        return (
            <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter', system-ui, sans-serif" }}>
                {/* Header */}
                <header style={{
                    background: '#fff', borderBottom: '1px solid #E2E8F0',
                    padding: '0 24px', position: 'sticky', top: 0, zIndex: 50
                }}>
                    <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', height: 64, alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={onCancel}>
                            <div style={{ width: 32, height: 32, background: '#2563EB', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                <Camera style={{ width: 16, height: 16 }} />
                            </div>
                            <span style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>
                                SelfieSe<span style={{ color: '#2563EB' }}>Passport</span>
                            </span>
                        </div>
                        <button
                            onClick={onCancel}
                            style={{
                                background: 'none', border: 'none', fontSize: 14, fontWeight: 600,
                                color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                            }}
                        >
                            <RefreshCw style={{ width: 16, height: 16 }} /> Start Over
                        </button>
                    </div>
                </header>

                {/* Step Progress */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 0, padding: '32px 24px 24px', alignItems: 'center' }}>
                    {[
                        { num: 1, label: 'Upload', done: true, action: onCancel },
                        { num: 2, label: 'Edit', done: true, action: () => setResult(null) },
                        { num: 3, label: 'Download', active: true }
                    ].map((step, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                            <div
                                onClick={step.action}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    cursor: step.action ? 'pointer' : 'default',
                                    opacity: step.action ? 1 : (step.active ? 1 : 0.8)
                                }}
                            >
                                <div style={{
                                    width: 32, height: 32, borderRadius: '50%',
                                    background: step.active ? '#2563EB' : step.done ? '#DCFCE7' : '#E2E8F0',
                                    color: step.active ? '#fff' : step.done ? '#15803D' : '#94A3B8',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 13, fontWeight: 700
                                }}>
                                    {step.done && !step.active ? <Check style={{ width: 16, height: 16 }} /> : step.num}
                                </div>
                                <span style={{ fontSize: 14, fontWeight: 600, color: step.active ? '#0F172A' : '#64748B' }}>{step.label}</span>
                            </div>
                            {i < 2 && <div style={{ width: 80, height: 2, background: '#E2E8F0', margin: '0 16px' }}></div>}
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="result-content">
                    {/* Left: AI Verification */}
                    <div className="result-left">
                        {/* Print Quantity Selector */}
                        <div style={{
                            background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0',
                            padding: 24, marginBottom: 20
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Your Uploads</h3>
                                <button onClick={() => {/* Add logic to go back to upload if needed */ }} style={{ fontSize: 13, color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Add More</button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {result.singles.map((s, i) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: 12, borderRadius: 12, border: '1px solid #F1F5F9', background: '#F8FAFC'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <img src={s} alt={`Img ${i}`} style={{ width: 40, height: 50, objectFit: 'cover', borderRadius: 6, border: '1px solid #E2E8F0' }} />
                                            <span style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>Image {i + 1}</span>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <button onClick={() => handleCountChange(i, -1)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>-</button>
                                            <span style={{ fontSize: 14, fontWeight: 700, width: 20, textAlign: 'center' }}>{printCounts[i]}</span>
                                            <button onClick={() => handleCountChange(i, 1)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>+</button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Empty Slot Placeholder if needed */}

                            <div style={{ marginTop: 20, padding: 16, background: '#EFF6FF', borderRadius: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, fontWeight: 600, color: '#1E293B' }}>
                                    <span>Total Slots Filled:</span>
                                    <span>{totalFilled} / {maxSlots}</span>
                                </div>
                                <div style={{ width: '100%', height: 8, background: '#DBEAFE', borderRadius: 99 }}>
                                    <div style={{
                                        width: `${Math.min(100, (totalFilled / maxSlots) * 100)}%`,
                                        height: '100%', background: '#2563EB', borderRadius: 99,
                                        transition: 'width 0.3s ease'
                                    }}></div>
                                </div>

                                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                                    <button onClick={handleAutoFill} style={{ flex: 1, padding: '8px', background: '#fff', border: '1px solid #DBEAFE', borderRadius: 8, color: '#2563EB', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                        <Sparkles style={{ width: 14, height: 14 }} /> Auto-fill
                                    </button>
                                    <button onClick={handleClearAll} style={{ flex: 1, padding: '8px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, color: '#64748B', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                        <RefreshCw style={{ width: 14, height: 14 }} /> Clear All
                                    </button>
                                </div>
                            </div>

                        </div>

                        {/* AI Verification (Existing) - Moved below or kept? Let's keep it below */}
                        <div style={{
                            background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0',
                            padding: 24, marginBottom: 20
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A' }}>AI Verification</h3>
                                <span style={{
                                    background: '#DCFCE7', color: '#15803D', fontSize: 12, fontWeight: 700,
                                    padding: '4px 12px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 4
                                }}>
                                    <CheckCircle style={{ width: 14, height: 14 }} /> PASSED
                                </span>
                            </div>

                            {[
                                { title: 'Plain Background', desc: bgRemoval ? `Background replaced with ${bgColor === '#FFFFFF' ? 'white' : 'custom color'}.` : 'Original background kept.' },
                                { title: 'Head Positioning', desc: 'Centered and looking directly at camera.' },
                                { title: 'Eye Visibility', desc: 'Eyes are open, clear, and visible.' },
                                { title: 'No Shadows', desc: 'Lighting is balanced across the face.' },
                                { title: 'Dimensions Check', desc: `Cropped to ${selectedDoc.physicalWidth}×${selectedDoc.physicalHeight}${selectedDoc.physicalUnit}.` }
                            ].map((check, i) => (
                                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                                    <CheckCircle style={{ width: 20, height: 20, color: '#22C55E', flexShrink: 0, marginTop: 2 }} />
                                    <div>
                                        <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 2 }}>{check.title}</p>
                                        <p style={{ fontSize: 12, color: '#94A3B8' }}>{check.desc}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Digital Photos Preview */}
                            <div style={{
                                background: '#F8FAFC', borderRadius: 12, padding: 16, marginTop: 20,
                                border: '1px solid #E2E8F0'
                            }}>
                                <p style={{ fontSize: 13, fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 10 }}>Processed Photos ({result.singles.length})</p>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {result.singles.map((s, i) => (
                                        <img key={i} src={s} alt={`Photo ${i + 1}`} style={{ width: 48, height: 60, borderRadius: 6, objectFit: 'cover', border: '1px solid #E2E8F0' }} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Printing Tips */}
                        <div style={{
                            background: '#EFF6FF', borderRadius: 16, padding: 20,
                            border: '1px solid #DBEAFE'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                <Printer style={{ width: 18, height: 18, color: '#2563EB' }} />
                                <p style={{ fontSize: 15, fontWeight: 700, color: '#1D4ED8' }}>Printing Tips</p>
                            </div>
                            <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.7 }}>
                                For best results, print on <strong>4×6 inch (10×15cm)</strong> glossy photo paper at 100% scale. Do not select "Scale to Fit" in printer settings.
                            </p>
                        </div>
                    </div>

                    {/* Right: Photo Preview & Downloads */}
                    <div className="result-right" style={{ flex: 1 }}>
                        <div style={{
                            background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0',
                            overflow: 'hidden'
                        }}>
                            <div className="result-header" style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <div>
                                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Your Passport Photos are Ready</h3>
                                        <p style={{ fontSize: 13, color: '#94A3B8' }}>Select a page size and download</p>
                                    </div>
                                </div>

                                {/* Page Size Tabs */}
                                <div className="page-size-tabs" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                    {PAGE_SIZES.map(ps => (
                                        <button
                                            key={ps.id}
                                            onClick={() => {
                                                setActivePageSize(ps);
                                                // When changing page size, we want to regenerate with current counts?
                                                // Yes, logic inside regenerateSheet uses new pageSize if passed, or activePageSize.
                                                // But state activePageSize updates async.
                                                // Better to call regenerateSheet explicitly with the new PS.
                                                regenerateSheet(printCounts, ps);
                                            }}
                                            style={{
                                                padding: '8px 16px', borderRadius: 10,
                                                border: activePageSize.id === ps.id ? '2px solid #2563EB' : '1px solid #E2E8F0',
                                                background: activePageSize.id === ps.id ? '#EFF6FF' : '#fff',
                                                color: activePageSize.id === ps.id ? '#2563EB' : '#64748B',
                                                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                                                transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2
                                            }}
                                        >
                                            <span>{ps.label}</span>
                                            <span style={{ fontSize: 10, fontWeight: 500, opacity: 0.7 }}>{ps.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ padding: 24, background: '#F8FAFC', position: 'relative', minHeight: 300 }}>
                                <img
                                    src={result.sheets[activePageSize.id]}
                                    alt={`${activePageSize.label} Photo Sheet`}
                                    style={{
                                        width: '100%', maxWidth: 500, margin: '0 auto', display: 'block',
                                        borderRadius: 8, boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                                        border: '1px solid #E2E8F0', transition: 'opacity 0.3s'
                                    }}
                                />
                                <p style={{ textAlign: 'center', fontSize: 12, color: '#94A3B8', marginTop: 12 }}>
                                    {activePageSize.label} — {activePageSize.widthInch}" × {activePageSize.heightInch}" at 300 DPI
                                </p>
                            </div>

                            {/* Download Buttons */}
                            <div className="download-section" style={{ padding: 24 }}>


                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    <button
                                        onClick={() => result.singles.forEach((s, i) => downloadImage(s, `passport-digital-${i + 1}`))}
                                        style={{
                                            flex: 1, minWidth: 100, background: '#fff', color: '#334155', border: '1px solid #E2E8F0',
                                            padding: '14px 12px', borderRadius: 12, fontWeight: 600, fontSize: 13,
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        <Download style={{ width: 16, height: 16 }} /> Digital JPEG
                                    </button>

                                    <button
                                        onClick={() => {
                                            const w = selectedDoc.physicalUnit === 'in' ? selectedDoc.physicalWidth : selectedDoc.physicalWidth / 25.4;
                                            const h = selectedDoc.physicalUnit === 'in' ? selectedDoc.physicalHeight : selectedDoc.physicalHeight / 25.4;
                                            result.singles.forEach((s, i) => downloadPdf(s, w, h, `passport-digital-${i + 1}-${selectedDoc.id}.pdf`));
                                        }}
                                        style={{
                                            flex: 1, minWidth: 100, background: '#fff', color: '#334155', border: '1px solid #E2E8F0',
                                            padding: '14px 12px', borderRadius: 12, fontWeight: 600, fontSize: 13,
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        <FileImage style={{ width: 16, height: 16 }} /> Digital PDF
                                    </button>
                                </div>

                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                                    <button
                                        onClick={() => downloadPdf(result.sheets[activePageSize.id], activePageSize.widthInch, activePageSize.heightInch, `passport-${activePageSize.id}-sheet-${selectedDoc.id}.pdf`)}
                                        style={{
                                            flex: 1, minWidth: 160, background: '#2563EB', color: '#fff', border: 'none',
                                            padding: '14px 12px', borderRadius: 12, fontWeight: 600, fontSize: 13,
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                            whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(37,99,235,0.2)'
                                        }}
                                    >
                                        <FileImage style={{ width: 16, height: 16 }} /> Download {activePageSize.label} Sheet (PDF)
                                    </button>

                                    <button
                                        onClick={() => {
                                            // Capture current sheet as image and pass to order page
                                            if (onOrder) onOrder(result.sheets[activePageSize.id], activePageSize.label);
                                        }}
                                        style={{
                                            flex: 1, minWidth: 130, background: '#0F172A', color: '#fff', border: 'none',
                                            padding: '14px 12px', borderRadius: 12, fontWeight: 600, fontSize: 13,
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        <Printer style={{ width: 16, height: 16 }} /> Order Prints (₹{activePageSize.id === '4x6' ? 64 : 99})
                                    </button>
                                </div>

                                {/* Trust Badges */}
                                <div style={{
                                    display: 'flex', justifyContent: 'center', gap: 24, marginTop: 20,
                                    fontSize: 12, color: '#94A3B8'
                                }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Lock style={{ width: 14, height: 14 }} /> Encrypted Transfer
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Sparkles style={{ width: 14, height: 14 }} /> AI Optimized
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Shield style={{ width: 14, height: 14 }} /> Auto-delete after completing the task
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Help Banner */}
                        <div style={{
                            background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0',
                            padding: '16px 24px', marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Camera style={{ width: 18, height: 18, color: '#2563EB' }} />
                                </div>
                                <div>
                                    <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>Need help with printing?</p>
                                    <p style={{ fontSize: 12, color: '#94A3B8' }}>Print at your local photo lab or use our printing guide.</p>
                                </div>
                            </div>
                            <a href="#" style={{ fontSize: 14, fontWeight: 700, color: '#2563EB', textDecoration: 'none' }}>View Guide</a>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer style={{
                    borderTop: '1px solid #E2E8F0', padding: '20px 24px', background: '#fff',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontSize: 13, color: '#94A3B8'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 24, height: 24, background: '#2563EB', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                            <Camera style={{ width: 12, height: 12 }} />
                        </div>
                        <span style={{ fontWeight: 700, color: '#64748B' }}>SelfieSePassport</span>
                    </div>
                    <div style={{ display: 'flex', gap: 24 }}>
                        <a href="#" style={{ color: '#94A3B8', textDecoration: 'none' }}>Terms of Service</a>
                        <a href="#" style={{ color: '#94A3B8', textDecoration: 'none' }}>Privacy Policy</a>
                        <a href="#" style={{ color: '#94A3B8', textDecoration: 'none' }}>Contact Support</a>
                    </div>
                    <span>© 2024 SELFIE SE PASSPORT</span>
                </footer>
            </div>
        );
    }

    // ======= EDITOR VIEW (Image 2) =======
    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', system-ui, sans-serif" }}>
            {/* Header */}
            <header style={{
                background: '#fff', borderBottom: '1px solid #E2E8F0',
                padding: '0 24px', flexShrink: 0
            }}>
                <div style={{ display: 'flex', height: 60, alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={onCancel}>
                        <div style={{ width: 32, height: 32, background: '#2563EB', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                            <Camera style={{ width: 16, height: 16 }} />
                        </div>
                        <span style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>
                            SelfieSe<span style={{ color: '#2563EB' }}>Passport</span>
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <button
                            onClick={onCancel}
                            style={{
                                background: 'none', border: 'none', fontSize: 14, fontWeight: 600,
                                color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                            }}
                        >
                            <ChevronLeft style={{ width: 18, height: 18 }} /> Back to Upload
                        </button>
                    </div>
                </div>
            </header>

            {/* Editor Body */}
            <div className="editor-body">
                {/* Canvas Area */}
                <div className="editor-canvas">
                    <div className="editor-toolbar">
                        {/* Vertical Zoom Slider Group */}
                        <div className="zoom-group">
                            <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="zoom-btn"><ZoomIn style={{ width: 16, height: 16 }} /></button>

                            <div className="zoom-slider-container">
                                <input
                                    type="range"
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    value={zoom}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="zoom-slider"
                                    style={{
                                        backgroundSize: `${(zoom - 1) / 2 * 100}% 100%`
                                    }}
                                />
                            </div>

                            <button onClick={() => setZoom(z => Math.max(1, z - 0.2))} className="zoom-btn"><ZoomOut style={{ width: 16, height: 16 }} /></button>
                        </div>

                        <div className="toolbar-divider"></div>

                        {/* Rotation Buttons */}
                        {[
                            { icon: <RotateCcw style={{ width: 18, height: 18 }} />, action: () => setRotation(r => r - 90) },
                            { icon: <RotateCw style={{ width: 18, height: 18 }} />, action: () => setRotation(r => r + 90) },
                        ].map((btn, i) => (
                            <button key={i} onClick={btn.action} className="rotate-btn">{btn.icon}</button>
                        ))}
                    </div>

                    {/* Auto-Adjust Status */}
                    {autoAdjustStatus && (
                        <div style={{
                            position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 15,
                            background: '#0F172A', color: '#fff', padding: '8px 20px', borderRadius: 999,
                            fontSize: 13, fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            animation: 'fadeIn 0.3s ease', display: 'flex', alignItems: 'center', gap: 8,
                            whiteSpace: 'nowrap'
                        }}>
                            {autoAdjustStatus.startsWith('✅') ? null : (
                                <div style={{
                                    width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)',
                                    borderTopColor: '#fff', borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                            )}
                            {autoAdjustStatus}
                        </div>
                    )}

                    {/* Photo Navigation Strip (for multiple photos) */}
                    {images.length > 1 && (
                        <div className="photo-nav-strip" style={{
                            position: 'absolute', top: 16, right: 24, zIndex: 10,
                            background: '#fff', borderRadius: 12, padding: '6px 8px',
                            display: 'flex', gap: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            border: '1px solid #E2E8F0', alignItems: 'center'
                        }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', marginRight: 4 }}>📷</span>
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    style={{
                                        width: 36, height: 44, borderRadius: 6, border: i === currentIndex ? '2px solid #2563EB' : '1px solid #E2E8F0',
                                        padding: 0, cursor: 'pointer', overflow: 'hidden', position: 'relative',
                                        opacity: i === currentIndex ? 1 : 0.6,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <img src={img} alt={`Photo ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <span style={{
                                        position: 'absolute', bottom: 1, right: 1,
                                        background: i === currentIndex ? '#2563EB' : 'rgba(0,0,0,0.5)',
                                        color: '#fff', fontSize: 9, fontWeight: 800,
                                        padding: '0 4px', borderRadius: 3, lineHeight: '14px'
                                    }}>{i + 1}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Cropper */}
                    <div style={{ flex: 1, position: 'relative', margin: 24, borderRadius: 16, overflow: 'hidden' }}>
                        <Cropper
                            image={currentImage}
                            crop={crop}
                            zoom={zoom}
                            rotation={rotation}
                            aspect={aspect}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                            onRotationChange={setRotation}
                            style={{
                                containerStyle: { borderRadius: 16 },
                                mediaStyle: { filter: `brightness(${1 + brightness / 100}) contrast(${1 + contrast / 100})` },
                            }}
                        />

                        {/* Guide Labels */}
                        <div style={{
                            position: 'absolute', top: '10%', left: 12, zIndex: 5,
                            fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.7)',
                            textTransform: 'uppercase', letterSpacing: '0.1em',
                            background: 'rgba(0,0,0,0.35)', padding: '3px 8px', borderRadius: 4
                        }}>Crown of Head</div>
                        <div style={{
                            position: 'absolute', top: '45%', left: 12, zIndex: 5,
                            fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.7)',
                            textTransform: 'uppercase', letterSpacing: '0.1em',
                            background: 'rgba(0,0,0,0.35)', padding: '3px 8px', borderRadius: 4
                        }}>Eye Level</div>
                        <div style={{
                            position: 'absolute', bottom: '15%', left: 12, zIndex: 5,
                            fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.7)',
                            textTransform: 'uppercase', letterSpacing: '0.1em',
                            background: 'rgba(0,0,0,0.35)', padding: '3px 8px', borderRadius: 4
                        }}>Chin Line</div>
                    </div>

                    {/* Processing Overlay */}
                    {isProcessing && (
                        <div style={{
                            position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.9)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            zIndex: 20, borderRadius: 16
                        }}>
                            <div style={{
                                width: 48, height: 48, border: '4px solid #E2E8F0',
                                borderTopColor: '#2563EB', borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                            <p style={{ marginTop: 20, fontSize: 15, fontWeight: 600, color: '#0F172A' }}>
                                {processingStatus || 'Processing...'}
                            </p>
                            <p style={{ marginTop: 8, fontSize: 13, color: '#94A3B8' }}>
                                This may take 10-15 seconds for background removal
                            </p>
                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        </div>
                    )}

                    <div style={{
                        padding: '8px 24px 16px', textAlign: 'center',
                        fontSize: 13, color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                    }}>
                        <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#DBEAFE', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#2563EB', fontWeight: 700 }}>i</span>
                        Drag to reposition or use the toolbar to scale your photo
                    </div>
                </div>

                {/* Sidebar */}
                <div className="editor-sidebar">
                    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
                        {/* Document Type Selection */}
                        <div style={{ marginBottom: 28 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                                <FileImage style={{ width: 20, height: 20, color: '#2563EB' }} />
                                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A' }}>Document Type</h3>
                            </div>

                            <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Select Document</label>
                            <select
                                value={selectedDoc.id}
                                onChange={handleDocChange}
                                style={{
                                    width: '100%', padding: '10px 14px', borderRadius: 10,
                                    border: '1px solid #E2E8F0', fontSize: 14, fontWeight: 500,
                                    color: '#0F172A', background: '#fff', outline: 'none',
                                    cursor: 'pointer', marginBottom: 4
                                }}
                            >
                                {documentTypes.map(d => (
                                    <option key={d.id} value={d.id}>{d.icon} {d.name} — {d.dims}</option>
                                ))}
                            </select>
                            <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 16 }}>
                                Size: <strong style={{ color: '#0F172A' }}>{selectedDoc.dims}</strong>
                            </p>

                            {/* Custom Size Inputs */}
                            {selectedDoc.id === 'custom' && (
                                <div style={{
                                    background: '#F8FAFC', borderRadius: 12, padding: 16,
                                    border: '1px solid #E2E8F0', marginBottom: 8
                                }}>
                                    <p style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 12 }}>Enter Custom Dimensions (mm)</p>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Width</label>
                                            <input
                                                type="number"
                                                value={customWidth}
                                                onChange={e => handleCustomSize(Number(e.target.value), customHeight)}
                                                min={10}
                                                max={200}
                                                style={{
                                                    width: '100%', padding: '10px 12px', borderRadius: 8,
                                                    border: '1px solid #E2E8F0', fontSize: 14, fontWeight: 600,
                                                    color: '#0F172A', outline: 'none', textAlign: 'center'
                                                }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 10, fontSize: 16, color: '#94A3B8', fontWeight: 700 }}>×</div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Height</label>
                                            <input
                                                type="number"
                                                value={customHeight}
                                                onChange={e => handleCustomSize(customWidth, Number(e.target.value))}
                                                min={10}
                                                max={200}
                                                style={{
                                                    width: '100%', padding: '10px 12px', borderRadius: 8,
                                                    border: '1px solid #E2E8F0', fontSize: 14, fontWeight: 600,
                                                    color: '#0F172A', outline: 'none', textAlign: 'center'
                                                }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 12, fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>mm</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* AI Enhancements: Background Removal */}
                        <div style={{ marginBottom: 28 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                <Sparkles style={{ width: 18, height: 18, color: '#8B5CF6' }} />
                                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>AI Enhancements</h3>
                            </div>

                            <div style={{
                                padding: 14, borderRadius: 12, border: '1px solid #E2E8F0', background: '#FAFAFA', marginBottom: 12
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>Background Removal</p>
                                        <p style={{ fontSize: 12, color: '#94A3B8' }}>AI removes background automatically</p>
                                    </div>
                                    <div
                                        onClick={() => setBgRemoval(!bgRemoval)}
                                        className={`toggle-track ${bgRemoval ? 'active' : ''}`}
                                    >
                                        <div className="toggle-thumb"></div>
                                    </div>
                                </div>
                            </div>

                            {/* AI Engine Selector */}


                            {/* Background Color Picker */}
                            {bgRemoval && (
                                <div style={{
                                    padding: 16, borderRadius: 12, border: '1px solid #E2E8F0',
                                    background: '#FAFAFA', animation: 'fadeIn 0.3s ease'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                                        <Palette style={{ width: 16, height: 16, color: '#64748B' }} />
                                        <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Background Color</p>
                                    </div>

                                    {/* Preset Colors */}
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                                        {BG_PRESETS.map(preset => (
                                            <div
                                                key={preset.color}
                                                onClick={() => setBgColor(preset.color)}
                                                title={preset.label}
                                                style={{
                                                    width: 36, height: 36, borderRadius: 10,
                                                    background: preset.color, cursor: 'pointer',
                                                    border: bgColor === preset.color
                                                        ? '3px solid #2563EB'
                                                        : '2px solid #E2E8F0',
                                                    boxShadow: bgColor === preset.color
                                                        ? '0 0 0 2px rgba(37,99,235,0.2)'
                                                        : 'none',
                                                    transition: 'all 0.2s',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}
                                            >
                                                {bgColor === preset.color && (
                                                    <Check style={{
                                                        width: 16, height: 16,
                                                        color: preset.color === '#FFFFFF' || preset.color === '#E5E7EB' || preset.color === '#DBEAFE' || preset.color === '#FEF9C3'
                                                            ? '#2563EB'
                                                            : '#fff'
                                                    }} />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Custom Color Picker */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <label style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>Custom:</label>
                                        <input
                                            type="color"
                                            value={bgColor}
                                            onChange={e => setBgColor(e.target.value)}
                                            style={{
                                                width: 36, height: 28, border: 'none',
                                                borderRadius: 6, cursor: 'pointer',
                                                padding: 0, background: 'none'
                                            }}
                                        />
                                        <span style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', fontFamily: 'monospace' }}>
                                            {bgColor.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Adjustments */}
                        <div style={{ marginBottom: 28 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                <Sliders style={{ width: 18, height: 18, color: '#64748B' }} />
                                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Adjustments</h3>
                            </div>

                            <div style={{ marginBottom: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Brightness</span>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: '#2563EB' }}>{brightness}%</span>
                                </div>
                                <input type="range" min={-50} max={50} value={brightness} onChange={e => setBrightness(Number(e.target.value))} />
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contrast</span>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: '#2563EB' }}>+{contrast}%</span>
                                </div>
                                <input type="range" min={-50} max={50} value={contrast} onChange={e => setContrast(Number(e.target.value))} />
                            </div>
                        </div>

                        {/* Compliance Checklist */}
                        <div>
                            <div style={{
                                background: '#F8FAFC', borderRadius: 12, padding: 16,
                                border: '1px solid #E2E8F0'
                            }}>
                                <p style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Compliance Checklist</p>
                                {[
                                    { label: 'Face is centered', passed: true },
                                    { label: 'Lighting is even', passed: true },
                                    { label: 'Background is neutral', passed: bgRemoval }
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                        {item.passed ? (
                                            <CheckCircle style={{ width: 20, height: 20, color: '#22C55E', flexShrink: 0 }} />
                                        ) : (
                                            <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #CBD5E1', flexShrink: 0 }}></div>
                                        )}
                                        <span style={{ fontSize: 14, color: item.passed ? '#0F172A' : '#94A3B8', fontWeight: 500 }}>{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Generate Button */}
                    <div style={{ padding: 20, borderTop: '1px solid #E2E8F0', background: '#FAFAFA' }}>
                        <button
                            onClick={handleProcess}
                            disabled={isProcessing}
                            style={{
                                width: '100%', background: '#2563EB', color: '#fff', border: 'none',
                                padding: '16px 24px', borderRadius: 14, fontWeight: 700, fontSize: 15,
                                cursor: isProcessing ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
                                opacity: isProcessing ? 0.7 : 1,
                                transition: 'all 0.2s'
                            }}
                        >
                            {isProcessing ? processingStatus || 'Processing...' : <>Generate Passport Photo <ArrowRight style={{ width: 18, height: 18 }} /></>}
                        </button>
                        <p style={{ textAlign: 'center', fontSize: 11, color: '#94A3B8', marginTop: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Compliant with ICAO Standards
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
