"use client";

import { useState } from 'react';
import { DisputeEvidenceFileDto } from '@/app/data/types/strikes';
import { XMarkIcon, ArrowDownTrayIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface DisputeEvidenceViewerProps {
    files: DisputeEvidenceFileDto[];
}

export default function DisputeEvidenceViewer({ files }: DisputeEvidenceViewerProps) {
    const [selectedFile, setSelectedFile] = useState<DisputeEvidenceFileDto | null>(null);

    if (!files || files.length === 0) {
        return null;
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const isImageFile = (fileType: string): boolean => {
        return fileType.startsWith('image/');
    };

    const handleDownload = (file: DisputeEvidenceFileDto) => {
        window.open(file.fileUrl, '_blank');
    };

    return (
        <>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-purple-800 uppercase tracking-wider mb-3 flex items-center">
                    <PhotoIcon className="h-5 w-5 mr-2" />
                    Dispute Evidence Files ({files.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {files.map((file, index) => (
                        <div
                            key={file.id || index}
                            className="relative group cursor-pointer border border-purple-200 rounded-lg overflow-hidden bg-white hover:border-purple-400 transition-all"
                            onClick={() => setSelectedFile(file)}
                        >
                            {isImageFile(file.fileType) ? (
                                <div className="aspect-square relative">
                                    <img
                                        src={file.fileUrl}
                                        alt={file.fileName}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                                        <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-medium">
                                            Click to view
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="aspect-square flex flex-col items-center justify-center bg-gray-50 p-2">
                                    <PhotoIcon className="h-12 w-12 text-gray-400 mb-2" />
                                    <span className="text-xs text-gray-600 text-center truncate w-full px-1">
                                        {file.fileType.split('/')[1]?.toUpperCase() || 'FILE'}
                                    </span>
                                </div>
                            )}
                            <div className="p-2 bg-white border-t border-purple-100">
                                <p className="text-xs font-medium text-gray-700 truncate" title={file.fileName}>
                                    {file.fileName}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatFileSize(file.fileSize)}
                                </p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(file);
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                                title="Download file"
                            >
                                <ArrowDownTrayIcon className="h-4 w-4 text-gray-700" />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mt-3 text-xs text-purple-700">
                    <p>📎 Vendor uploaded these files to support their dispute</p>
                </div>
            </div>

            {/* Full Screen Viewer Modal */}
            {selectedFile && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 z-[70] flex items-center justify-center p-4"
                    onClick={() => setSelectedFile(null)}
                >
                    <div className="relative max-w-6xl max-h-[90vh] w-full">
                        <button
                            onClick={() => setSelectedFile(null)}
                            className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 shadow-lg z-10"
                        >
                            <XMarkIcon className="h-6 w-6 text-gray-700" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(selectedFile);
                            }}
                            className="absolute top-4 left-4 p-2 bg-white rounded-full hover:bg-gray-100 shadow-lg z-10 flex items-center space-x-2"
                        >
                            <ArrowDownTrayIcon className="h-5 w-5 text-gray-700" />
                            <span className="text-sm font-medium text-gray-700 pr-2">Download</span>
                        </button>
                        <div className="flex items-center justify-center h-full" onClick={(e) => e.stopPropagation()}>
                            {isImageFile(selectedFile.fileType) ? (
                                <img
                                    src={selectedFile.fileUrl}
                                    alt={selectedFile.fileName}
                                    className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                                />
                            ) : (
                                <div className="bg-white rounded-lg p-8 text-center shadow-2xl">
                                    <PhotoIcon className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {selectedFile.fileName}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        File type: {selectedFile.fileType}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-6">
                                        Size: {formatFileSize(selectedFile.fileSize)}
                                    </p>
                                    <button
                                        onClick={() => handleDownload(selectedFile)}
                                        className="px-4 py-2 bg-primary-500 text-white rounded-button hover:bg-primary-600 flex items-center space-x-2 mx-auto"
                                    >
                                        <ArrowDownTrayIcon className="h-5 w-5" />
                                        <span>Download File</span>
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-4 py-2 shadow-lg">
                            <p className="text-sm font-medium text-gray-900">{selectedFile.fileName}</p>
                            <p className="text-xs text-gray-600">
                                {formatFileSize(selectedFile.fileSize)} • Uploaded {new Date(selectedFile.uploadedAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
